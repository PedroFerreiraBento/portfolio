const timezone = 'America/Sao_Paulo';
const kinds = new Set(['entry', 'gallery', 'offer', 'demo', 'whatsapp', 'email']);
export const contactReferencePattern = /^CD-[A-Z0-9]{12}$/;
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

// A reference can describe at most one visit with consistent campaign data.
export function matchingVisit(schema, reference, channel) {
  const events = schema + '.funnel_events';
  return `SELECT e.visit_id,e.origin,e.campaign,e.medium,e.creative
    FROM ${events} e WHERE e.contact_reference=${reference}
    AND NOT EXISTS (SELECT 1 FROM ${events} other
      WHERE other.visit_id=e.visit_id AND other.contact_reference IS NOT NULL
      AND other.contact_reference<>e.contact_reference)
    GROUP BY e.visit_id,e.origin,e.campaign,e.medium,e.creative
    HAVING count(*) = (SELECT count(*) FROM ${events} WHERE contact_reference=${reference})
      AND bool_or(e.kind=CASE ${channel} WHEN 'whatsapp' THEN 'whatsapp' WHEN 'site' THEN 'entry' WHEN 'email' THEN 'email' END)`;
}

export async function handleFunnel({action, sql, schema, data, query, reply, limit}) {
  const events = schema + '.funnel_events';
  const qaEnabled = schema === 'crm_preview' && process.env.CRM_QA_TRACKING_ENABLED === '1';
  if (action === 'track') {
    const {visit_id: visitId, kind, placement} = data;
    if (typeof visitId !== 'string' || !/^[a-z0-9-]{12,48}$/.test(visitId) || !kinds.has(kind) ||
        typeof placement !== 'string' || !/^[a-z0-9_-]{1,100}$/.test(placement)) {
      return reply(400, {error: 'invalid'});
    }
    const reference = data.contact_reference ?? null;
    if (reference !== null && (typeof reference !== 'string' || !contactReferencePattern.test(reference))) {
      return reply(400, {error: 'invalid'});
    }
    const origin = slug(data.origin, 'direto');
    const campaign = slug(data.campaign, 'direto');
    if (isQa(origin, campaign) && !qaEnabled) return reply(200, {tracked: false});
    if (kind === 'offer' && !['pagina-de-orcamentos','catalogo-online','agendamento-online'].includes(placement)) return reply(400,{error:'invalid'});
    const galleryLabel = typeof data.gallery_label === 'string' ? data.gallery_label.trim().slice(0,180) : null;
    if (kind === 'gallery' && (!galleryLabel || !/^(solucao|ramo|comparar|abrir)--(orcamento|catalogo|agendamento|operacao)(--[a-z0-9-]+){0,2}$/.test(placement))) return reply(400,{error:'invalid'});
    const path = typeof data.landing_path === 'string' && /^\/[a-z0-9/_.-]{0,200}$/i.test(data.landing_path) ? data.landing_path : null;
    if (!(await limit('track', 600))) return reply(429, {error: 'rate'});
    await sql.query(
      'INSERT INTO ' + events + ' (visit_id,kind,placement,origin,campaign,medium,creative,contact_reference,landing_path,gallery_label)' +
      ' VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (visit_id,kind,placement) DO NOTHING',
      [visitId, kind, kind === 'entry' ? 'entry' : placement, origin, campaign, slug(data.medium, ''), slug(data.creative, ''), reference,path,galleryLabel]
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
  const isTest = "(origin = 'verificacao' OR campaign LIKE 'qa-%')";
  const population = qaEnabled && query.qa === '1' ? isTest : 'NOT ' + isTest;
  const range = "WITH span AS (SELECT ($1::date::timestamp AT TIME ZONE 'America/Sao_Paulo') AS start_at," +
    " (($2::date + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo') AS end_at)";
  const [coverage] = await sql.query("SELECT to_char(MIN(recorded_at) AT TIME ZONE 'America/Sao_Paulo','YYYY-MM-DD') AS tracking_from FROM " + events + ' WHERE ' + population);
  const rows = await sql.query(
    range + ", activity AS (SELECT " + columns + ',' +
    " count(*) FILTER (WHERE kind='entry') AS entries, count(*) FILTER (WHERE kind='demo') AS demos," +
    " count(*) FILTER (WHERE kind='whatsapp') AS whatsapp, count(*) FILTER (WHERE kind='email') AS email," +
    " 0 AS contacts, 0 AS proposals, 0 AS wins, 0 AS cents, 0 AS deposits, 0 AS deposit_cents FROM " + events + ' CROSS JOIN span' +
    ' WHERE recorded_at >= start_at AND recorded_at < end_at AND ' + population + ' GROUP BY ' + groups +
    ' UNION ALL SELECT ' + columns + ', 0, 0, 0, 0, count(*),' +
    " 0, 0, 0, 0, 0 FROM " + opportunities + ' CROSS JOIN span' +
    ' WHERE created_at >= start_at AND created_at < end_at AND ' + population + ' GROUP BY ' + groups +
    ' UNION ALL SELECT ' + columns + ', 0, 0, 0, 0, 0, count(*), 0, 0, 0, 0 FROM ' + opportunities + ' o' +
    ' LEFT JOIN LATERAL (SELECT e.proposal_on FROM ' + schema + '.pipeline_events e' +
    " WHERE e.reference=o.reference AND e.to_stage='proposta' AND e.proposal_on IS NOT NULL ORDER BY e.revision LIMIT 1) first_sent ON true" +
    ' WHERE COALESCE(first_sent.proposal_on,o.proposal_on) BETWEEN $1::date AND $2::date AND ' + population + ' GROUP BY ' + groups +
    ' UNION ALL SELECT ' + columns + ', 0, 0, 0, 0, 0, 0, count(*), sum(value_cents), 0, 0 FROM ' + opportunities + ' CROSS JOIN span' +
    " WHERE stage='ganho' AND won_at >= start_at AND won_at < end_at AND " + population + ' GROUP BY ' + groups +
    ' UNION ALL SELECT ' + columns + ', 0, 0, 0, 0, 0, 0, 0, 0, count(*), sum(deposit_cents) FROM (' +
      "SELECT CASE WHEN origin='direto' AND campaign='direto' AND attributed_visit_id IS NULL THEN 'desconhecida' ELSE origin END AS origin," +
      "CASE WHEN origin='direto' AND campaign='direto' AND attributed_visit_id IS NULL THEN 'sem-atribuicao' ELSE campaign END AS campaign," +
      'medium,creative,deposit_cents FROM ' + opportunities +
      " WHERE deposit_status='received' AND deposit_received_on BETWEEN $1::date AND $2::date AND " + population +
    ') receipts GROUP BY ' + groups +
    ') SELECT origin,campaign,medium,creative,' +
    ' sum(entries)::integer AS entries, sum(demos)::integer AS demos, sum(whatsapp)::integer AS whatsapp,' +
    ' sum(email)::integer AS email, sum(contacts)::integer AS contacts, sum(proposals)::integer AS proposals,' +
    ' sum(wins)::integer AS wins, sum(cents)::bigint AS cents, sum(deposits)::integer AS deposits,' +
    ' sum(deposit_cents)::bigint AS deposit_cents FROM activity GROUP BY origin,campaign,medium,creative' +
    ' ORDER BY cents DESC,deposit_cents DESC,wins DESC,contacts DESC,entries DESC,origin,campaign,medium,creative LIMIT 201',
    [start, end]
  );
  const reference = String(query.visitRef || '').trim().toUpperCase();
  if (reference && !contactReferencePattern.test(reference)) return reply(400, {error:'invalid'});
  const journey = reference ? await sql.query("SELECT visit_id,origin,landing_path,kind,placement,gallery_label FROM " + events +
    " WHERE contact_reference=$1 ORDER BY recorded_at,kind,placement LIMIT 100", [reference]) : [];
  const pages = await sql.query(range + " SELECT kind, CASE WHEN kind='entry' THEN landing_path ELSE placement END AS page, count(DISTINCT visit_id)::integer AS visits FROM " + events +
    " CROSS JOIN span WHERE kind IN ('entry','offer') AND recorded_at >= start_at AND recorded_at < end_at AND " + population +
    " GROUP BY 1,2 ORDER BY kind,visits DESC,page", [start,end]);
  return reply(200, {journey,pages,start, end, breakdown, trackingFrom: coverage?.tracking_from ?? null,
    truncated: rows.length > 200, rows: rows.slice(0, 200)});
}
