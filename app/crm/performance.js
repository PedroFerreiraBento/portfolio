import { weekLabel } from './today-performance.js';

const labels = {
 'Desempenho':'Performance', 'Período':'Period', 'Visão':'View', 'Equipe':'Team',
 'Visão geral':'Overview',
 'Ligações':'Calls', 'Atendimentos':'Conversations', 'Vendas':'Sales', 'Valor fechado':'Won value', 'No prazo':'On time',
 'Últimos 7 dias':'Last 7 days', 'Últimos 30 dias':'Last 30 days', 'Últimos 90 dias':'Last 90 days',
 'Comparação da equipe':'Team comparison', 'Comparar por':'Compare by', 'Pessoa':'Person',
 'Selecione uma pessoa para ver os detalhes.':'Select a person to see their results.',
 'Sem responsável':'Unassigned', 'Conta inativa':'Inactive account', 'Ver resultados de':'View results for',
 'Carregando desempenho…':'Loading performance…', 'Não foi possível carregar o desempenho.':'Performance could not be loaded.',
 'Tentar novamente':'Try again', 'Como os números são calculados':'How the numbers are calculated',
 'Ligações incluem tentativas. Atendimentos incluem contatos confirmados e reuniões realizadas. Atividades por semana incluem os registros de todos os canais, exceto anotações internas.':'Calls include attempts. Conversations include confirmed contacts and completed meetings. Weekly activity includes entries from all channels except internal notes.',
 'O valor fechado segue a pessoa responsável pela venda no fechamento. A pontualidade usa os compromissos cujo horário final já passou. Cancelamentos e conclusões sem horário registrado ficam fora do cálculo.':'Won value is credited to the person responsible at closing. Timeliness uses appointments whose scheduled end has passed. Cancellations and completions without a recorded time are excluded.',
 'Sem compromissos avaliáveis':'No eligible appointments',
 'Período anterior':'Previous period', 'Sem variação':'No change', 'Sem base comparável':'No comparable data',
 'Comparar pessoas':'Compare people', 'Comparar com':'Compare with', 'Sem comparação':'No comparison',
 'Encerrar comparação':'End comparison',
 'Evolução por semana':'Weekly trends', 'Indicador do gráfico':'Chart metric', 'Atividades':'Activities',
 'Primeira e última semana podem ter menos dias.':'The first and last week may have fewer days.',
 'Nenhum valor registrado para este indicador no período.':'No values were recorded for this metric in this period.',
 'Hoje em andamento':'Today is in progress',
};
const metricFields = {calls:'Ligações', encounters:'Atendimentos', won:'Vendas', cents:'Valor fechado', on_time:'No prazo'};
const keys = Object.keys(metricFields);
const noValue = '—';
const personKey = member => member.id || 'unassigned';
const metricNumber = (item, key) => key==='on_time' ? (item.due ? item.on_time/item.due : null) : Number(item[key]);

function element(tag, text, css) {
 const node = document.createElement(tag);
 if (text !== undefined) node.textContent = text;
 if (css) node.className = css;
 return node;
}

function meter(value, max) {
 const track=element('span',undefined,'performance-meter');
 const bar=element('span');
 bar.style.inlineSize=(max && value!==null ? value/max*100 : 0)+'%';
 track.append(bar);
 track.setAttribute('aria-hidden','true');
 return track;
}

export function initPerformancePage(api, getActor) {
 const root=document.getElementById('performance-page');
 root.innerHTML = '<div class="performance-heading"><div class="performance-heading-title"><h1 id="performance-title" data-copy="Desempenho"></h1>'+
  '<button class="quiet" type="button" id="performance-compare" hidden></button></div>'+
  '<div class="performance-filters"><label id="performance-scope-field"><span data-copy="Visão"></span><select id="performance-scope"></select></label>'+
  '<label id="performance-peer-field" hidden><span data-copy="Comparar com"></span><select id="performance-peer"></select></label>'+
  '<label><span data-copy="Período"></span><select id="performance-period">'+
  '<option value="7" data-copy="Últimos 7 dias"></option><option value="30" data-copy="Últimos 30 dias" selected></option><option value="90" data-copy="Últimos 90 dias"></option></select></label></div></div>'+
  '<div class="performance-feedback"><p id="performance-status" role="status"></p><button class="quiet" type="button" id="performance-retry" data-copy="Tentar novamente" hidden></button></div>'+
  '<div id="performance-results" hidden>'+
  '<section class="performance-overview" aria-labelledby="performance-overview-title">'+
  '<div class="performance-overview-heading"><h2 id="performance-overview-title" tabindex="-1"></h2><div><p id="performance-dates"></p><p id="performance-previous-dates"></p></div></div>'+
  '<dl id="performance-summary"></dl></section>'+
  '<section class="performance-trend" aria-labelledby="performance-trend-title">'+
  '<div class="performance-section-heading"><div><h2 id="performance-trend-title" data-copy="Evolução por semana"></h2>'+
  '<p id="performance-trend-scope"></p></div>'+
  '<label><span data-copy="Indicador do gráfico"></span><select id="performance-trend-metric"></select></label></div>'+
  '<div id="performance-trend-content"></div><p class="performance-trend-note" data-copy="Primeira e última semana podem ter menos dias."></p></section>'+
  '<div class="performance-columns">'+
  '<section id="performance-comparison" aria-labelledby="performance-team-title" hidden>'+
  '<div class="performance-section-heading"><div><h2 id="performance-team-title" data-copy="Comparação da equipe"></h2>'+
  '<p data-copy="Selecione uma pessoa para ver os detalhes."></p></div>'+
  '<label><span data-copy="Comparar por"></span><select id="performance-sort"></select></label></div>'+
  '<table class="performance-table" aria-labelledby="performance-team-title"><thead></thead><tbody></tbody></table>'+
  '</section></div>'+
  '<details class="performance-method"><summary data-copy="Como os números são calculados"></summary>'+
  '<p data-copy="Ligações incluem tentativas. Atendimentos incluem contatos confirmados e reuniões realizadas. Atividades por semana incluem os registros de todos os canais, exceto anotações internas."></p>'+
  '<p data-copy="O valor fechado segue a pessoa responsável pela venda no fechamento. A pontualidade usa os compromissos cujo horário final já passou. Cancelamentos e conclusões sem horário registrado ficam fora do cálculo."></p>'+
  '</details></div>';

 const $=id=>root.querySelector('#'+id);
 const scope=$('performance-scope');
 const peerSelect=$('performance-peer');
 const period=$('performance-period');
 const sort=$('performance-sort');
 const trendMetric=$('performance-trend-metric');
 const retry=$('performance-retry');
 const results=$('performance-results');
 const trend=$('performance-trend-content');
 const table=root.querySelector('.performance-table');
 let order='cents';
 let metric='encounters';
 let selected='all';
 let peer='none';
 let report;
 let previous;
 let peerReport;
 let people=[];
 let sequence=0;
 let status='';

 const english=()=>document.documentElement.lang.startsWith('en');
 const t=label=>english() ? labels[label] ?? label : label;
 const personName=member=>member.id ? member.name : t('Sem responsável');
 const summaryHeading=$('performance-overview-title');
 const admin=()=>getActor()?.role==='admin';

 function render() {
  for (const node of root.querySelectorAll('[data-copy]')) node.textContent=t(node.dataset.copy);
  $('performance-scope-field').hidden=!admin();
  const renderedPeople=people.map(member=>new Option(personName(member)+(member.id && !member.active ? ' · '+t('Conta inativa') : ''),personKey(member)));
  scope.replaceChildren(new Option(t('Equipe'),'all'),...renderedPeople);
  scope.value=[...scope.options].some(option=>option.value===selected) ? selected : 'all';
  $('performance-peer-field').hidden=!admin() || !people.some(member=>member.id===selected);
  peerSelect.replaceChildren(new Option(t('Sem comparação'),'none'),
   ...people.filter(member=>member.id && member.id!==selected).map(member=>new Option(personName(member),member.id)));
  peerSelect.value=[...peerSelect.options].some(option=>option.value===peer) ? peer : 'none';
  $('performance-compare').hidden=people.filter(member=>member.id).length<2;
  $('performance-compare').textContent=t(peer==='none'?'Comparar pessoas':'Encerrar comparação');
  sort.replaceChildren(...keys.map(key=>new Option(t(metricFields[key]),key)));
  sort.value=order;
  trendMetric.replaceChildren(new Option(t('Atividades'),'count'),...keys.map(key=>new Option(t(metricFields[key]),key)));
  trendMetric.value=metric;
  $('performance-status').textContent=t(status);
  retry.hidden=status!=='Não foi possível carregar o desempenho.';
  results.hidden=!report;
  if (!report) return;
  const number=new Intl.NumberFormat(english()?'en-US':'pt-BR');
  const currency=new Intl.NumberFormat(number.resolvedOptions().locale,{style:'currency',currency:'BRL'});
  const percent=new Intl.NumberFormat(number.resolvedOptions().locale,{style:'percent'});
  const chosen=people.find(member=>personKey(member)===selected);
  const compared=people.find(member=>member.id===peer);
  const view=chosen ? personName(chosen) : admin() ? t('Equipe') : getActor()?.name || t('Visão geral');
  const formatted=(item,key)=>{
   const value=metricNumber(item,key);
   if (value===null) return noValue;
   if (key==='on_time') return percent.format(value);
   return key==='cents' ? currency.format(value/100) : number.format(value);
  };
  const deltaFormat = new Intl.NumberFormat(number.resolvedOptions().locale,{signDisplay:'always',maximumFractionDigits:1});
  const moneyDelta = new Intl.NumberFormat(number.resolvedOptions().locale,{signDisplay:'always',style:'currency',currency:'BRL'});
  const totals=Object.fromEntries([...keys,'due'].map(key=>[key,people.reduce((total,person)=>total+Number(person[key]),0)]));
  const dateFormatter=new Intl.DateTimeFormat(number.resolvedOptions().locale,{dateStyle:'medium',timeZone:'UTC'});
  const periodLabel=weeks=>dateFormatter.formatRange(new Date(weeks[0].start),new Date(weeks.at(-1).end));
  summaryHeading.textContent=view;
  $('performance-dates').textContent=periodLabel(report.weeks)+' · '+t('Hoje em andamento');
  $('performance-previous-dates').textContent=t('Período anterior')+' · '+periodLabel(previous.weeks);
  $('performance-summary').replaceChildren(...keys.map(key=>{
   const figure=element('div');
   const control=element('button',t(metricFields[key]),'performance-metric');
   control.type='button';
   control.dataset.metric=key;
   control.setAttribute('aria-pressed',String(metric===key));
   const heading=element('dt');
   heading.append(control);
   figure.append(heading,element('dd',formatted(report,key)));
   if (key==='on_time') figure.append(element('dd',report.due ? number.format(report.on_time)+' / '+number.format(report.due) : t('Sem compromissos avaliáveis'),'performance-qualifier'));
   const current=metricNumber(report,key);
   const baseline=metricNumber(previous,key);
   const change=current===null || baseline===null ? null : current-baseline;
   const delta=element('dd',change===null ? t('Sem base comparável') : change===0 ? t('Sem variação') :
    key==='cents' ? moneyDelta.format(change/100) : key==='on_time' ? deltaFormat.format(change*100)+' p.p.' : deltaFormat.format(change),'performance-delta');
   delta.dataset.direction=change>0 ? 'up' : change<0 ? 'down' : 'neutral';
   delta.setAttribute('aria-label',t('Período anterior')+' · '+formatted(previous,key)+' · '+delta.textContent);
   figure.append(delta,element('dd',t('Período anterior')+' · '+formatted(previous,key),'performance-baseline'));
   if (peerReport && compared) figure.append(element('dd',personName(compared)+' · '+formatted(peerReport,key),'performance-peer-value'));
   else if (admin() && selected!=='all') figure.append(element('dd',t('Equipe')+' · '+formatted(totals,key),'performance-peer-value'));
   return figure;
  }));
  $('performance-comparison').hidden=!admin();
  if (admin()) renderTable(formatted,number);
  $('performance-trend-scope').textContent=metric==='count' ? t('Atividades') : t(metricFields[metric]);
  renderTrend(view,compared,formatted);
 }

 function renderTable(formatted,number) {
  const row=element('tr');
  for (const [key,label] of [['person','Pessoa'],...Object.entries(metricFields)]) {
   const heading=element('th',t(label));
   heading.scope='col';
   heading.dataset.column=key;
   if (key===order) heading.setAttribute('aria-sort','descending');
   row.append(heading);
  }
  table.tHead.replaceChildren(row);
  table.dataset.order=order;
  const sorted=[...people].sort((a,b)=>Number(!a.id)-Number(!b.id) ||
   (metricNumber(b,order)??-1)-(metricNumber(a,order)??-1) || a.name.localeCompare(b.name));
  const max=order==='on_time' ? 1 : Math.max(1,...people.map(member=>metricNumber(member,order)));
  table.tBodies[0].replaceChildren(...sorted.map(member=>{
   const id=personKey(member);
   const row=element('tr');
   row.dataset.selected=String(selected===id);
   const heading=element('th');
   heading.scope='row';
   const button=element('button',personName(member),'performance-person');
   button.type='button';
   button.insertAdjacentHTML('beforeend','<svg aria-hidden="true"><use href="#op-chevron"/></svg>');
   button.setAttribute('aria-pressed',String(selected===id));
   button.setAttribute('aria-label',t('Ver resultados de')+' '+personName(member));
   button.addEventListener('click', async ()=>{
    if (peer===id) peer='none';
    selected=id;
    await refresh();
    if (!results.hidden) summaryHeading.focus();
   });
   heading.append(button);
   if (member.id && !member.active) heading.append(element('span',t('Conta inativa'),'performance-inactive'));
   row.append(heading);
   for (const key of keys) {
    const cell=element('td');
    cell.dataset.column=key;
    cell.append(element('span',formatted(member,key)));
    if (key==='on_time' && member.due) cell.append(element('small',number.format(member.on_time)+' / '+number.format(member.due)));
    if (key===order) cell.append(meter(metricNumber(member,key),max));
    row.append(cell);
   }
   return row;
  }));
 }

 function renderTrend(view,compared,formatted) {
  const weeks=report.weeks;
  const otherWeeks=peerReport?.weeks;
  const providers=[{name:view,weeks}];
  if (otherWeeks && compared) providers.push({name:personName(compared),weeks:otherWeeks});
  const values=providers.flatMap(series=>series.weeks.map(week=>metricNumber(week,metric)));
  if (!values.some(value=>value!==null && (metric==='on_time' || value>0))) {
   trend.replaceChildren(element('p',t('Nenhum valor registrado para este indicador no período.'),'performance-empty'));
   return;
  }
  const max=metric==='on_time' ? 1 : Math.max(1,...values);
  const legend=element('ul',undefined,'performance-legend');
  for (const provider of providers) legend.append(element('li',provider.name));
  const surface=element('div',undefined,'performance-chart-scroll');
  surface.dataset.series=String(providers.length);
  surface.dataset.metric=metric;
  surface.tabIndex=0;
  surface.setAttribute('role','region');
  surface.setAttribute('aria-labelledby','performance-trend-title');
  const list=element('ol',undefined,'performance-chart');
  list.style.setProperty('--weeks',String(weeks.length));
  for (const [index,week] of weeks.entries()) {
   const row=element('li',undefined,'performance-chart-week');
   const range=weekLabel(week.start,week.end,english());
   const columns=element('div',undefined,'performance-chart-values');
   for (const series of providers) {
    const entry=series.weeks[index];
    const value=metricNumber(entry,metric);
    const bar=element('div',undefined,'performance-chart-column');
    bar.style.setProperty('--height',(value===null ? 0 : value/max*100)+'%');
    const description=t(metricFields[metric] || 'Atividades')+' · '+series.name+' · '+range+' · '+formatted(entry,metric);
    const amount=element('span',formatted(entry,metric),'performance-chart-value');
    amount.setAttribute('aria-label',description);
    bar.title=description;
    bar.append(amount,element('i'));
    columns.append(bar);
   }
   row.append(columns,element('span',range,'performance-chart-date'));
   list.append(row);
  }
  surface.append(list);
  trend.replaceChildren(legend,surface);
  surface.scrollLeft=surface.scrollWidth-surface.clientWidth;
  surface.scrollTop=surface.scrollHeight-surface.clientHeight;
 }

 async function refresh() {
  const request=++sequence;
  report=undefined;
  status='Carregando desempenho…';
  render();
  try {
   const load=(member,extra)=>api('performance&'+new URLSearchParams({
    days:period.value,...(admin() && {member}),...extra
   }));
   const [response,prior,comparison]=await Promise.all([
    load(selected,{detail:'1'}),
    load(selected,{previous:'1'}),
    peer==='none' ? null : load(peer,{detail:'1'})
   ]);
   if (request!==sequence) return;
   people=response.members ?? [];
   if (admin() && selected!=='all' && !people.some(person=>personKey(person)===selected)) {
    selected='all';
    return refresh();
   }
   report=response;
   previous=prior;
   peerReport=comparison;
   if (peer!=='none' && !people.some(person=>person.id===peer)) {
    peer='none';
    peerReport=null;
   }
   status='';
  } catch {
   if (request!==sequence) return;
   status='Não foi possível carregar o desempenho.';
  }
  render();
 }

 function reset() {
  sequence++;
  report=undefined;
  previous=undefined;
  peerReport=undefined;
  people=[];
  status='';
  selected='all';
  peer='none';
  order='cents';
  metric='encounters';
  period.value='30';
  $('performance-summary').replaceChildren();
  table.tBodies[0].replaceChildren();
  trend.replaceChildren();
  render();
 }

 function show({memberId,days}={}) {
  if (admin() && memberId) {
   selected=memberId;
   peer='none';
  }
  if (['7','30','90'].includes(String(days))) period.value=String(days);
  return refresh();
 }

 scope.addEventListener('change',()=>{
  selected=scope.value;
  if (!people.some(person=>person.id===selected) || peer===selected) peer='none';
  refresh();
 });
 peerSelect.addEventListener('change',()=>{ peer=peerSelect.value; refresh(); });
 $('performance-compare').addEventListener('click',async ()=>{
  if (peer!=='none') {
   peer='none';
   return refresh();
  }
  const candidates=people.filter(person=>person.id);
  selected=candidates.find(person=>person.id===selected)?.id ?? candidates[0].id;
  peer=candidates.find(person=>person.id!==selected).id;
  await refresh();
  if (!results.hidden) peerSelect.focus();
 });
 trendMetric.addEventListener('change',()=>{ metric=trendMetric.value; render(); });
 $('performance-summary').addEventListener('click',event=>{
  const button=event.target.closest('[data-metric]');
  if (!button) return;
  metric=button.dataset.metric;
  render();
  root.querySelector('[data-metric="'+metric+'"]').focus();
 });
 period.addEventListener('change',refresh);
 sort.addEventListener('change',()=>{ order=sort.value; render(); });
 retry.addEventListener('click',refresh);
 document.addEventListener('caos-language-change',render);
 render();
 return {show,reset};
}
