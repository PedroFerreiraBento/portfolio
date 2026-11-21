import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { handleFunnel } from '../lib/crm-funnel.js';
import { handleOperations } from '../lib/crm-operations.js';
import { handleTodayPerformance } from '../lib/crm-today-performance.js';
import { handleTodayExperiments } from '../lib/crm-today-experiments.js';
import { getTeamActor, handleTeamDirectory, loginTeam, logoutTeam, teamMemberId } from '../lib/crm-team.js';
import { handleClients, updateClientFollowup, validClientReference } from '../lib/crm-clients.js';
import { changePipelineStage, handlePipeline, pipelineStages } from '../lib/crm-pipeline.js';

const stages = ['novo', 'conversa', 'proposta', 'ganho', 'perdido'];
const channels = ['site', 'whatsapp', 'email', 'outro'];
const secure = process.env.VERCEL === '1';
const schema = process.env.VERCEL_ENV === 'production' ? 'crm' : 'crm_preview';
const cookieName = secure ? '__Host-caos-crm' : 'caos-crm';
const sessionSeconds = 12 * 60 * 60;
const referencePattern = /^CD-[A-Z0-9]{12}$/;
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

function cookieToken(req) {
  return (req.headers.cookie || '').split(';').map(item => item.trim())
    .find(item => item.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
}

function isSignedIn(token, secret) {
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

function dateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2000-01-01' || value > '2100-12-31') return null;
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : null;
}

function optionalSlug(value) {
  return slug(value) === 'direto' && value !== 'direto' ? '' : value;
}

function opportunity(data, isPublic, allowedStages=stages) {
  const email = boundedText(data.email, 254, isPublic ? 5 : 0);
  const name = boundedText(data.name, 120, 2);
  const company = boundedText(data.company, 120);
  const message = boundedText(data.message, 3000, isPublic ? 10 : 0);
  const nextStep = boundedText(data.next_step, 240);
  const dueOn = isPublic || !data.due_on ? null : dateOnly(data.due_on);
  const stage = isPublic ? 'novo' : data.stage;
  const channel = isPublic ? 'site' : data.channel;
  const cents = isPublic ? null : data.value_cents ?? null;
  if (!name || [email, company, message, nextStep].includes(null) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      (!isPublic && data.due_on && !dueOn) ||
      !allowedStages.includes(stage) || !channels.includes(channel) ||
      (stage === 'ganho' && cents === null) ||
      (cents !== null && (!Number.isInteger(cents) || cents <= 0 || cents > 2147483647))) return null;
  const reference = typeof data.reference === 'string' && referencePattern.test(data.reference) ?
    data.reference : 'CD-' + randomBytes(6).toString('hex').toUpperCase();
  return { reference, origin: slug(data.origin), campaign: slug(data.campaign), channel,
    name, company, email: email.toLowerCase(), message, nextStep: isPublic ? '' : nextStep, stage, cents, dueOn,
    visit: typeof data.visit_reference === 'string' && referencePattern.test(data.visit_reference) ? data.visit_reference : null,
    medium: optionalSlug(data.medium), creative: optionalSlug(data.creative) };
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
    const publicTracking = action === 'track';
    if (!['GET', 'POST', 'PATCH'].includes(req.method)) return reply(405, {error: 'method'});
    if (req.method !== 'GET') {
      const expected = (secure ? 'https://' : 'http://') + req.headers.host;
      if (req.headers.origin !== expected || req.headers['sec-fetch-site'] === 'cross-site') return reply(403, {error: 'origin'});
      if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, {error: 'content_type'});
      if (Number(req.headers['content-length']) > 12000) return reply(413, {error: 'size'});
    }
    const team = process.env.CRM_TEAM_ENABLED === '1';
    const clients = team && process.env.CRM_CLIENTS_ENABLED === '1';
    const pipeline = clients && process.env.CRM_PIPELINE_ENABLED === '1';
    const features = {...(clients && {clients:true}), ...(pipeline && {pipeline:true})};
    const secret = process.env.CRM_SESSION_SECRET?.trim();
    const keyHash = process.env.CRM_ACCESS_KEY_HASH?.trim();
    const database = process.env.CRM_DB_DATABASE_URL?.trim();
    if (!secret || (!team && !keyHash) || !database) return reply(503, {error: 'unavailable', ...(team ? {team} : {})});
    const token = cookieToken(req);
    const setCookie = (value, age) => sessionCookie(res, value, age);

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
        if (team) {
          const email = boundedText(data.email, 254)?.toLowerCase() || '';
          if (!(await limit('team-login', 120)) || !(await limit('team-login:' + email, 12))) {
            return reply(429, {error: 'rate'});
          }
          return await loginTeam({sql, schema, data, sessionSeconds, setCookie,
            reply: (status, payload) => reply(status, {...payload, ...features})});
        }
        if (!(await limit('login', 12))) return reply(429, {error: 'rate'});
        const password = boundedText(data.password, 160, 1);
        if (!password || !same(digest(password), keyHash)) return reply(401, {error: 'key'});
        const value = (Date.now() + sessionSeconds * 1000) + '.' + randomBytes(16).toString('hex');
        setCookie(value + '.' + sign(secret, value), sessionSeconds);
        return reply(200, {signedIn: true});
      }
      if (action === 'logout' && req.method === 'POST') {
        if (team) await logoutTeam(sql, schema, token);
        setCookie('', 0);
        return reply(200, {signedIn: false});
      }

      const isPublic = (publicIntake || publicTracking) && req.method === 'POST';
      const actor = team && !isPublic ? await getTeamActor(sql, schema, token) : null;
      const signedIn = team ? Boolean(actor) : isSignedIn(token, secret);
      if (action === 'session' && req.method === 'GET') {
        if (team) return signedIn ? reply(200, {signedIn, team, actor, ...features}) : reply(401, {error:'session', team});
        return signedIn ? reply(200, {signedIn}) : reply(401, {error:'session'});
      }
      if (!signedIn && !isPublic) return reply(401, {error:'session', ...(team ? {team} : {})});
      if (team && (action === 'team' || action === 'password')) {
        if (action === 'password' && req.method === 'POST' && !(await limit('password:' + actor.id, 12))) return reply(429, {error:'rate'});
        return await handleTeamDirectory({action, method:req.method, sql, schema, data, actor, reply, setCookie});
      }

      const ownOnly = actor?.role === 'member';
      if (pipeline && ['pipeline','pipeline-detail'].includes(action)) {
        return await handlePipeline({action, method:req.method, sql, schema, query:req.query, reply, actor});
      }
      if (pipeline && action === 'pipeline-stage') {
        return await changePipelineStage({method:req.method, sql, schema, data, reply, actor, dateOnly});
      }
      if (clients && ['clients', 'client'].includes(action)) {
        return await handleClients({action, method:req.method, sql, schema, query:req.query, reply, actor});
      }
      if (clients && action === 'client-followup') {
        if (req.method !== 'PATCH') return reply(405, {error:'method'});
        const { reference, revision } = data;
        const nextStep = typeof data.next_step === 'string' ? boundedText(data.next_step, 240) : null;
        const dueOn = data.due_on === null || data.due_on === '' ? null : dateOnly(data.due_on);
        if (!validClientReference(reference) || !Number.isInteger(revision) || revision < 1 || nextStep === null ||
            (!dueOn && data.due_on !== null && data.due_on !== '')) return reply(400, {error:'invalid'});
        return await updateClientFollowup({sql, schema, reply, actor, reference, revision, nextStep, dueOn});
      }
      if (ownOnly && ['funnel','experiments','experiment-assignment'].includes(action)) return reply(403, {error:'forbidden'});
      if (action === 'performance') {
        return await handleTodayPerformance({method:req.method, sql, schema, query:req.query, reply, actor});
      }
      if (action === 'experiments' || action === 'experiment-assignment') {
        return await handleTodayExperiments({action, method:req.method, sql, schema, data, query:req.query, reply});
      }
      if (['operations', 'appointment', 'activity'].includes(action)) {
        return await handleOperations({action, method:req.method, sql, schema, data, query:req.query, reply, actor, clients});
      }
      if ((action === 'funnel' && req.method === 'GET') || (publicTracking && req.method === 'POST')) {
        return await handleFunnel({action, sql, schema, data, query: req.query, reply, limit});
      }
      if (publicIntake && req.method === 'POST' && data.website) return reply(400, {error: 'invalid'});
      if (req.method === 'GET') {
        if (action !== 'list') return reply(404, {error: 'action'});
        const rows = await sql.query('SELECT o.reference,o.origin,o.campaign,o.medium,o.creative,o.channel,' +
          'o.name,o.company,o.email,o.message,o.next_step,o.stage,o.value_cents,o.won_at,o.revision,o.created_at,o.updated_at,' +
          (clients ? 'o.project_name,COALESCE(o.client_reference,o.reference) AS client_reference,' : '') +
          (team ? 'o.owner_id, o.won_by_id, owner.name AS owner_name, ' : '') + 'o.due_on::text AS due_on, CASE ' +
          "WHEN n.failed_at IS NOT NULL THEN 'failed' WHEN n.sent_at IS NOT NULL THEN 'accepted' " +
          "WHEN n.reference IS NOT NULL THEN 'pending' END AS notification_status " +
          'FROM ' + links + ' o LEFT JOIN ' + schema + '.notification_outbox n ON n.reference=o.reference ' +
          (team ? 'LEFT JOIN ' + schema + '.team_members owner ON owner.id=o.owner_id ' : '') +
          (ownOnly ? 'WHERE o.owner_id=$1 ' : '') + 'ORDER BY o.updated_at DESC, o.reference ASC',
          ownOnly ? [actor.id] : []);
        return reply(200, {rows});
      }
      if (!(publicIntake || action === 'save') || (publicIntake && req.method !== 'POST')) return reply(404, {error: 'action'});
      if (publicIntake && data.accepted !== true) return reply(400, {error: 'invalid'});
      const linked = clients && !publicIntake && req.method==='POST' && Object.hasOwn(data,'client_reference');
      const projectName = clients && !publicIntake && Object.hasOwn(data,'project_name') ?
        (typeof data.project_name === 'string' ? boundedText(data.project_name,120) : null) : undefined;
      if ((linked && !validClientReference(data.client_reference)) || projectName === null) return reply(400, {error:'invalid'});
      let input = linked ? {...data,name:'Cliente',company:'',email:''} : data;
      if (pipeline && !publicIntake) {
        if (req.method==='PATCH') {
          if (!validClientReference(data.reference) || !Number.isInteger(data.revision)) return reply(400,{error:'invalid'});
          const [before] = await sql.query('SELECT stage,value_cents,revision FROM ' + links +
            ' WHERE reference=$1 AND ($2::uuid IS NULL OR owner_id=$2)', [data.reference,ownOnly ? actor.id : null]);
          if (!before) return reply(404,{error:'missing_contact'});
          if (before.revision!==data.revision) return reply(409,{error:'stale'});
          if (data.stage!==undefined && data.stage!==before.stage) return reply(409,{error:'stage_transition'});
          if (['ganho','perdido'].includes(before.stage) &&
              (typeof data.next_step==='string' && data.next_step.trim() || data.due_on)) {
            return reply(409,{error:'closed_opportunity'});
          }
          input = {...input, stage:before.stage, value_cents:before.value_cents};
        } else {
          if (data.stage!==undefined && data.stage!=='novo') return reply(409,{error:'stage_transition'});
          input = {...input, stage:'novo', value_cents:null};
        }
      }
      const lead = opportunity(input, publicIntake, pipeline ? pipelineStages : stages);
      if (!lead) return reply(400, {error: 'invalid'});
      const explicitOwner = team && !publicIntake && !linked && Object.hasOwn(data, 'owner_id');
      const requestedOwner = explicitOwner && data.owner_id !== '' ? data.owner_id : null;
      if (explicitOwner && requestedOwner !== null &&
          (typeof requestedOwner !== 'string' || !teamMemberId.test(requestedOwner))) {
        return reply(400, {error:'invalid'});
      }
      if (ownOnly && explicitOwner && requestedOwner?.toLowerCase() !== actor.id) return reply(403, {error:'forbidden'});
      if (explicitOwner && requestedOwner && !ownOnly) {
        const [member] = await sql.query('SELECT id FROM ' + schema + '.team_members WHERE id=$1 AND active', [requestedOwner]);
        if (!member) return reply(400, {error:'invalid'});
      }
      const fields = 'reference,origin,campaign,medium,creative,channel,name,company,email,message,next_step,stage,' +
        'value_cents,won_at,revision,created_at,updated_at,due_on::text AS due_on' +
        (clients ? ',project_name,COALESCE(o.client_reference,o.reference) AS client_reference' : '');
      const ownershipFields = team ? ',owner_id,won_by_id,(SELECT m.name FROM ' + schema + '.team_members m WHERE m.id=o.owner_id) AS owner_name' : '';
      const params = [lead.reference, lead.origin, lead.campaign, lead.channel, lead.name, lead.company,
        lead.email, lead.message, lead.nextStep, lead.stage, lead.cents, lead.dueOn, lead.medium, lead.creative];
      if (req.method === 'PATCH') {
        if (!Number.isInteger(data.revision) || data.reference !== lead.reference) return reply(400, {error: 'invalid'});
        const rootOnly = clients ? ' AND o.client_reference IS NULL' : '';
        const owner = 'CASE WHEN $20::boolean' + rootOnly + ' THEN $19::uuid ELSE o.owner_id END';
        const identityFields = clients ?
          'name=CASE WHEN o.client_reference IS NULL THEN $5 ELSE o.name END, ' +
          'company=CASE WHEN o.client_reference IS NULL THEN $6 ELSE o.company END, ' +
          'email=CASE WHEN o.client_reference IS NULL THEN $7 ELSE o.email END, ' : 'name=$5, company=$6, email=$7, ';
        const projectField = clients ? ', project_name=COALESCE($' + (team ? 22 : 19) + ',o.project_name)' : '';
        const teamFields = team ? ', owner_id=' + owner +
          ", won_by_id=CASE WHEN $10 <> 'ganho' THEN NULL WHEN o.stage='ganho' THEN o.won_by_id" +
          ' ELSE COALESCE(' + owner + ',$21::uuid) END' : '';
        const [updated] = await sql.query('UPDATE ' + links + ' AS o SET origin=$2, campaign=$3, channel=$4, ' +
          identityFields + 'message=$8, next_step=$9, stage=$10, value_cents=$11, ' +
          "won_at=CASE WHEN $10='ganho' THEN COALESCE(won_at,now()) END, revision=revision+1, updated_at=now()" +
          ', due_on=CASE WHEN $16 THEN $12::date ELSE due_on END, ' +
          'medium=CASE WHEN $17 THEN $13 ELSE medium END, creative=CASE WHEN $18 THEN $14 ELSE creative END' + teamFields + projectField +
          ' WHERE reference=$1 AND revision=$15' + (ownOnly ? ' AND o.owner_id=$21::uuid' : '') +
          ' RETURNING ' + fields + ownershipFields + ',' +
          "(SELECT CASE WHEN failed_at IS NOT NULL THEN 'failed' WHEN sent_at IS NOT NULL THEN 'accepted' ELSE 'pending' END " +
          'FROM ' + schema + '.notification_outbox WHERE reference=$1) AS notification_status', [
            ...params, data.revision, Object.hasOwn(data,'due_on'), Object.hasOwn(data,'medium'), Object.hasOwn(data,'creative'),
            ...(team ? [requestedOwner, explicitOwner && !ownOnly, actor.id] : []),
            ...(clients ? [projectName ?? null] : [])
          ]);
        if (updated) return reply(200, {row:updated});
        if (ownOnly) {
          const [visible] = await sql.query('SELECT 1 FROM ' + links + ' WHERE reference=$1 AND owner_id=$2', [lead.reference, actor.id]);
          if (!visible) return reply(404, {error:'missing_contact'});
        }
        return reply(409, {error:'stale'});
      }
      if (linked) {
        const [result] = await sql.query('WITH parent AS (' +
          'SELECT reference,name,company,email,owner_id FROM ' + links +
          ' WHERE reference=$1 AND client_reference IS NULL AND ($2::uuid IS NULL OR owner_id=$2) FOR UPDATE' +
          '), created AS (INSERT INTO ' + links + ' AS o (reference,origin,campaign,channel,name,company,email,' +
          'message,next_step,stage,value_cents,won_at,due_on,medium,creative,owner_id,won_by_id,project_name,client_reference)' +
          ' SELECT $3,$4,$5,$6,parent.name,parent.company,parent.email,$7,$8,$9,$10,' +
          "CASE WHEN $9='ganho' THEN now() END,$11,$12,$13,parent.owner_id," +
          "CASE WHEN $9='ganho' THEN COALESCE(parent.owner_id,$14::uuid) END,$15,parent.reference FROM parent" +
          ' ON CONFLICT (reference) DO NOTHING RETURNING ' + fields + ownershipFields +
          ') SELECT (SELECT to_jsonb(created) FROM created) AS row, EXISTS (SELECT 1 FROM parent) AS parent_visible',
          [data.client_reference,ownOnly ? actor.id : null,lead.reference,lead.origin,lead.campaign,lead.channel,
            lead.message,lead.nextStep,lead.stage,lead.cents,lead.dueOn,lead.medium,lead.creative,actor?.id ?? null,projectName ?? '']);
        if (result.row) return reply(201, {row:result.row});
        return result.parent_visible ? reply(409, {error:'duplicate'}) : reply(404, {error:'missing_contact'});
      }
      if (publicIntake && !(await limit('intake', 12))) return reply(429, {error: 'rate'});
      const fingerprint = publicIntake ? digest(JSON.stringify([lead.email, lead.message, lead.name, lead.company])) : null;
      const ownerId = explicitOwner ? requestedOwner : actor?.id ?? null;
      const wonBy = lead.stage === 'ganho' ? ownerId ?? actor?.id ?? null : null;
      const [created] = await sql.query('INSERT INTO ' + links + ' AS o (reference,origin,campaign,channel,name,company,' +
        'email,message,next_step,stage,value_cents,won_at,due_on,medium,creative,visit_reference,intake_hash' +
        (team ? ',owner_id,won_by_id' : '') + (clients ? ',project_name' : '') + ')' +
        " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CASE WHEN $10='ganho' THEN now() END,$12,$13,$14,$15,$16" +
        (team ? ',$17,$18' : '') + (clients ? (team ? ',$19' : ',$17') : '') +
        ') ON CONFLICT (reference) DO NOTHING RETURNING ' + fields + ownershipFields,
        [...params, lead.visit, fingerprint, ...(team ? [ownerId, wonBy] : []), ...(clients ? [projectName ?? ''] : [])]);
      if (created) return reply(201, publicIntake ? {reference: lead.reference} : {row: created});
      if (publicIntake) {
        const [prior] = await sql.query('SELECT 1 AS accepted FROM ' + links + ' WHERE reference=$1 AND (' +
          'intake_hash=$2 OR (intake_hash IS NULL AND email=$3 AND message=$4 AND name=$5 AND company=$6))',
          [lead.reference, fingerprint, lead.email, lead.message, lead.name, lead.company]);
        if (prior) return reply(200, {reference: lead.reference});
      }
      return reply(409, {error: 'duplicate'});
    } catch (error) {
      console.error('CRM operation failed', error.code || error.name);
      return reply(503, {error: 'unavailable', ...(team ? {team} : {})});
    }
  };
}

export default makeHandler();
