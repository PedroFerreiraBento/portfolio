const timezone = 'America/Sao_Paulo';
const kinds = new Set(['entry', 'demo', 'whatsapp', 'email']);
const dayMs = 86_400_000;
const time = new Intl.DateTimeFormat('sv-SE', {timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'});

function asDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : NaN;
}

function slug(value, fallback) {
  return typeof value === 'string' && /^[a-z0-9_-]{1,48}$/.test(value) ? value : fallback;
}

function isQa(origin, campaign) {
  return origin === 'verificacao' || campaign.startsWith('qa-');
}

export async function handleFunnel({action, sql, schema, data, query, reply, limit}) {
  const events = schema + '.funnel_events';
  if (action === 'track') {
    const {visit_id: visitId, kind, placement} = data;
    if (typeof visitId !== 'string' || !/^[a-z0-9-]{12,48}$/.test(visitId) || !kinds.has(kind) ||
        typeof placement !== 'string' || !/^[a-z0-9_-]{1,100}$/.test(placement)) {
      return reply(400, {error: 'invalid'});
    }
    const origin = slug(data.origin, 'direto');
    const campaign = slug(data.campaign, 'direto');
    if (isQa(origin, campaign)) return reply(200, {tracked: false});
    if (!(await limit('track', 600))) return reply(429, {error: 'rate'});
    await sql.query(
      'INSERT INTO ' + events + ' (visit_id,kind,placement,origin,campaign,medium,creative)' +
      ' VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (visit_id,kind,placement) DO NOTHING',
      [visitId, kind, kind === 'entry' ? 'entry' : placement, origin, campaign, slug(data.medium, ''), slug(data.creative, '')]
    );
    return reply(200, {tracked: true});
  }

  const today = time.format(new Date());
  const end = query.end || today;
  const endDate = asDate(end);
  if (!Number.isFinite(endDate)) return reply(400, {error: 'invalid'});
  const start = query.start || new Date(endDate - 29 * dayMs).toISOString().slice(0, 10);
  const startDate = asDate(start);
  const breakdown = query.breakdown || 'campaign';
  if (!Number.isFinite(startDate) || !Number.isFinite(endDate) || endDate < startDate ||
      endDate > asDate(today) || endDate - startDate > 365 * dayMs ||
      !['campaign', 'creative'].includes(breakdown)) return reply(400, {error: 'invalid'});

  const opportunities = schema + '.opportunities';
  const columns = breakdown === 'creative' ? 'origin,campaign,medium,creative' : "origin,campaign,'' AS medium,'' AS creative";
  const groups = breakdown === 'creative' ? 'origin,campaign,medium,creative' : 'origin,campaign';
  const real = "origin <> 'verificacao' AND campaign NOT LIKE 'qa-%'";
  const range = "WITH span AS (SELECT ($1::date::timestamp AT TIME ZONE 'America/Sao_Paulo') AS start_at," +
    " (($2::date + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo') AS end_at)";
  const [coverage] = await sql.query("SELECT to_char(MIN(recorded_at) AT TIME ZONE 'America/Sao_Paulo','YYYY-MM-DD') AS tracking_from FROM " + events);
  const rows = await sql.query(
    range + ", activity AS (SELECT " + columns + ',' +
    " count(*) FILTER (WHERE kind='entry') AS entries, count(*) FILTER (WHERE kind='demo') AS demos," +
    " count(*) FILTER (WHERE kind='whatsapp') AS whatsapp, count(*) FILTER (WHERE kind='email') AS email," +
    " 0 AS contacts, 0 AS proposals, 0 AS wins, 0 AS cents FROM " + events + ' CROSS JOIN span' +
    ' WHERE recorded_at >= start_at AND recorded_at < end_at AND ' + real + ' GROUP BY ' + groups +
    ' UNION ALL SELECT ' + columns + ', 0, 0, 0, 0, count(*),' +
    " count(*) FILTER (WHERE stage='proposta'), 0, 0 FROM " + opportunities + ' CROSS JOIN span' +
    ' WHERE created_at >= start_at AND created_at < end_at AND ' + real + ' GROUP BY ' + groups +
    ' UNION ALL SELECT ' + columns + ', 0, 0, 0, 0, 0, 0, count(*), sum(value_cents) FROM ' + opportunities + ' CROSS JOIN span' +
    " WHERE stage='ganho' AND won_at >= start_at AND won_at < end_at AND " + real + ' GROUP BY ' + groups +
    ') SELECT origin,campaign,medium,creative,' +
    ' sum(entries)::integer AS entries, sum(demos)::integer AS demos, sum(whatsapp)::integer AS whatsapp,' +
    ' sum(email)::integer AS email, sum(contacts)::integer AS contacts, sum(proposals)::integer AS proposals,' +
    ' sum(wins)::integer AS wins, sum(cents)::bigint AS cents FROM activity GROUP BY origin,campaign,medium,creative' +
    ' ORDER BY cents DESC,wins DESC,contacts DESC,entries DESC,origin,campaign,medium,creative LIMIT 201',
    [start, end]
  );
  return reply(200, {start, end, breakdown, trackingFrom: coverage?.tracking_from ?? null,
    truncated: rows.length > 200, rows: rows.slice(0, 200)});
}
