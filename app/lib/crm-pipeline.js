import { validClientReference } from './crm-clients.js';
import { matchingVisit } from './crm-funnel.js';

const openStages = ['novo', 'conversa', 'proposta', 'negociacao'];
export const pipelineStages = [...openStages, 'ganho', 'perdido'];
const confirmed = "a.outcome IN ('connected','completed')";

function rowFields(schema) {
  return 'o.reference,COALESCE(o.client_reference,o.reference) AS client_reference,o.project_name,' +
    'o.origin,o.campaign,o.medium,o.creative,o.channel,o.name,o.company,o.email,o.message,' +
    'o.next_step,o.stage,o.value_cents,o.won_at,o.revision,o.created_at,o.updated_at,' +
    'o.due_on::text AS due_on,o.proposal_on::text AS proposal_on,' +
    "COALESCE(o.closed_on,(o.won_at AT TIME ZONE 'America/Sao_Paulo')::date)::text AS closed_on," +
    "COALESCE(o.stage_changed_at,CASE WHEN o.stage='novo' THEN o.created_at END) AS stage_since," +
    'o.loss_reason,o.owner_id,o.won_by_id,owner.name AS owner_name,' +
    'o.visit_reference,o.attributed_visit_id,o.deposit_status,o.deposit_cents,o.deposit_received_on::text AS deposit_received_on,' +
    '(SELECT name FROM ' + schema + '.team_members WHERE id=o.won_by_id) AS won_by_name,' +
    'EXISTS (SELECT 1 FROM ' + schema + '.activities a WHERE a.reference=o.reference AND ' +
    confirmed + ') AS has_confirmed_contact';
}

export async function handlePipeline({action, method, sql, schema, query, reply, actor}) {
  if (method !== 'GET') return reply(405, {error:'method'});
  const scope = actor.role === 'member' ? actor.id : null;
  const opportunities = schema + '.opportunities';
  const team = schema + '.team_members';
  const scopedRows = 'SELECT ' + rowFields(schema) + ' FROM ' + opportunities + ' o LEFT JOIN ' + team +
    ' owner ON owner.id=o.owner_id WHERE ($1::uuid IS NULL OR o.owner_id=$1)';
  if (action === 'pipeline') {
    const [rows,members] = await Promise.all([
      sql.query(scopedRows + ' ORDER BY o.due_on NULLS LAST,o.updated_at DESC,o.reference',[scope]),
      sql.query('SELECT id,name,active FROM ' + team + ' WHERE ($1::uuid IS NULL OR id=$1) ORDER BY lower(name),id',[scope])
    ]);
    return reply(200, {rows,members});
  }

  const reference = query.reference;
  if (!validClientReference(reference)) return reply(400, {error:'invalid'});
  const [row] = await sql.query(scopedRows + ' AND o.reference=$2',[scope,reference]);
  if (!row) return reply(404, {error:'missing_contact'});
  const where = ' WHERE o.reference=$2 AND ($1::uuid IS NULL OR o.owner_id=$1)';
  const visitSource = matchingVisit(schema, '$3::text', '$4::text');
  const [events,activities,depositEvents,visitTrail] = await Promise.all([
    sql.query('SELECT e.reference,e.revision,e.from_stage,e.to_stage,e.actor_id,person.name AS actor_name,e.reason,' +
      'e.value_cents,e.proposal_on::text,e.closed_on::text,e.next_step,e.due_on::text,e.occurred_at,' +
      'e.won_by_id,e.previous_won_by_id,e.previous_value_cents,e.previous_closed_on::text,' +
      '(SELECT name FROM ' + team + ' WHERE id=e.won_by_id) AS won_by_name,' +
      '(SELECT name FROM ' + team + ' WHERE id=e.previous_won_by_id) AS previous_won_by_name' +
      ' FROM ' + schema + '.pipeline_events e JOIN ' + opportunities + ' o ON o.reference=e.reference' +
      ' LEFT JOIN ' + team + ' person ON person.id=e.actor_id' + where + ' ORDER BY e.revision DESC',[scope,reference]),
    sql.query('SELECT a.id,a.reference,a.kind,a.outcome,a.occurred_at,a.notes,a.actor_id,person.name AS actor_name' +
      ' FROM ' + schema + '.activities a JOIN ' + opportunities + ' o ON o.reference=a.reference' +
      ' LEFT JOIN ' + team + ' person ON person.id=a.actor_id' + where +
      ' AND ($1::uuid IS NULL OR a.actor_id=$1) ORDER BY a.occurred_at DESC,a.id',[scope,reference]),
    sql.query('SELECT d.revision,d.status,d.value_cents,d.received_on::text,d.occurred_at,person.name AS actor_name' +
      ' FROM ' + schema + '.deposit_events d JOIN ' + opportunities + ' o ON o.reference=d.reference' +
      ' LEFT JOIN ' + team + ' person ON person.id=d.actor_id' + where + ' ORDER BY d.revision DESC',[scope,reference]),
    !row.attributed_visit_id ? [] : sql.query(
      `WITH visit AS (${visitSource})
       SELECT e.kind,e.placement,e.recorded_at FROM visit JOIN ${schema}.funnel_events e USING (visit_id)
       JOIN ${opportunities} o ON o.attributed_visit_id=visit.visit_id${where}
       AND e.contact_reference=$3 ORDER BY e.recorded_at,e.kind,e.placement LIMIT 50`,
      [scope,reference,row.visit_reference,row.channel])
  ]);
  const attribution = row.attributed_visit_id
    ? {status: visitTrail.length ? 'linked' : 'conflict', events: visitTrail}
    : {status: row.visit_reference ? 'unmatched' : 'manual', events: []};
  return reply(200, {row,events,activities,attribution,depositEvents});
}

function optionalText(value,max) {
  if (value===null || value===undefined) return null;
  if (typeof value!=='string' || value.length>max || value.includes('\0')) return false;
  return value.trim() || null;
}

export async function changePipelineStage({method, sql, schema, data, reply, actor, dateOnly}) {
  if (method !== 'PATCH' && method !== 'POST') return reply(405, {error:'method'});
  const {reference,revision,stage} = data;
  const step = optionalText(data.next_step,240);
  const reason = optionalText(data.reason,500);
  const cents = data.value_cents ?? null;
  const dates = [data.due_on,data.proposal_on,data.closed_on]
    .map(value=>value==null || value==='' ? null : dateOnly(value) || false);
  const [due,proposed,closed] = dates;
  if (!validClientReference(reference) || !Number.isInteger(revision) || revision<1 || revision>2147483647 ||
      !pipelineStages.includes(stage) || step===false || reason===false || dates.includes(false) ||
      (cents!==null && (!Number.isInteger(cents) || cents<1 || cents>2147483647))) return reply(400,{error:'invalid'});
  const scope = actor.role === 'member' ? actor.id : null;
  const opportunities = schema + '.opportunities';
  const [result] = await sql.query(pipelineTransition(schema, opportunities),
    [reference,scope,revision,stage,step,due,cents,proposed,closed,reason,actor.id,openStages]);
  if (!result) return reply(404,{error:'missing_contact'});
  if (result.error) {
    const status = ['stale','stage_transition'].includes(result.error) ? 409 : 422;
    return reply(status, {error:result.error});
  }
  return reply(200,{row:result.row});
}

function pipelineTransition(schema, opportunities) {
  return [
    'WITH prior AS MATERIALIZED (',
    '  SELECT o.*, (now() AT TIME ZONE \'America/Sao_Paulo\')::date AS today,',
    '    EXISTS(SELECT 1 FROM ' + schema + '.activities a WHERE a.reference=o.reference AND ' + confirmed + ') AS confirmed',
    '  FROM ' + opportunities + ' o WHERE o.reference=$1 AND ($2::uuid IS NULL OR o.owner_id=$2) FOR UPDATE',
    '), checked AS (',
    '  SELECT p.*, CASE',
    "    WHEN p.revision<>$3 THEN 'stale'",
    "    WHEN p.stage=$4 AND p.stage NOT IN ('proposta','negociacao') THEN 'stage_transition'",
    "    WHEN p.stage IN ('ganho','perdido') AND $4 NOT IN ('novo','conversa') THEN 'stage_transition'",
    "    WHEN $4='ganho' AND p.stage NOT IN ('proposta','negociacao') THEN 'stage_transition'",
    "    WHEN $4='negociacao' AND p.stage NOT IN ('proposta','negociacao') THEN 'stage_transition'",
    "    WHEN $4='proposta' AND p.stage NOT IN ('conversa','proposta','negociacao') THEN 'stage_transition'",
    "    WHEN p.stage='novo' AND $4='conversa' AND NOT p.confirmed THEN 'first_contact_required'",
    "    WHEN ($4='perdido' OR p.stage IN ('ganho','perdido') OR",
    "         array_position($12::text[],p.stage)>array_position($12::text[],$4)) AND $10::text IS NULL THEN 'reason_required'",
    "    WHEN $4='proposta' AND ($7::integer IS NULL OR $8::date IS NULL OR $8>p.today OR $5::text IS NULL OR $6::date IS NULL OR $6<$8) THEN 'proposal_required'",
    "    WHEN $4='negociacao' AND ($5::text IS NULL OR $6::date IS NULL) THEN 'followup_required'",
    "    WHEN $4 IN ('ganho','perdido') AND ($9::date IS NULL OR $9>p.today OR",
    "      (p.proposal_on IS NOT NULL AND $9<p.proposal_on) OR ($4='ganho' AND $7::integer IS NULL)) THEN 'closure_required'",
    '  END AS error FROM prior p',
    '), moved AS (',
    '  UPDATE ' + opportunities + ' AS o SET stage=$4,stage_changed_at=CASE WHEN p.stage=$4 THEN p.stage_changed_at ELSE now() END,',
    '    revision=o.revision+1,updated_at=now(),',
    "    next_step=CASE WHEN $4 IN ('ganho','perdido') THEN '' ELSE COALESCE($5,p.next_step) END,",
    "    due_on=CASE WHEN $4 IN ('ganho','perdido') THEN NULL ELSE COALESCE($6,p.due_on) END,",
    "    value_cents=CASE WHEN $4 IN ('novo','conversa') THEN NULL ELSE COALESCE($7,p.value_cents) END,",
    "    proposal_on=CASE WHEN $4='proposta' THEN $8 WHEN $4 IN ('novo','conversa') THEN NULL ELSE p.proposal_on END,",
    "    closed_on=CASE WHEN $4 IN ('ganho','perdido') THEN $9 END,",
    "    loss_reason=CASE WHEN $4='perdido' THEN $10 END,",
    "    won_at=CASE WHEN $4='ganho' THEN CASE WHEN $9=p.today THEN now()",
    "      ELSE ($9+time '12:00') AT TIME ZONE 'America/Sao_Paulo' END END,",
    "    won_by_id=CASE WHEN $4='ganho' THEN COALESCE(o.owner_id,$11::uuid) END",
    "  FROM checked p WHERE o.reference=p.reference AND p.error IS NULL",
    '  RETURNING o.*,p.stage AS from_stage,p.won_by_id AS previous_won_by_id,p.value_cents AS previous_value_cents,',
    "    COALESCE(p.closed_on,(p.won_at AT TIME ZONE 'America/Sao_Paulo')::date) AS previous_closed_on",
    '), audited AS (',
    '  INSERT INTO ' + schema + '.pipeline_events',
    '    (reference,revision,from_stage,to_stage,actor_id,won_by_id,reason,value_cents,proposal_on,closed_on,next_step,due_on,',
    '     previous_won_by_id,previous_value_cents,previous_closed_on)',
    '  SELECT reference,revision,from_stage,stage,$11,won_by_id,$10,value_cents,proposal_on,closed_on,next_step,due_on,',
    '    previous_won_by_id,previous_value_cents,previous_closed_on FROM moved RETURNING reference',
    ') SELECT c.error, (SELECT (to_jsonb(o)-\'from_stage\'-\'previous_won_by_id\'-\'previous_value_cents\'-\'previous_closed_on\')',
    "  || jsonb_build_object('client_reference',COALESCE(o.client_reference,o.reference),'stage_since',o.stage_changed_at,",
    "  'has_confirmed_contact',c.confirmed,'owner_name',(SELECT name FROM " + schema + ".team_members WHERE id=o.owner_id),",
    "  'won_by_name',(SELECT name FROM " + schema + ".team_members WHERE id=o.won_by_id))",
    '  FROM moved o JOIN audited a ON a.reference=o.reference) AS row FROM checked c'
  ].join('\n');
}
