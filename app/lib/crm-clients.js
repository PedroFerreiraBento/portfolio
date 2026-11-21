const referencePattern = /^CD-[A-Z0-9]{12}$/;

export function validClientReference(value) {
  return typeof value === 'string' && referencePattern.test(value);
}

function clientOverview(schema) {
  const opportunities = schema + '.opportunities';
  return `SELECT root.reference,o.reference AS opportunity_reference,
    root.name,root.company,root.email,root.owner_id,owner.name AS owner_name,
    o.stage,o.next_step,o.due_on::text AS due_on,o.revision,
    root.created_at,GREATEST(root.updated_at,o.updated_at) AS updated_at,
    chosen.opportunity_count,contact.last_contact_at
    FROM ${opportunities} root
    JOIN LATERAL (
      SELECT project.reference, count(*) OVER ()::int AS opportunity_count
      FROM ${opportunities} project
      WHERE (project.reference=root.reference OR project.client_reference=root.reference)
        AND ($1::uuid IS NULL OR project.owner_id=$1)
      ORDER BY (project.stage IN ('ganho','perdido')),project.due_on NULLS LAST,
        project.updated_at DESC,project.reference
      LIMIT 1
    ) chosen ON TRUE
    JOIN ${opportunities} o ON o.reference=chosen.reference
    LEFT JOIN ${schema}.team_members owner ON owner.id=root.owner_id
    LEFT JOIN LATERAL (
      SELECT max(a.occurred_at) AS last_contact_at
      FROM ${schema}.activities a JOIN ${opportunities} project ON project.reference=a.reference
      WHERE (project.reference=root.reference OR project.client_reference=root.reference)
        AND ($1::uuid IS NULL OR project.owner_id=$1)
        AND a.outcome IN ('connected','completed')
    ) contact ON TRUE
    WHERE root.client_reference IS NULL AND ($1::uuid IS NULL OR root.owner_id=$1)`;
}

export async function handleClients({action, method, sql, schema, query, reply, actor}) {
  if (method !== 'GET') return reply(405, {error:'method'});
  const scope = actor?.role === 'member' ? actor.id : null;
  const overview = clientOverview(schema);
  if (action === 'clients') {
    const [clients,members] = await Promise.all([
      sql.query(overview + ` ORDER BY
        CASE WHEN o.stage IN ('ganho','perdido') THEN 2 WHEN o.due_on IS NULL THEN 1 ELSE 0 END,
        o.due_on,lower(root.name),root.reference`, [scope]),
      actor ? sql.query(`SELECT id,name,active FROM ${schema}.team_members
        WHERE ($1::uuid IS NULL OR id=$1) ORDER BY lower(name),id`,[scope]) : Promise.resolve([])
    ]);
    return reply(200, {clients,members});
  }

  if (!validClientReference(query.reference)) return reply(400, {error:'invalid'});
  const opportunities = schema + '.opportunities';
  const [client] = await sql.query(overview + `
    AND root.reference=(
      SELECT COALESCE(project.client_reference,project.reference) FROM ${opportunities} project
      WHERE project.reference=$2 AND ($1::uuid IS NULL OR project.owner_id=$1)
    )`, [scope,query.reference]);
  if (!client) return reply(404, {error:'missing_contact'});

  const params = [scope,client.reference];
  const projectWhere = `(project.reference=$2 OR project.client_reference=$2)
    AND ($1::uuid IS NULL OR (project.owner_id=$1 AND root.owner_id=$1))`;
  const [projects,activities] = await Promise.all([
    sql.query(`SELECT project.reference,COALESCE(project.client_reference,project.reference) AS client_reference,
      project.project_name,project.origin,project.campaign,project.medium,project.creative,project.channel,
      root.name,root.company,root.email,project.message,project.next_step,project.stage,project.value_cents,
      project.won_at,project.revision,project.created_at,project.updated_at,project.due_on::text AS due_on,
      project.owner_id,project.won_by_id,owner.name AS owner_name,
      CASE WHEN n.failed_at IS NOT NULL THEN 'failed' WHEN n.sent_at IS NOT NULL THEN 'accepted'
        WHEN n.reference IS NOT NULL THEN 'pending' END AS notification_status
      FROM ${opportunities} project
      JOIN ${opportunities} root ON root.reference=$2
      LEFT JOIN ${schema}.team_members owner ON owner.id=project.owner_id
      LEFT JOIN ${schema}.notification_outbox n ON n.reference=project.reference
      WHERE ${projectWhere}
      ORDER BY project.created_at DESC,project.reference`,params),
    sql.query(`SELECT a.id,a.reference,a.appointment_id,a.kind,a.outcome,a.occurred_at,a.notes,
      root.name,root.company,a.actor_id,person.name AS actor_name
      FROM ${schema}.activities a JOIN ${opportunities} project ON project.reference=a.reference
      JOIN ${opportunities} root ON root.reference=$2
      LEFT JOIN ${schema}.team_members person ON person.id=a.actor_id
      WHERE ${projectWhere} AND ($1::uuid IS NULL OR a.actor_id=$1)
      ORDER BY a.occurred_at DESC,a.id`,params)
  ]);
  return projects.length ? reply(200, {client,opportunities:projects,activities}) : reply(404, {error:'missing_contact'});
}

export async function updateClientFollowup({sql, schema, reply, actor, reference, revision, nextStep, dueOn}) {
  const scope = actor?.role === 'member' ? actor.id : null;
  const opportunities = schema + '.opportunities';
  const [result] = await sql.query(`WITH updated AS (
      UPDATE ${opportunities} o SET next_step=$3,due_on=$4::date,revision=revision+1,updated_at=now()
      WHERE o.reference=$1 AND o.revision=$2 AND ($5::uuid IS NULL OR o.owner_id=$5)
        AND o.stage NOT IN ('ganho','perdido')
      RETURNING o.reference,COALESCE(o.client_reference,o.reference) AS client_reference,
        o.next_step,o.due_on::text AS due_on,o.revision,o.updated_at
    )
    SELECT (SELECT to_jsonb(updated) FROM updated) AS row,
      (SELECT stage FROM ${opportunities} WHERE reference=$1 AND ($5::uuid IS NULL OR owner_id=$5)) AS stage`,
    [reference,revision,nextStep,dueOn,scope]);
  if (result.row) return reply(200, {row:result.row});
  if (!result.stage) return reply(404, {error:'missing_contact'});
  return reply(409, {error:['ganho','perdido'].includes(result.stage) ? 'closed_opportunity' : 'stale'});
}
