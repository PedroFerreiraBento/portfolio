const t = text => window.caosTranslate?.(text) ?? text;
const dayMs = 86_400_000;
const pt = new Intl.NumberFormat('pt-BR');
const brl = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
const localDate = new Intl.DateTimeFormat('sv-SE', {
 timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
});

function displayDay(value) {
 return value.split('-').reverse().join('/');
}

function field(label, value) {
 const item = document.createElement('div');
 const title = document.createElement('dt');
 const total = document.createElement('dd');
 title.textContent = t(label);
 total.textContent = value;
 item.append(title, total);
 return item;
}

export function initFunnel(loadFunnel) {
 const root = document.getElementById('campaign-report');
 const form = root.querySelector('form');
 const status = root.querySelector('#funnel-status');
 const coverage = root.querySelector('#funnel-coverage');
 const results = root.querySelector('.funnel-results');
 const journey = root.querySelector('#visit-journey');
 const pages = root.querySelector('#visit-pages');
 let request = 0;
 let currentReport;
 let message = '';
 const setStatus = value => { message = value; status.textContent = t(value); };

 function setDefaultPeriod() {
  const today = localDate.format(new Date());
  form.elements.start.value = new Date(Date.parse(today) - 29 * dayMs).toISOString().slice(0, 10);
  form.elements.end.value = today;
  form.elements.end.max = today;
  form.elements.start.max = today;
  form.elements.visitRef.value = new URLSearchParams(location.search).get('visita') || '';
  form.elements.breakdown.value = 'campaign';
 }

 function row(entry, tracking, breakdown) {
  const element = document.createElement('li');
  const name = document.createElement('div');
  element.dataset.noTranslate = '';
  name.className = 'funnel-campaign';
  const campaign = document.createElement('strong');
  const source = document.createElement('span');
  campaign.textContent = entry.campaign === 'sem-atribuicao' ? t('Sem atribuição') : entry.campaign;
  source.textContent = breakdown === 'creative'
   ? [entry.origin, entry.medium || t('Sem meio'), entry.creative || t('Sem criativo')].join(' · ')
   : entry.origin;
  name.append(campaign, source);
  const metrics = document.createElement('dl');
  const measured = count => tracking ? pt.format(count) : '—';
  metrics.append(
   field('Entradas', measured(entry.entries)),
   field('Demos', measured(entry.demos)),
   field('WhatsApp', measured(entry.whatsapp)),
   field('E-mail', measured(entry.email)),
   field('Contatos', pt.format(entry.contacts)),
   field('Propostas abertas', pt.format(entry.proposals)),
   field('Vendas', pt.format(entry.wins)),
   field('Valor fechado', brl.format(Number(entry.cents) / 100))
  );
  const payments = document.createElement('dl');
  payments.className = 'funnel-receipts';
  payments.append(
   field('Entradas recebidas', pt.format(entry.deposits ?? 0)),
   field('Total recebido', brl.format(Number(entry.deposit_cents ?? 0) / 100))
  );
  const data = document.createElement('div');
  data.className = 'funnel-data';
  data.append(metrics, payments);
  element.append(name, data);
  return element;
 }

 function renderReport(report) {
   journey.hidden = !form.elements.visitRef.value;
   journey.querySelector('p').textContent = form.elements.visitRef.value.toUpperCase() + (report.journey?.length ? '' : ' · Nenhuma visita encontrada');
   journey.querySelector('ul').replaceChildren(...(report.journey || []).map(event => {
    const line = document.createElement('li');
    const label = {entry:'Entrada',offer:'Oferta visitada',demo:'Demo',whatsapp:'WhatsApp',email:'E-mail'}[event.kind];
    const galleryAction = {solucao:'Solução escolhida',ramo:'Ramo escolhido',comparar:'Comparação aberta',abrir:'Demonstração visitada'}[event.placement.split('--')[0]];
    line.textContent = [label || galleryAction, event.kind === 'entry' ? event.landing_path || 'Página desconhecida' : event.gallery_label || event.placement, 'Origem ' + event.origin, event.visit_id].join(' · ');
    return line;
   }));
   pages.hidden = !report.pages?.length;
   pages.querySelector('ul').replaceChildren(...(report.pages || []).map(item => {
    const line = document.createElement('li');
    const kind = item.kind === 'entry' ? 'Entrada' : 'Oferta';
    line.textContent = t(kind) + ' · ' + (item.page || t('Página desconhecida')) + ' · ' + pt.format(item.visits);
    return line;
   }));
   const tracking = Boolean(report.trackingFrom && report.trackingFrom <= report.end);
   const metricNote = !tracking
    ? t('Cliques e entradas ainda não foram medidos neste período.')
    : report.start < report.trackingFrom
     ? t('Entradas e cliques disponíveis a partir de {date}.').replace('{date}', displayDay(report.trackingFrom))
     : '';
   const notes = [t('Contatos e propostas abertas usam a data de entrada. Vendas e valor fechado usam a data de fechamento.'), metricNote];
   notes.push(t('Entradas recebidas usam a data do recebimento.'));
   if (report.truncated) notes.push(t('Mostrando 200 resultados. Reduza o período para detalhar os demais.'));
   coverage.textContent = notes.filter(Boolean).join(' ');
   results.replaceChildren(...report.rows.map(entry => row(entry, tracking, report.breakdown)));
   setStatus(report.rows.length ? '' : 'Nenhuma atividade no período selecionado.');
 }

 async function refresh() {
  const current = ++request;
  journey.hidden = true;
  pages.hidden = true;
  root.setAttribute('aria-busy', 'true');
  status.dataset.error = 'false';
  setStatus('Carregando campanhas…');
  const filters = new URLSearchParams(new FormData(form));
  try {
   const report = await loadFunnel(filters.toString());
   if (current !== request) return;
   currentReport = report;
   renderReport(report);
  } catch (error) {
   if (current !== request) return;
   results.replaceChildren();
   coverage.textContent = '';
   status.dataset.error = 'true';
   currentReport = undefined;
   setStatus(error.message);
  } finally {
   if (current === request) root.removeAttribute('aria-busy');
  }
 }

 function reset() {
  journey.hidden = true;
  pages.hidden = true;
  request++;
  root.removeAttribute('aria-busy');
  currentReport = undefined;
  setStatus('');
  coverage.textContent = '';
  results.replaceChildren();
  setDefaultPeriod();
 }

 form.addEventListener('submit', event => {
  event.preventDefault();
  if (form.elements.end.value < form.elements.start.value) {
   status.dataset.error = 'true';
   setStatus('A data final precisa ser igual ou posterior à inicial.');
   return;
  }
  refresh();
 });
 setDefaultPeriod();
 document.addEventListener('caos-language-change', () => {
  if (currentReport && !root.hasAttribute('aria-busy') && status.dataset.error !== 'true') renderReport(currentReport);
  else status.textContent = t(message);
 });
 return {refresh, reset};
}
