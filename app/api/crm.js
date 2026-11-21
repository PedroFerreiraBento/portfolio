import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const stages = ['novo', 'conversa', 'proposta', 'ganho', 'perdido'];
const channels = ['site', 'whatsapp', 'email', 'outro'];
const secure = process.env.VERCEL === '1';
const schema = process.env.VERCEL_ENV === 'production' ? 'crm' : 'crm_preview';
const cookieName = secure ? '__Host-caos-crm' : 'caos-crm';
const sessionSeconds = 12 * 60 * 60;
const digest = value => createHash('sha256').update(value).digest('hex');
const same = (left, right) => typeof right === 'string' &&
  Buffer.byteLength(left) === Buffer.byteLength(right) &&
  timingSafeEqual(Buffer.from(left), Buffer.from(right));

function sessionCookie(res, value, age) {
  res.setHeader('Set-Cookie', [
    cookieName + '=' + value, 'Path=/', 'HttpOnly', 'SameSite=Strict',
    'Max-Age=' + age, ...(secure ? ['Secure'] : [])
  ].join('; '));
}

function sign(secret, value) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function isSignedIn(req, secret) {
  const token = (req.headers.cookie || '').split('; ').find(item => item.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  const [expiry, nonce, signature] = (token || '').split('.');
  return Number(expiry) > Date.now() && !!nonce && same(sign(secret, expiry + '.' + nonce), signature);
}

function boundedText(value, max, min = 0) {
  if (typeof value !== 'string') return min ? null : '';
  const text = value.trim();
  return text.length >= min && text.length <= max && !text.includes('\0') ? text : null;
}

function slug(value) {
  return typeof value === 'string' && /^[a-z0-9_-]{1,48}$/.test(value) ? value : 'direto';
}

function opportunity(data, isPublic) {
  const email = boundedText(data.email, 254, isPublic ? 5 : 0);
  const name = boundedText(data.name, 120, 2);
  const company = boundedText(data.company, 120);
  const message = boundedText(data.message, 3000, isPublic ? 10 : 0);
  const nextStep = boundedText(data.next_step, 240);
  const stage = isPublic ? 'novo' : data.stage;
  const channel = isPublic ? 'site' : data.channel;
  const cents = isPublic ? null : data.value_cents ?? null;
  if (!name || [email, company, message, nextStep].includes(null) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      !stages.includes(stage) || !channels.includes(channel) ||
      (stage === 'ganho' && cents === null) ||
      (cents !== null && (!Number.isInteger(cents) || cents <= 0 || cents > 2147483647))) return null;
  const reference = typeof data.reference === 'string' && /^CD-[A-Z0-9]{12}$/.test(data.reference) ?
    data.reference : 'CD-' + randomBytes(6).toString('hex').toUpperCase();
  return { reference, origin: slug(data.origin), campaign: slug(data.campaign), channel,
    name, company, email: email.toLowerCase(), message, nextStep: isPublic ? '' : nextStep, stage, cents };
}

export function makeHandler(connect = neon) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const reply = (status, payload) => res.status(status).json(payload);
    const action = req.query.action;
    const publicIntake = action === 'intake';
    const login = action === 'login';
    if (!['GET', 'POST', 'PATCH'].includes(req.method)) return reply(405, {error: 'method'});
    if (req.method !== 'GET') {
      const expected = (secure ? 'https://' : 'http://') + req.headers.host;
      if (req.headers.origin !== expected || req.headers['sec-fetch-site'] === 'cross-site') return reply(403, {error: 'origin'});
      if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, {error: 'content_type'});
      if (Number(req.headers['content-length']) > 12000) return reply(413, {error: 'size'});
    }
    const secret = process.env.CRM_SESSION_SECRET?.trim();
    const keyHash = process.env.CRM_ACCESS_KEY_HASH?.trim();
    const database = process.env.CRM_DB_DATABASE_URL?.trim();
    if (!secret || !keyHash || !database) return reply(503, {error: 'unavailable'});
    const signedIn = isSignedIn(req, secret);
    if (action === 'session' && req.method === 'GET') return signedIn ? reply(200, {signedIn}) : reply(401, {error: 'session'});
    if (!signedIn && !((publicIntake || login) && req.method === 'POST')) return reply(401, {error: 'session'});

    const data = req.body ?? {};
    if (typeof data !== 'object' || Array.isArray(data)) return reply(400, {error: 'invalid'});
    const sql = connect(database);
    const links = schema + '.opportunities';
    const rateLimits = schema + '.rate_limits';

    async function limit(tag, max) {
      const ip = (req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim();
      const windowHours = Math.floor(Date.now() / 3600000);
      const key = sign(secret, tag + ':' + ip + ':' + windowHours);
      const [entry] = await sql.query(
        'WITH expired AS (DELETE FROM ' + rateLimits + ' WHERE expires_at < now()) ' +
        'INSERT INTO ' + rateLimits + ' AS r (bucket,hits,expires_at) VALUES ($1,1,to_timestamp($2)) ' +
        'ON CONFLICT (bucket) DO UPDATE SET hits = r.hits + 1 WHERE r.hits < $3 RETURNING hits',
        [key, (windowHours + 1) * 3600, max]
      );
      if (!entry) res.setHeader('Retry-After', String(3600 - Math.floor(Date.now() / 1000) % 3600));
      return Boolean(entry);
    }

    try {
      if (login && req.method === 'POST') {
        if (!(await limit('login', 12))) return reply(429, {error: 'rate'});
        const password = boundedText(data.password, 160, 1);
        if (!password || !same(digest(password), keyHash)) return reply(401, {error: 'key'});
        const token = (Date.now() + sessionSeconds * 1000) + '.' + randomBytes(16).toString('hex');
        sessionCookie(res, token + '.' + sign(secret, token), sessionSeconds);
        return reply(200, {signedIn: true});
      }
      if (action === 'logout' && req.method === 'POST') {
        sessionCookie(res, '', 0);
        return reply(200, {signedIn: false});
      }
      if (publicIntake && req.method === 'POST' && data.website) return reply(400, {error: 'invalid'});
      if (req.method === 'GET') {
        if (action !== 'list') return reply(404, {error: 'action'});
        const rows = await sql.query('SELECT * FROM ' + links + ' ORDER BY updated_at DESC, reference ASC');
        return reply(200, {rows});
      }
      if (!(publicIntake || action === 'save') || (publicIntake && req.method !== 'POST')) return reply(404, {error: 'action'});
      if (publicIntake && data.accepted !== true) return reply(400, {error: 'invalid'});
      const lead = opportunity(data, publicIntake);
      if (!lead) return reply(400, {error: 'invalid'});
      const params = [lead.reference, lead.origin, lead.campaign, lead.channel, lead.name, lead.company,
        lead.email, lead.message, lead.nextStep, lead.stage, lead.cents];
      if (req.method === 'PATCH') {
        if (!Number.isInteger(data.revision) || data.reference !== lead.reference) return reply(400, {error: 'invalid'});
        const [updated] = await sql.query('UPDATE ' + links + ' SET origin=$2, campaign=$3, channel=$4, ' +
          'name=$5, company=$6, email=$7, message=$8, next_step=$9, stage=$10, value_cents=$11, ' +
          "won_at=CASE WHEN $10='ganho' THEN COALESCE(won_at,now()) END, revision=revision+1, updated_at=now()" +
          ' WHERE reference=$1 AND revision=$12 RETURNING *', [...params, data.revision]);
        return updated ? reply(200, {row: updated}) : reply(409, {error: 'stale'});
      }
      if (publicIntake && !(await limit('intake', 12))) return reply(429, {error: 'rate'});
      const [created] = await sql.query('INSERT INTO ' + links + ' (reference,origin,campaign,channel,name,company,email,message,next_step,stage,value_cents,won_at)' +
        " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CASE WHEN $10='ganho' THEN now() END)" +
        ' ON CONFLICT (reference) DO NOTHING RETURNING *', params);
      if (created) return reply(201, publicIntake ? {reference: lead.reference} : {row: created});
      if (publicIntake) {
        const [prior] = await sql.query('SELECT 1 AS accepted FROM ' + links + ' WHERE reference=$1 AND email=$2 AND message=$3 AND name=$4 AND company=$5',
          [lead.reference, lead.email, lead.message, lead.name, lead.company]);
        if (prior) return reply(200, {reference: lead.reference});
      }
      return reply(409, {error: 'duplicate'});
    } catch (error) {
      console.error('CRM operation failed', error.code || error.name);
      return reply(503, {error: 'unavailable'});
    }
  };
}

export default makeHandler();
