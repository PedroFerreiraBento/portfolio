const allowedDays = new Set(['7', '30', '90']);
const memberIdPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export async function handleTodayPerformance({method, sql, schema, query, reply, actor}) {
  if (method !== 'GET') return reply(405, {error: 'method'});
  const days = query.days ?? '30';
  if (!allowedDays.has(days)) return reply(400, {error: 'invalid'});
  const previous = query.previous === '1';
  const detailed = query.detail === '1';
  const individual = actor?.role === 'member';
  const requestedScope = query.member ?? (individual ? actor.id : 'all');
  if (typeof requestedScope !== 'string') return reply(400, {error: 'invalid'});
  const scope = requestedScope.toLowerCase();
  if (individual && scope !== actor.id) return reply(403, {error: 'forbidden'});
  if (scope !== 'all' && (!actor || (scope !== 'unassigned' && !memberIdPattern.test(scope)))) {
    return reply(400, {error: 'invalid'});
  }

  const activities = schema + '.activities';
  const appointments = schema + '.appointments';
  const opportunities = schema + '.opportunities';
  const team = schema + '.team_members';
  const actorField = actor ? 'a.actor_id' : 'NULL::uuid';
  const sellerField = actor ? 'o.won_by_id' : 'NULL::uuid';
  const assigneeField = actor ? 'a.assignee_id' : 'NULL::uuid';
  const inScope = "($2::text = 'all' OR ($2 = 'unassigned' AND member_id IS NULL) OR member_id::text = lower($2))";
  const personMetrics = actor ? `,
    people AS (
      SELECT t.id, t.name, t.active FROM ${team} t WHERE $3::uuid IS NULL OR t.id = $3
      UNION ALL SELECT NULL::uuid, 'Sem responsável', false WHERE $3::uuid IS NULL
    ),
    people_metrics AS (
      SELECT member_id, count(*) FILTER (WHERE kind = 'call') AS calls,
        count(*) FILTER (WHERE outcome IN ('connected', 'completed')) AS encounters,
        0 AS won, 0 AS cents, 0 AS due, 0 AS on_time
      FROM activity_period GROUP BY member_id
      UNION ALL
      SELECT member_id, 0, 0, count(*), COALESCE(sum(value_cents), 0), 0, 0
      FROM sales_period GROUP BY member_id
      UNION ALL
      SELECT member_id, 0, 0, 0, 0, count(*), count(*) FILTER (WHERE on_time)
      FROM deadlines_period GROUP BY member_id
    ),
    people_totals AS (
      SELECT member_id, sum(calls)::int AS calls, sum(encounters)::int AS encounters,
        sum(won)::int AS won, sum(cents)::text AS cents, sum(due)::int AS due, sum(on_time)::int AS on_time
      FROM people_metrics GROUP BY member_id
    ),
    report_people AS (
      SELECT p.id, p.name, p.active, COALESCE(t.calls, 0) AS calls, COALESCE(t.encounters, 0) AS encounters,
        COALESCE(t.won, 0) AS won, COALESCE(t.cents, '0') AS cents, COALESCE(t.due, 0) AS due, COALESCE(t.on_time, 0) AS on_time
      FROM people p LEFT JOIN people_totals t ON p.id IS NOT DISTINCT FROM t.member_id
      WHERE p.active OR t.calls IS NOT NULL OR p.id::text = $2 OR (p.id IS NULL AND $2 = 'unassigned')
    )` : '';
  const selectPeople = actor ? `,
    (SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.id IS NULL, p.active DESC, p.name, p.id), '[]'::jsonb) FROM report_people p) AS members,
    ($2 IN ('all', 'unassigned') OR EXISTS (SELECT 1 FROM people WHERE id::text = lower($2))) AS scope_exists` : '';
  const params = actor ? [Number(days), scope, individual ? actor.id : null] : [Number(days), scope];
  const endDay = previous ? 'today - $1::integer' : 'today';
  const weeklyMetrics = detailed ? `,
    weekly_inputs AS (
      SELECT day, 1 AS count, (kind = 'call')::int AS calls,
        (outcome IN ('connected', 'completed'))::int AS encounters, 0 AS won, 0 AS cents, 0 AS due, 0 AS on_time
      FROM scoped_activities
      UNION ALL
      SELECT day, 0, 0, 0, 1, value_cents, 0, 0 FROM sales_period WHERE ${inScope}
      UNION ALL
      SELECT day, 0, 0, 0, 0, 0, 1, on_time::int FROM deadlines_period WHERE ${inScope}
    )` : '';
  const weeklyQuery = detailed ? `
      SELECT r.from_day, r.to_day, COALESCE(sum(a.count),0)::int AS count,
        COALESCE(sum(a.calls),0)::int AS calls, COALESCE(sum(a.encounters),0)::int AS encounters,
        COALESCE(sum(a.won),0)::int AS won, COALESCE(sum(a.cents),0)::text AS cents,
        COALESCE(sum(a.due),0)::int AS due, COALESCE(sum(a.on_time),0)::int AS on_time
      FROM week_ranges r LEFT JOIN weekly_inputs a ON a.day BETWEEN r.from_day AND r.to_day
      GROUP BY r.from_day, r.to_day` : `
      SELECT r.from_day, r.to_day, count(a.kind)::int AS count
      FROM week_ranges r LEFT JOIN scoped_activities a ON a.day BETWEEN r.from_day AND r.to_day
      GROUP BY r.from_day, r.to_day`;
  const [report] = await sql.query(`
    WITH local_day AS (SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS today),
    days AS (SELECT ${endDay} - ($1::integer - 1) AS start_day, ${endDay} AS end_day FROM local_day),
    bounds AS (
      SELECT start_day, end_day, start_day::timestamp AT TIME ZONE 'America/Sao_Paulo' AS starts,
        (end_day + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo' AS ends
      FROM days
    ),
    activity_period AS (
      SELECT ${actorField} AS member_id, a.kind, a.outcome, (a.occurred_at AT TIME ZONE 'America/Sao_Paulo')::date AS day
      FROM ${activities} a CROSS JOIN bounds b
      WHERE a.occurred_at >= b.starts AND a.occurred_at < b.ends AND a.kind <> 'note'
    ),
    sales_period AS (
      SELECT ${sellerField} AS member_id, o.value_cents, (o.won_at AT TIME ZONE 'America/Sao_Paulo')::date AS day
      FROM ${opportunities} o CROSS JOIN bounds b
      WHERE o.stage = 'ganho' AND o.won_at >= b.starts AND o.won_at < b.ends
    ),
    deadlines AS (
      SELECT ${assigneeField} AS member_id, a.status, a.starts_at + make_interval(mins => a.duration_minutes) AS deadline,
        log.occurred_at AS recorded
      FROM ${appointments} a CROSS JOIN bounds b LEFT JOIN ${activities} log ON log.appointment_id = a.id
      WHERE a.starts_at >= b.starts - interval '8 hours' AND a.starts_at < b.ends
        AND a.status <> 'cancelled' AND (a.status <> 'completed' OR log.occurred_at IS NOT NULL)
    ),
    deadlines_period AS (
      SELECT member_id, status = 'completed' AND recorded <= deadline AS on_time,
        (deadline AT TIME ZONE 'America/Sao_Paulo')::date AS day
      FROM deadlines d CROSS JOIN bounds b
      WHERE d.deadline >= b.starts AND d.deadline < b.ends AND d.deadline <= now()
    ),
    scoped_activities AS (SELECT kind, outcome, day FROM activity_period WHERE ${inScope}),
    activity_totals AS (
      SELECT count(*) FILTER (WHERE kind = 'call')::int AS calls,
        count(*) FILTER (WHERE outcome IN ('connected', 'completed'))::int AS encounters
      FROM scoped_activities
    ),
    sold AS (
      SELECT count(*)::int AS won, COALESCE(sum(value_cents), 0)::text AS cents
      FROM sales_period WHERE ${inScope}
    ),
    due AS (
      SELECT count(*)::int AS total, count(*) FILTER (WHERE on_time)::int AS on_time
      FROM deadlines_period WHERE ${inScope}
    ),
    week_ranges AS (
      SELECT greatest(w.day::date, b.start_day) AS from_day, least(w.day::date + 6, b.end_day) AS to_day
      FROM bounds b CROSS JOIN LATERAL generate_series(
        date_trunc('week', b.start_day::timestamp), date_trunc('week', b.end_day::timestamp), interval '7 days'
      ) AS w(day)
    )${weeklyMetrics},
    weekly AS (${weeklyQuery})${personMetrics}
    SELECT activity_totals.calls, activity_totals.encounters, sold.won, sold.cents, due.total AS due, due.on_time,
      (SELECT jsonb_agg(jsonb_build_object('start', from_day, 'end', to_day) ||
        (to_jsonb(weekly) - 'from_day' - 'to_day') ORDER BY from_day) FROM weekly) AS weeks${selectPeople}
    FROM activity_totals CROSS JOIN sold CROSS JOIN due
  `, params);

  const {scope_exists: scopeExists, ...metrics} = report;
  if (scopeExists === false) return reply(404, {error: 'missing_member'});
  return reply(200, {days: Number(days), ...(actor && {scope}), ...metrics});
}
