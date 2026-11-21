const variants = ['call', 'whatsapp'];
const referencePattern = /^CD-[A-Z0-9]{12}$/;

export async function handleTodayExperiments({action, method, sql, schema, data, reply}) {
  const assignments = schema + '.experiment_assignments';
  const opportunities = schema + '.opportunities';

  if (action === 'experiments' && method === 'GET') {
    const activities = schema + '.activities';
    const appointments = schema + '.appointments';
    const groups = await sql.query(
      'SELECT e.variant, count(*)::integer AS contacts, ' +
      'count(*) FILTER (WHERE EXISTS (SELECT 1 FROM ' + activities + ' a ' +
      "WHERE a.reference=e.reference AND a.occurred_at >= e.assigned_at AND a.kind IN ('call','whatsapp','email') AND a.outcome='connected'))::integer AS responses, " +
      'count(*) FILTER (WHERE EXISTS (SELECT 1 FROM ' + activities + ' a ' +
      "WHERE a.reference=e.reference AND a.occurred_at >= e.assigned_at AND a.kind='meeting' AND a.outcome='completed') " +
      'OR EXISTS (SELECT 1 FROM ' + appointments + ' m ' +
      "WHERE m.reference=e.reference AND m.created_at >= e.assigned_at AND m.kind='meeting' AND m.status IN ('scheduled','completed')))::integer AS meetings " +
      'FROM ' + assignments + ' e GROUP BY e.variant'
    );
    const available = await sql.query(
      'SELECT o.reference, o.name, o.company FROM ' + opportunities + ' o LEFT JOIN ' + assignments +
      " e ON e.reference=o.reference WHERE e.reference IS NULL AND o.stage NOT IN ('ganho','perdido') ORDER BY o.company, o.name, o.reference"
    );
    return reply(200, {
      groups: variants.map(variant => groups.find(row => row.variant === variant) || {variant, contacts:0, responses:0, meetings:0}),
      available
    });
  }

  if (action === 'experiment-assignment' && method === 'POST') {
    const {reference, variant} = data;
    if (typeof reference !== 'string' || !referencePattern.test(reference) || !variants.includes(variant)) {
      return reply(400, {error:'invalid'});
    }
    const [created] = await sql.query(
      'INSERT INTO ' + assignments + ' (reference,variant) SELECT reference,$2 FROM ' + opportunities +
      " WHERE reference=$1 AND stage NOT IN ('ganho','perdido') ON CONFLICT (reference) DO NOTHING RETURNING reference,variant",
      [reference,variant]
    );
    if (created) return reply(201, {assignment:created});
    const [existing] = await sql.query('SELECT reference,variant FROM ' + assignments + ' WHERE reference=$1', [reference]);
    if (existing?.variant === variant) return reply(200, {assignment:existing});
    if (existing) return reply(409, {error:'conflict'});
    const [contact] = await sql.query('SELECT stage FROM ' + opportunities + ' WHERE reference=$1', [reference]);
    return contact ? reply(409, {error:'state'}) : reply(404, {error:'missing_contact'});
  }

  return reply(405, {error:'method'});
}
