const copy = {
 'Desempenho':'Performance',
 'Operação local':'Local workspace',
 'Período do desempenho':'Performance period',
 'Últimos 7 dias':'Last 7 days',
 'Últimos 30 dias':'Last 30 days',
 'Últimos 90 dias':'Last 90 days',
 'Ligações':'Calls',
 'Atendimentos':'Conversations',
 'Vendas':'Sales',
 'No prazo':'On time',
 'Valor fechado':'Won value',
 'Atividades por semana':'Weekly activity',
 'Por responsável':'By owner',
 'Responsável':'Owner',
 'Como os números são calculados':'How the numbers are calculated',
 'Ligações contam tentativas registradas. Atendimentos contam contatos confirmados e reuniões realizadas. O gráfico reúne todas as atividades registradas, exceto notas internas.':'Calls include logged attempts. Conversations include confirmed contacts and completed meetings. The chart includes all logged activities except internal notes.',
 'No prazo considera compromissos com horário final já vencido, exceto cancelados ou concluídos sem horário de registro. A conclusão conta como pontual quando registrada até o prazo.':'On time covers appointments whose scheduled end has passed, excluding canceled appointments and completions without a timestamp. Completion counts as on time when logged by the scheduled end.',
 'Carregando desempenho…':'Loading performance…',
 'Não foi possível carregar o desempenho.':'Could not load performance.',
 'Tentar novamente':'Try again',
};
const months = {
 pt:['jan.','fev.','mar.','abr.','mai.','jun.','jul.','ago.','set.','out.','nov.','dez.'],
 en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
};
const labels = ['Ligações','Atendimentos','Vendas','No prazo','Valor fechado'];

function weekLabel(start, end, english) {
 const [, startMonth, startDay] = start.split('-').map(Number);
 const [, endMonth, endDay] = end.split('-').map(Number);
 const month = english ? months.en : months.pt;
 const a = english ? month[startMonth - 1] + ' ' + startDay : startDay + ' ' + month[startMonth - 1];
 const b = english ? month[endMonth - 1] + ' ' + endDay : endDay + ' ' + month[endMonth - 1];
 if (start === end) return a;
 if (startMonth !== endMonth) return a + ' – ' + b;
 return english ? a + '–' + endDay : startDay + '–' + b;
}

export function initTodayPerformance(api) {
 const root = document.getElementById('today-performance');
 let report = null;
 let pending = false;
 let failed = false;
 let serial = 0;

 root.setAttribute('aria-labelledby','today-performance-title');
 root.innerHTML = [
  '<div class="operations-section-heading today-performance-heading">',
  '<h2 id="today-performance-title"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="13" width="4" height="8" rx=".7"/><rect x="10" y="8" width="4" height="13" rx=".7"/><rect x="17.5" y="3" width="4" height="18" rx=".7"/></svg><span data-performance-copy="Desempenho"></span></h2>',
  '<div class="today-performance-tools"><span class="today-performance-scope" data-performance-copy="Operação local"></span>',
  '<select id="today-performance-period"><option value="7" data-performance-copy="Últimos 7 dias"></option><option value="30" data-performance-copy="Últimos 30 dias" selected></option><option value="90" data-performance-copy="Últimos 90 dias"></option></select></div>',
  '</div>',
  '<div class="today-performance-feedback"><p id="today-performance-status" role="status"></p><button type="button" class="quiet" id="today-performance-retry" data-performance-copy="Tentar novamente" hidden></button></div>',
  '<div class="today-performance-results"><dl class="today-performance-metrics"></dl>',
  '<div class="today-performance-breakdown"><figure class="today-performance-figure">',
  '<figcaption id="today-performance-chart-title" data-performance-copy="Atividades por semana"></figcaption>',
  '<div class="today-performance-chart-scroll"><div class="today-performance-chart"><ol class="today-performance-scale" aria-hidden="true"></ol><ol class="today-performance-bars" aria-labelledby="today-performance-chart-title"></ol></div></div>',
  '</figure><section class="today-performance-owner" aria-labelledby="today-performance-owner-title">',
  '<h3 id="today-performance-owner-title" data-performance-copy="Por responsável"></h3>',
  '<table><thead><tr><th scope="col" data-performance-copy="Responsável"></th><th scope="col" data-performance-copy="Atendimentos"></th><th scope="col" data-performance-copy="Vendas"></th></tr></thead>',
  '<tbody><tr><th scope="row" data-performance-copy="Operação local"></th><td class="today-performance-owner-encounters"></td><td class="today-performance-owner-won"></td></tr></tbody></table>',
  '</section></div>',
  '<details class="today-performance-help"><summary data-performance-copy="Como os números são calculados"></summary>',
  '<p data-performance-copy="Ligações contam tentativas registradas. Atendimentos contam contatos confirmados e reuniões realizadas. O gráfico reúne todas as atividades registradas, exceto notas internas."></p>',
  '<p data-performance-copy="No prazo considera compromissos com horário final já vencido, exceto cancelados ou concluídos sem horário de registro. A conclusão conta como pontual quando registrada até o prazo."></p>',
  '</details></div>'
 ].join('');
 root.dataset.noTranslate = '';

 const select = root.querySelector('select');
 const results = root.querySelector('.today-performance-results');
 const metrics = root.querySelector('.today-performance-metrics');
 const bars = root.querySelector('.today-performance-bars');
 const scale = root.querySelector('.today-performance-scale');
 const scroll = root.querySelector('.today-performance-chart-scroll');
 const status = root.querySelector('#today-performance-status');
 const retry = root.querySelector('#today-performance-retry');

 function node(tag, text, css) {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (css) item.className = css;
  return item;
 }

 function render() {
  const english = document.documentElement.lang.startsWith('en');
  const t = label => english ? copy[label] ?? label : label;
  const locale = english ? 'en-US' : 'pt-BR';
  const number = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, {style:'percent'});
  const currency = new Intl.NumberFormat(locale, {style:'currency', currency:'BRL', maximumFractionDigits:2});
  root.querySelectorAll('[data-performance-copy]').forEach(item => {
   item.textContent = t(item.dataset.performanceCopy);
  });
  select.setAttribute('aria-label', t('Período do desempenho'));
  status.textContent = pending ? t('Carregando desempenho…') : failed ? t('Não foi possível carregar o desempenho.') : '';
  results.hidden = failed;
  results.setAttribute('aria-busy', String(pending));
  retry.hidden = !failed;
  const values = report ? [
   number.format(report.calls), number.format(report.encounters), number.format(report.won),
   report.due ? percent.format(report.on_time / report.due) : '—',
   currency.format(Number(report.cents) / 100)
  ] : labels.map(() => '—');
  metrics.replaceChildren(...labels.map((label, index) => {
   const figure = node('div');
   figure.append(node('dt', t(label)), node('dd', values[index]));
   return figure;
  }));
  root.querySelector('.today-performance-owner-encounters').textContent = values[1];
  root.querySelector('.today-performance-owner-won').textContent = values[2];
  const weeks = report?.weeks ?? [];
  const max = Math.max(4, Math.ceil(Math.max(0, ...weeks.map(week => week.count)) / 4) * 4);
  scale.replaceChildren(...[1, .75, .5, .25, 0].map(factor => node('li', number.format(max * factor))));
  bars.style.setProperty('--performance-weeks', String(Math.max(1, weeks.length)));
  scroll.tabIndex = weeks.length > 5 ? 0 : -1;
  bars.replaceChildren(...weeks.map(week => {
   const item = node('li');
   const label = weekLabel(week.start, week.end, english);
   const column = node('div', undefined, 'today-performance-column');
   column.style.setProperty('--performance-height', (week.count / max * 100) + '%');
   column.dataset.empty = String(!week.count);
   column.append(node('span', number.format(week.count), 'today-performance-bar-value'));
   item.append(column, node('span', label, 'today-performance-week'));
   return item;
  }));
 }

 async function refresh() {
  const request = ++serial;
  report = null;
  pending = true;
  failed = false;
  render();
  try {
   const result = await api('performance&days=' + select.value);
   if (request !== serial) return;
   report = result;
  } catch {
   if (request !== serial) return;
   failed = true;
  } finally {
   if (request === serial) {
    pending = false;
    render();
   }
  }
 }

 function reset() {
  serial++;
  report = null;
  pending = false;
  failed = false;
  select.value = '30';
  render();
 }

 select.addEventListener('change', refresh);
 retry.addEventListener('click', refresh);
 document.addEventListener('caos-language-change',render);
 render();
 return {refresh, reset};
}
