import { randomUUID, timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const batchSize = 8;
const maxAttempts = 7;
const baseRetryMinutes = 5;
const maximumRetryMinutes = 120;
const emailApi = 'https://api.resend.com/emails';
const crmUrl = 'https://www.caosdomado.com.br/crm/';

function authorized(header, secret) {
  if (!secret || typeof header !== 'string') return false;
  const expected = Buffer.from('Bearer ' + secret);
  const received = Buffer.from(header);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

async function send(fetcher, env, schema, task) {
  try {
    const response = await fetcher(emailApi, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.key,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'caosdomado/' + schema + '/new-opportunity/' + task.reference
      },
      body: JSON.stringify(task.payload),
      signal: AbortSignal.timeout(7000)
    });
    const data = await response.json().catch(() => null);
    if (response.ok && typeof data?.id === 'string' && data.id.length > 0 && data.id.length <= 128) {
      return { id: data.id };
    }
    return {
      error: response.ok ? 'provider_missing_id' : 'provider_' + response.status,
      permanent: response.status === 400 || response.status === 422 ||
        (response.status === 409 && data?.name === 'invalid_idempotent_request')
    };
  } catch {
    return { error: 'provider_unreachable' };
  }
}

async function processQueue(sql, schema, env, fetcher) {
  const table = schema + '.notification_outbox';
  const expired = await sql.query(
    'UPDATE ' + table + " SET failed_at = now(), lease_token = NULL, last_error = COALESCE(last_error, 'retry_window_expired')" +
    ' WHERE sent_at IS NULL AND failed_at IS NULL AND available_at <= now()' +
    " AND (attempts >= $1 OR first_attempt_at <= now() - interval '23 hours') RETURNING 1",
    [maxAttempts]
  );

  const lease = randomUUID();
  const tasks = await sql.query(
    'WITH ready AS (SELECT reference FROM ' + table +
    ' WHERE sent_at IS NULL AND failed_at IS NULL AND available_at <= now() AND attempts < $1' +
    " AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')" +
    ' ORDER BY available_at, reference LIMIT $2 FOR UPDATE SKIP LOCKED)' +
    ' UPDATE ' + table + ' AS item' +
    " SET available_at = now() + interval '3 minutes', lease_token = $3::uuid," +
    ' attempts = item.attempts + 1, first_attempt_at = COALESCE(item.first_attempt_at, now()),' +
    " payload = COALESCE(item.payload, jsonb_build_object('from', $4::text, 'to', jsonb_build_array($5::text)," +
    " 'subject', $7::text, 'text'," +
    " 'Chegou um novo pedido pelo formulário do portfólio.' || chr(10) || 'Referência: ' || item.reference ||" +
    " chr(10) || 'Abra o CRM e busque pela referência para ver os detalhes: ' || $6::text))" +
    ' FROM ready WHERE item.reference = ready.reference' +
    ' RETURNING item.reference, item.attempts, item.payload',
    [maxAttempts, batchSize, lease, env.from, env.to, env.url, env.subject]
  );

  let accepted = 0;
  let retried = 0;
  let failed = expired.length;
  for (const task of tasks) {
    const result = await send(fetcher, env, schema, task);
    if (result.id) {
      const completed = await sql.query(
        'UPDATE ' + table + ' SET sent_at = now(), provider_id = $3, lease_token = NULL, last_error = NULL' +
        ' WHERE reference = $1 AND lease_token = $2::uuid RETURNING 1',
        [task.reference, lease, result.id]
      );
      accepted += completed.length;
      continue;
    }
    const permanent = Boolean(result.permanent) || task.attempts >= maxAttempts;
    const delay = Math.min(maximumRetryMinutes, baseRetryMinutes * 2 ** (task.attempts - 1));
    const recorded = await sql.query(
      'UPDATE ' + table + ' SET lease_token = NULL, last_error = $3,' +
      ' failed_at = CASE WHEN $4::boolean THEN now() END,' +
      ' available_at = now() + make_interval(mins => $5::integer)' +
      ' WHERE reference = $1 AND lease_token = $2::uuid RETURNING 1',
      [task.reference, lease, result.error, permanent, delay]
    );
    if (permanent) failed += recorded.length;
    else retried += recorded.length;
  }

  const [pending] = await sql.query(
    'SELECT count(*)::integer AS count FROM ' + table + ' WHERE sent_at IS NULL AND failed_at IS NULL'
  );
  return { processed: tasks.length, accepted, retried, failed, pending: pending.count };
}

export function makeNotificationsHandler({ connect = neon, fetcher = globalThis.fetch, config = process.env } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'method' });
    }
    if (!authorized(req.headers.authorization, config.CRON_SECRET?.trim())) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const database = config.CRM_DB_DATABASE_URL?.trim();
    const env = {
      key: config.RESEND_API_KEY?.trim(),
      from: config.CRM_NOTIFICATION_FROM?.trim(),
      to: config.CRM_NOTIFICATION_TO?.trim(),
      url: config.VERCEL_ENV === 'preview' && /^[a-z0-9-]+\.vercel\.app$/.test(config.VERCEL_URL || '') ?
        'https://' + config.VERCEL_URL + '/crm/' : crmUrl,
      subject: (config.VERCEL_ENV === 'preview' ? '[Prévia] ' : '') + 'Novo pedido no CRM · Caos Domado'
    };
    if (!database || !env.key || !env.from || !env.to) {
      console.warn('CRM notification configuration is incomplete');
      return res.status(503).json({ error: 'unavailable' });
    }
    const schema = config.VERCEL_ENV === 'production' ? 'crm' : 'crm_preview';
    try {
      const outcome = await processQueue(connect(database), schema, env, fetcher);
      if (outcome.retried || outcome.failed) console.warn('CRM notification delivery needs attention', outcome);
      return res.status(outcome.failed ? 502 : 200).json(outcome);
    } catch (error) {
      console.error('CRM notification processing failed', error.code || error.name);
      return res.status(503).json({ error: 'unavailable' });
    }
  };
}

export default makeNotificationsHandler();
