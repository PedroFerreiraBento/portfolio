const allowedDays = new Set(['7', '30', '90']);

export async function handleTodayPerformance({method, sql, schema, query, reply}) {
  if (method !== 'GET') return reply(405, {error: 'method'});
  const days = query.days ?? '30';
  if (!allowedDays.has(days)) return reply(400, {error: 'invalid'});

  const activities = schema + '.activities';
  const appointments = schema + '.appointments';
  const opportunities = schema + '.opportunities';
  const [report] = await sql.query(
    "WITH local_day AS (SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS today)," +
    " days AS (SELECT today - ($1::integer - 1) AS start_day, today AS end_day FROM local_day)," +
    " bounds AS (SELECT start_day, end_day, start_day::timestamp AT TIME ZONE 'America/Sao_Paulo' AS starts," +
    " (end_day + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo' AS ends FROM days)," +
    " activity_period AS (SELECT a.kind, a.outcome, (a.occurred_at AT TIME ZONE 'America/Sao_Paulo')::date AS day" +
    " FROM " + activities + " a CROSS JOIN bounds b WHERE a.occurred_at >= b.starts AND a.occurred_at < b.ends AND a.kind <> 'note')," +
    " activity_totals AS (SELECT count(*) FILTER (WHERE kind = 'call')::int AS calls," +
    " count(*) FILTER (WHERE outcome IN ('connected', 'completed'))::int AS encounters FROM activity_period)," +
    " sold AS (SELECT count(*)::int AS won, COALESCE(sum(o.value_cents), 0)::text AS cents FROM " +
    opportunities + " o CROSS JOIN bounds b WHERE o.stage = 'ganho' AND o.won_at >= b.starts AND o.won_at < b.ends)," +
    " deadlines AS (SELECT a.status, a.starts_at + make_interval(mins => a.duration_minutes) AS deadline," +
    " log.occurred_at AS recorded FROM " + appointments + " a CROSS JOIN bounds b LEFT JOIN " + activities +
    " log ON log.appointment_id = a.id WHERE a.starts_at >= b.starts - interval '8 hours' AND a.starts_at < b.ends" +
    " AND a.status <> 'cancelled' AND (a.status <> 'completed' OR log.occurred_at IS NOT NULL))," +
    " due AS (SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'completed' AND recorded <= deadline)::int AS on_time" +
    " FROM deadlines d CROSS JOIN bounds b WHERE d.deadline >= b.starts AND d.deadline < b.ends AND d.deadline <= now())," +
    " week_ranges AS (SELECT greatest(w.day::date, b.start_day) AS from_day, least(w.day::date + 6, b.end_day) AS to_day" +
    " FROM bounds b CROSS JOIN LATERAL generate_series(date_trunc('week', b.start_day::timestamp)," +
    " date_trunc('week', b.end_day::timestamp), interval '7 days') AS w(day))," +
    " weekly AS (SELECT r.from_day, r.to_day, count(a.kind)::int AS count FROM week_ranges r LEFT JOIN activity_period a" +
    " ON a.day BETWEEN r.from_day AND r.to_day GROUP BY r.from_day, r.to_day)" +
    " SELECT activity_totals.calls, activity_totals.encounters, sold.won, sold.cents, due.total AS due, due.on_time," +
    " (SELECT jsonb_agg(jsonb_build_object('start', from_day, 'end', to_day, 'count', count) ORDER BY from_day) FROM weekly) AS weeks" +
    " FROM activity_totals CROSS JOIN sold CROSS JOIN due",
    [Number(days)]
  );

  return reply(200, {days: Number(days), ...report});
}
