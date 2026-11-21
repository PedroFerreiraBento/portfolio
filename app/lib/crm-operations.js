import { createHash } from 'node:crypto';

const maxDays = 42;
const dayMs = 86_400_000;
const referencePattern = /^CD-[A-Z0-9]{12}$/;
const idPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const appointmentKinds = ['meeting', 'call', 'review'];
const terminalStates = ['completed', 'cancelled', 'no_show'];
const outcomes = {
  call: ['connected', 'no_answer'],
  whatsapp: ['sent', 'connected'],
  email: ['sent', 'connected'],
  meeting: ['completed', 'no_show'],
  note: ['recorded']
};
const appointmentFields = 'a.id,a.reference,a.title,a.kind,a.starts_at,a.duration_minutes,a.notes,a.status,a.revision';
const activityFields = 'a.id,a.reference,a.appointment_id,a.kind,a.outcome,a.occurred_at,a.notes';
const contactFields = 'o.name,o.company';

function civilDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2000-01-01' || value > '2100-12-31') return NaN;
  const stamp = Date.parse(value);
  return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0, 10) === value ? stamp : NaN;
}

function instant(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value) ||
      !Number.isFinite(civilDate(value.slice(0, 10)))) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function text(value, max, min = 0) {
  if (typeof value !== 'string') return null;
  const content = value.trim();
  return content.length >= min && content.length <= max && !content.includes('\0') ? content : null;
}

function hasReference(value) {
  return typeof value === 'string' && referencePattern.test(value);
}

function hash(fields) {
  return createHash('sha256').update(JSON.stringify(fields)).digest('hex');
}

function appointmentValues(data) {
  const title = text(data.title, 120, 1);
  const start = instant(data.starts_at);
  const duration = data.duration_minutes;
  const notes = text(data.notes ?? '', 2000);
  if (!hasReference(data.reference) || !title || !start || !appointmentKinds.includes(data.kind) ||
      !Number.isInteger(duration) || duration < 5 || duration > 480 || notes === null) return null;
  return [data.reference, title, data.kind, start, duration, notes];
}

async function getOperations({sql, query, reply, links, appointments, activities}) {
  const {start, end} = query;
  const first = civilDate(start);
  const last = civilDate(end);
  if (!Number.isFinite(first) || !Number.isFinite(last) || last < first || last - first >= maxDays * dayMs ||
      (query.reference !== undefined && !hasReference(query.reference))) return reply(400, {error: 'invalid'});

  const window = "WITH span AS (SELECT ($1::date::timestamp AT TIME ZONE 'America/Sao_Paulo') AS start_at," +
    " (($2::date + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo') AS end_at)";
  const [calendar, recent, contacts] = await Promise.all([
    sql.query(window + ' SELECT ' + appointmentFields + ',' + contactFields +
      ' FROM ' + appointments + ' a JOIN ' + links + ' o ON o.reference=a.reference CROSS JOIN span' +
      " WHERE a.starts_at >= start_at-interval '8 hours' AND a.starts_at<end_at" +
      ' AND a.starts_at+make_interval(mins=>a.duration_minutes)>start_at ORDER BY a.starts_at,a.id', [start, end]),
    sql.query('SELECT ' + activityFields + ',' + contactFields + ' FROM ' + activities + ' a JOIN ' + links +
      ' o ON o.reference=a.reference WHERE ($1::text IS NULL OR a.reference=$1)' +
      ' ORDER BY a.occurred_at DESC,a.id LIMIT 75', [query.reference ?? null]),
    sql.query('SELECT o.reference,o.name,o.company,o.stage,o.due_on::text AS due_on,o.next_step,o.created_at,' +
      '(SELECT a.occurred_at FROM ' + activities + ' a WHERE a.reference=o.reference' +
      " AND a.outcome IN ('connected','sent','completed') ORDER BY a.occurred_at DESC LIMIT 1) AS last_contact_at" +
      ' FROM ' + links + ' o ORDER BY lower(COALESCE(NULLIF(o.company,\'\'),o.name)),o.reference')
  ]);
  return reply(200, {start, end, appointments:calendar, activities:recent, contacts});
}

async function readAppointment(sql, appointments, links, id) {
  const [row] = await sql.query('SELECT ' + appointmentFields + ',' + contactFields + ',a.request_hash,a.last_patch_hash' +
    ' FROM ' + appointments + ' a JOIN ' + links + ' o ON o.reference=a.reference WHERE a.id=$1', [id]);
  return row;
}

function appointmentResult(reply, status, row) {
  const {request_hash, last_patch_hash, ...appointment} = row;
  return reply(status, {appointment});
}

async function createAppointment({sql, data, reply, links, appointments, id}) {
  const fields = appointmentValues(data);
  if (!fields) return reply(400, {error: 'invalid'});
  const fingerprint = hash(fields);
  const [created] = await sql.query('WITH inserted AS (INSERT INTO ' + appointments +
    ' (id,reference,title,kind,starts_at,duration_minutes,notes,request_hash)' +
    ' SELECT $1::uuid,o.reference,$3,$4,$5::timestamptz,$6,$7,$8 FROM ' + links + ' o WHERE o.reference=$2' +
    ' ON CONFLICT (id) DO NOTHING RETURNING *) SELECT ' + appointmentFields + ',' + contactFields +
    ' FROM inserted a JOIN ' + links + ' o ON o.reference=a.reference', [id, ...fields, fingerprint]);
  if (created) return reply(201, {appointment: created});
  const existing = await readAppointment(sql, appointments, links, id);
  if (!existing) return reply(404, {error: 'missing_contact'});
  return existing.request_hash === fingerprint ? appointmentResult(reply, 200, existing) : reply(409, {error: 'conflict'});
}

async function updateAppointment({sql, data, reply, links, appointments, activities, id}) {
  const revision = data.revision;
  if (!Number.isInteger(revision) || revision < 1 || revision >= 2147483647) return reply(400, {error:'invalid'});
  const isResult = Object.hasOwn(data, 'status');
  const fields = isResult
    ? [data.status, Object.hasOwn(data,'notes') ? text(data.notes, 2000) : null]
    : appointmentValues(data);
  if (!fields || (isResult && (!terminalStates.includes(fields[0]) || (Object.hasOwn(data,'notes') && fields[1] === null)))) {
    return reply(400, {error:'invalid'});
  }
  const fingerprint = hash([revision, isResult, ...fields]);
  const update = isResult
    ? " SET status=$4,notes=COALESCE($5,notes),revision=revision+1,updated_at=now(),last_patch_hash=$3" +
      " WHERE id=$1 AND revision=$2 AND status='scheduled' RETURNING *)," +
      " logged AS (INSERT INTO " + activities + " (id,reference,appointment_id,kind,outcome,occurred_at,notes)" +
      " SELECT gen_random_uuid(),reference,id,CASE WHEN kind='call' THEN 'call' ELSE 'meeting' END," +
      " CASE WHEN kind='call' AND status='completed' THEN 'connected' WHEN kind='call' THEN 'no_answer' ELSE status END," +
      " now(),COALESCE($5,'') FROM changed WHERE status IN ('completed','no_show'))"
    : " SET reference=$4,title=$5,kind=$6,starts_at=$7::timestamptz,duration_minutes=$8,notes=$9," +
      " revision=revision+1,updated_at=now(),last_patch_hash=$3" +
      " WHERE id=$1 AND revision=$2 AND status='scheduled' AND EXISTS (SELECT 1 FROM " + links +
      " WHERE reference=$4) RETURNING *)";
  const [updated] = await sql.query('WITH changed AS (UPDATE ' + appointments + update + ' SELECT ' +
    appointmentFields + ',' + contactFields + ' FROM changed a JOIN ' + links + ' o ON o.reference=a.reference',
    [id, revision, fingerprint, ...fields]);
  if (updated) return reply(200, {appointment: updated});
  const existing = await readAppointment(sql, appointments, links, id);
  if (!existing) return reply(404, {error: 'missing_appointment'});
  if (existing.last_patch_hash === fingerprint) return appointmentResult(reply, 200, existing);
  if (existing.revision !== revision) return reply(409, {error: 'stale'});
  if (existing.status !== 'scheduled') return reply(409, {error: 'state'});
  return reply(404, {error: 'missing_contact'});
}

async function createActivity({sql, data, reply, links, activities, id}) {
  const recordedAt = instant(data.occurred_at);
  const notes = text(data.notes ?? '', 2000);
  const setNext = Object.hasOwn(data, 'next_step');
  const setDue = Object.hasOwn(data, 'due_on');
  const next = setNext ? text(data.next_step, 240) : null;
  const due = data.due_on || null;
  if (!hasReference(data.reference) || !Object.hasOwn(outcomes, data.kind) || !outcomes[data.kind].includes(data.outcome) ||
      !recordedAt || Date.parse(recordedAt) > Date.now() + 300_000 || notes === null ||
      (setNext && next === null) || (setDue && data.due_on !== '' && data.due_on !== null && !Number.isFinite(civilDate(data.due_on)))) {
    return reply(400, {error: 'invalid'});
  }
  const fields = [data.reference, data.kind, data.outcome, recordedAt, notes, setNext, next, setDue, due];
  const fingerprint = hash(fields);
  const [created] = await sql.query('WITH inserted AS (INSERT INTO ' + activities +
    ' (id,reference,kind,outcome,occurred_at,notes,request_hash)' +
    ' SELECT $1::uuid,o.reference,$3,$4,$5::timestamptz,$6,$11 FROM ' + links + ' o WHERE o.reference=$2' +
    ' ON CONFLICT (id) DO NOTHING RETURNING *),' +
    ' followup AS (UPDATE ' + links + ' o SET next_step=CASE WHEN $7::boolean THEN $8 ELSE o.next_step END,' +
    ' due_on=CASE WHEN $9::boolean THEN $10::date ELSE o.due_on END,revision=o.revision+1,updated_at=now()' +
    ' FROM inserted i WHERE o.reference=i.reference AND ($7::boolean OR $9::boolean))' +
    ' SELECT ' + activityFields + ',' + contactFields + ' FROM inserted a JOIN ' + links + ' o ON o.reference=a.reference',
    [id, ...fields, fingerprint]);
  if (created) return reply(201, {activity: created});
  const [existing] = await sql.query('SELECT ' + activityFields + ',' + contactFields + ',a.request_hash FROM ' +
    activities + ' a JOIN ' + links + ' o ON o.reference=a.reference WHERE a.id=$1', [id]);
  if (!existing) return reply(404, {error:'missing_contact'});
  const {request_hash, ...activity} = existing;
  return request_hash === fingerprint ? reply(200, {activity}) : reply(409, {error:'conflict'});
}

export async function handleOperations(context) {
  const {action, method, data, schema, reply} = context;
  const tables = {links:schema + '.opportunities', appointments:schema + '.appointments', activities:schema + '.activities'};
  if (action === 'operations') {
    return method === 'GET' ? getOperations({...context, ...tables}) : reply(405, {error:'method'});
  }
  if (method !== 'POST' && !(action === 'appointment' && method === 'PATCH')) return reply(405, {error:'method'});
  if (typeof data.id !== 'string' || !idPattern.test(data.id)) return reply(400, {error:'invalid'});
  const params = {...context, ...tables, id:data.id.toLowerCase()};
  if (action === 'activity') return createActivity(params);
  return method === 'POST' ? createAppointment(params) : updateAppointment(params);
}
