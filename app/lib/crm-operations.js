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

function memberScope(actor) {
  return actor?.role === 'member' ? actor.id : null;
}

function personFields(column, name, team) {
  return team ? ',a.' + column + ',person.name AS ' + name : '';
}

function personJoin(column, team) {
  return team ? ' LEFT JOIN ' + team + ' person ON person.id=a.' + column : '';
}

function parseAssignee(data, actor) {
  if (!actor || !Object.hasOwn(data,'assignee_id')) return undefined;
  const value = data.assignee_id;
  if (value === null) return value;
  return typeof value === 'string' && idPattern.test(value) ? value.toLowerCase() : false;
}

async function getOperations({sql, query, reply, links, appointments, activities, team, actor, clients}) {
  const {start, end} = query;
  const first = civilDate(start);
  const last = civilDate(end);
  if (!Number.isFinite(first) || !Number.isFinite(last) || last < first || last - first >= maxDays * dayMs ||
      (query.reference !== undefined && !hasReference(query.reference))) return reply(400, {error: 'invalid'});

  const scope = memberScope(actor);
  const history = query.history === '1';
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const kind = query.kind || null;
  const author = query.author || null;
  if (history && (search.length > 120 || (kind !== null && !['call','whatsapp','email','meeting','note'].includes(kind)) ||
      (author !== null && (!team || scope || typeof author !== 'string' || !idPattern.test(author))))) {
    return reply(400, {error: 'invalid'});
  }
  const window = "WITH span AS (SELECT ($1::date::timestamp AT TIME ZONE 'America/Sao_Paulo') AS start_at," +
    " (($2::date + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo') AS end_at)";
  const projectFields = clients ? ',o.project_name,COALESCE(o.client_reference,o.reference) AS client_reference' : '';
  const activitySelect = ' SELECT ' + activityFields + ',' + contactFields + projectFields + personFields('actor_id','actor_name',team) +
    ' FROM ' + activities + ' a JOIN ' + links + ' o ON o.reference=a.reference' + personJoin('actor_id',team);
  const activityOrder = ' ORDER BY a.occurred_at DESC,a.id';
  const historyWhere = ' CROSS JOIN span WHERE a.occurred_at>=start_at AND a.occurred_at<end_at' +
    ' AND ($3::text IS NULL OR a.reference=$3) AND ($4::text IS NULL OR a.kind=$4)' +
    " AND strpos(translate(lower(concat_ws(' ',o.name,o.company,o.reference" +
    (clients ? ',o.project_name,o.client_reference' : '') +
    ")),'áàâãäéèêëíìîïóòôõöúùûüçñ','aaaaaeeeeiiiiooooouuuucn'),$5)>0" +
    (team ? ' AND ($6::uuid IS NULL OR a.actor_id=$6) AND ($7::uuid IS NULL OR a.actor_id=$7)' : '');
  const historyParams = [start,end,query.reference ?? null,kind,search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()];
  const [calendar, recent, contacts, members] = await Promise.all([
    sql.query(window + ' SELECT ' + appointmentFields + ',' + contactFields + projectFields + personFields('assignee_id','assignee_name',team) +
      ' FROM ' + appointments + ' a JOIN ' + links + ' o ON o.reference=a.reference' + personJoin('assignee_id',team) + ' CROSS JOIN span' +
      " WHERE a.starts_at >= start_at-interval '8 hours' AND a.starts_at<end_at" +
      ' AND a.starts_at+make_interval(mins=>a.duration_minutes)>start_at' +
      (team ? ' AND ($3::uuid IS NULL OR a.assignee_id=$3)' : '') + ' ORDER BY a.starts_at,a.id',
      team ? [start,end,scope] : [start,end]),
    history
      ? sql.query(window + activitySelect + historyWhere + activityOrder + ' LIMIT 76', team ? [...historyParams,scope,author] : historyParams)
      : sql.query(activitySelect + ' WHERE ($1::text IS NULL OR a.reference=$1)' +
        (team ? ' AND ($2::uuid IS NULL OR a.actor_id=$2)' : '') + activityOrder + ' LIMIT 75',
        team ? [query.reference ?? null,scope] : [query.reference ?? null]),
    sql.query('SELECT o.reference,o.name,o.company,o.stage,o.due_on::text AS due_on,o.next_step,o.created_at' +
      projectFields + (clients ? ',COALESCE(client.created_at,o.created_at) AS client_created_at' : '') + ',' +
      '(SELECT a.occurred_at FROM ' + activities + ' a' +
      (clients ? ' JOIN ' + links + ' project ON project.reference=a.reference' +
        ' WHERE (project.reference=COALESCE(o.client_reference,o.reference)' +
        ' OR project.client_reference=COALESCE(o.client_reference,o.reference))' +
        (team ? ' AND ($1::uuid IS NULL OR project.owner_id=$1)' : '') : ' WHERE a.reference=o.reference') +
      (clients ? " AND a.outcome IN ('connected','completed')" : " AND a.outcome IN ('connected','sent','completed')") +
      ' ORDER BY a.occurred_at DESC LIMIT 1) AS last_contact_at' +
      (team ? ',o.owner_id,person.name AS owner_name' : '') + ' FROM ' + links + ' o' +
      (clients ? ' LEFT JOIN ' + links + ' client ON client.reference=o.client_reference' : '') +
      (team ? ' LEFT JOIN ' + team + ' person ON person.id=o.owner_id WHERE ($1::uuid IS NULL OR o.owner_id=$1)' : '') +
      ' ORDER BY lower(COALESCE(NULLIF(o.company,\'\'),o.name)),o.reference', team ? [scope] : []),
    team ? sql.query('SELECT id,name,active FROM ' + team + ' WHERE ($1::uuid IS NULL OR id=$1) ORDER BY lower(name),id',[scope]) : []
  ]);
  return reply(200, {start, end, appointments:calendar, activities:recent.slice(0,75), contacts,
    ...(history ? {history_limited:recent.length>75} : {}), ...(team ? {members} : {})});
}

async function readAppointment({sql, appointments, links, id, team, actor}) {
  const [row] = await sql.query('SELECT ' + appointmentFields + ',' + contactFields + ',a.request_hash,a.last_patch_hash' +
    personFields('assignee_id','assignee_name',team) + ' FROM ' + appointments + ' a JOIN ' + links +
    ' o ON o.reference=a.reference' + personJoin('assignee_id',team) + ' WHERE a.id=$1' +
    (team ? ' AND ($2::uuid IS NULL OR a.assignee_id=$2)' : ''), team ? [id,memberScope(actor)] : [id]);
  return row;
}

function appointmentResult(reply, status, row) {
  const {request_hash, last_patch_hash, ...appointment} = row;
  return reply(status, {appointment});
}

async function createAppointment(context) {
  const {sql, data, reply, links, appointments, id, team, actor} = context;
  const fields = appointmentValues(data);
  if (!fields) return reply(400, {error: 'invalid'});
  const scope = memberScope(actor);
  const requested = parseAssignee(data,actor);
  const assignee = requested === undefined ? actor?.id : requested;
  if (assignee === false || (scope && assignee !== scope)) return reply(400, {error: 'invalid'});
  const fingerprint = hash(team ? [...fields,assignee,actor.id] : fields);
  const [created] = await sql.query('WITH inserted AS (INSERT INTO ' + appointments +
    ' (id,reference,title,kind,starts_at,duration_minutes,notes,request_hash' + (team ? ',assignee_id' : '') + ')' +
    ' SELECT $1::uuid,o.reference,$3,$4,$5::timestamptz,$6,$7,$8' + (team ? ',$9::uuid' : '') +
    ' FROM ' + links + ' o WHERE o.reference=$2' +
    (team ? ' AND ($10::uuid IS NULL OR o.owner_id=$10) AND ($9::uuid IS NULL OR EXISTS (SELECT 1 FROM ' + team +
      ' WHERE id=$9 AND active)) FOR NO KEY UPDATE OF o' : '') +
    ' ON CONFLICT (id) DO NOTHING RETURNING *) SELECT ' + appointmentFields + ',' + contactFields +
    personFields('assignee_id','assignee_name',team) + ' FROM inserted a JOIN ' + links + ' o ON o.reference=a.reference' +
    personJoin('assignee_id',team), team ? [id,...fields,fingerprint,assignee,scope] : [id,...fields,fingerprint]);
  if (created) return reply(201, {appointment: created});
  const existing = await readAppointment(context);
  if (!existing) return reply(404, {error: 'missing_contact'});
  return existing.request_hash === fingerprint ? appointmentResult(reply, 200, existing) : reply(409, {error: 'conflict'});
}

async function updateAppointment(context) {
  const {sql, data, reply, links, appointments, activities, id, team, actor} = context;
  const revision = data.revision;
  if (!Number.isInteger(revision) || revision < 1 || revision >= 2147483647) return reply(400, {error:'invalid'});
  const isResult = Object.hasOwn(data, 'status');
  const fields = isResult
    ? [data.status, Object.hasOwn(data,'notes') ? text(data.notes, 2000) : null]
    : appointmentValues(data);
  if (!fields || (isResult && (!terminalStates.includes(fields[0]) || (Object.hasOwn(data,'notes') && fields[1] === null)))) {
    return reply(400, {error:'invalid'});
  }
  const scope = memberScope(actor);
  const assignee = parseAssignee(data,actor);
  if (assignee === false || (isResult && assignee !== undefined) ||
      (scope && assignee !== undefined && assignee !== scope)) return reply(400, {error:'invalid'});
  const fingerprintFields = [revision,isResult,...fields];
  const fingerprint = hash(team ? [...fingerprintFields,assignee === undefined ? 'unchanged' : assignee,actor.id] : fingerprintFields);
  const update = isResult
    ? " SET status=$4,notes=COALESCE($5,notes),revision=revision+1,updated_at=now(),last_patch_hash=$3" +
      " WHERE id=$1 AND revision=$2 AND status='scheduled'" + (team ? ' AND ($6::uuid IS NULL OR a.assignee_id=$6)' : '') +
      " RETURNING *), logged AS (INSERT INTO " + activities + " (id,reference,appointment_id,kind,outcome,occurred_at,notes" +
      (team ? ',actor_id' : '') + ") SELECT gen_random_uuid(),reference,id,CASE WHEN kind='call' THEN 'call' ELSE 'meeting' END," +
      " CASE WHEN kind='call' AND status='completed' THEN 'connected' WHEN kind='call' THEN 'no_answer' ELSE status END," +
      " now(),COALESCE($5,'')" + (team ? ',$7::uuid' : '') + " FROM changed WHERE status IN ('completed','no_show'))"
    : " SET reference=$4,title=$5,kind=$6,starts_at=$7::timestamptz,duration_minutes=$8,notes=$9," +
      " revision=revision+1,updated_at=now(),last_patch_hash=$3" +
      (team ? ',assignee_id=CASE WHEN $12::boolean THEN $11::uuid ELSE a.assignee_id END' : '') +
      " WHERE id=$1 AND revision=$2 AND status='scheduled'" +
      (team ? ' AND ($10::uuid IS NULL OR a.assignee_id=$10) AND (NOT $12::boolean OR $11::uuid IS NULL OR EXISTS (SELECT 1 FROM ' +
        team + ' WHERE id=$11 AND active))' : '') + ' AND EXISTS (SELECT 1 FROM ' + links + ' o WHERE o.reference=$4' +
      (team ? ' AND ($10::uuid IS NULL OR a.reference=$4 OR o.owner_id=$10) FOR NO KEY UPDATE OF o' : '') + ') RETURNING *)';
  const params = [id,revision,fingerprint,...fields];
  if (team) params.push(...(isResult ? [scope,actor.id] : [scope,assignee ?? null,assignee !== undefined]));
  const [updated] = await sql.query('WITH changed AS (UPDATE ' + appointments + ' AS a' + update + ' SELECT ' +
    appointmentFields + ',' + contactFields + personFields('assignee_id','assignee_name',team) +
    ' FROM changed a JOIN ' + links + ' o ON o.reference=a.reference' + personJoin('assignee_id',team), params);
  if (updated) return reply(200, {appointment: updated});
  const existing = await readAppointment(context);
  if (!existing) return reply(404, {error: 'missing_appointment'});
  if (existing.last_patch_hash === fingerprint) return appointmentResult(reply, 200, existing);
  if (existing.revision !== revision) return reply(409, {error: 'stale'});
  if (existing.status !== 'scheduled') return reply(409, {error: 'state'});
  return reply(404, {error: 'missing_contact'});
}

async function createActivity({sql, data, reply, links, activities, id, team, actor}) {
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
  const scope = memberScope(actor);
  const fingerprint = hash(team ? [...fields,actor.id] : fields);
  const [result] = await sql.query('WITH target AS (SELECT o.reference,o.stage FROM ' + links + ' o WHERE o.reference=$2' +
    (team ? ' AND ($13::uuid IS NULL OR o.owner_id=$13)' : '') + ' FOR NO KEY UPDATE OF o),' +
    ' inserted AS (INSERT INTO ' + activities +
    ' (id,reference,kind,outcome,occurred_at,notes,request_hash' + (team ? ',actor_id' : '') + ')' +
    ' SELECT $1::uuid,o.reference,$3,$4,$5::timestamptz,$6,$11' + (team ? ',$12::uuid' : '') +
    " FROM target o WHERE (o.stage NOT IN ('ganho','perdido') OR NOT ($7::boolean OR $9::boolean))" +
    ' ON CONFLICT (id) DO NOTHING RETURNING *),' +
    ' followup AS (UPDATE ' + links + ' o SET next_step=CASE WHEN $7::boolean THEN $8 ELSE o.next_step END,' +
    ' due_on=CASE WHEN $9::boolean THEN $10::date ELSE o.due_on END,revision=o.revision+1,updated_at=now()' +
    ' FROM inserted i WHERE o.reference=i.reference AND ($7::boolean OR $9::boolean))' +
    ' SELECT (SELECT row_to_json(result) FROM (SELECT ' + activityFields + ',' + contactFields +
    personFields('actor_id','actor_name',team) + ' FROM inserted a JOIN ' +
    links + ' o ON o.reference=a.reference' + personJoin('actor_id',team) + ') result) AS activity,' +
    ' (SELECT stage FROM target) AS stage',
    team ? [id,...fields,fingerprint,actor.id,scope] : [id,...fields,fingerprint]);
  if (result.activity) return reply(201, {activity:result.activity});
  const [existing] = await sql.query('SELECT ' + activityFields + ',' + contactFields + ',a.request_hash' +
    personFields('actor_id','actor_name',team) + ' FROM ' + activities + ' a JOIN ' + links +
    ' o ON o.reference=a.reference' + personJoin('actor_id',team) + ' WHERE a.id=$1' +
    (team ? ' AND ($2::uuid IS NULL OR a.actor_id=$2)' : ''), team ? [id,scope] : [id]);
  if (!existing) {
    if ((setNext || setDue) && ['ganho','perdido'].includes(result.stage)) return reply(409, {error:'closed_opportunity'});
    return reply(404, {error:'missing_contact'});
  }
  const {request_hash, ...activity} = existing;
  return request_hash === fingerprint ? reply(200, {activity}) : reply(409, {error:'conflict'});
}

export async function handleOperations(context) {
  const {action, method, data, schema, reply} = context;
  const tables = {links:schema + '.opportunities', appointments:schema + '.appointments', activities:schema + '.activities',
    team:context.actor ? schema + '.team_members' : null};
  if (action === 'operations') {
    return method === 'GET' ? getOperations({...context, ...tables}) : reply(405, {error:'method'});
  }
  if (method !== 'POST' && !(action === 'appointment' && method === 'PATCH')) return reply(405, {error:'method'});
  if (typeof data.id !== 'string' || !idPattern.test(data.id)) return reply(400, {error:'invalid'});
  const params = {...context, ...tables, id:data.id.toLowerCase()};
  if (action === 'activity') return createActivity(params);
  return method === 'POST' ? createAppointment(params) : updateAppointment(params);
}
