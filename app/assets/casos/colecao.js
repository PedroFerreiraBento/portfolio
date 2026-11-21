const demo = document.body.dataset.showcase;
const form = document.querySelector('form');
const feedback = document.querySelector('[role=status]');
const output = document.querySelector('.output');
const download = document.querySelector('#download');
let blobUrl;

function showResult(title, lines, file, content, type = 'text/plain;charset=utf-8') {
 const list = output.querySelector('ul');
 const items = lines.map(line => {
  const item = document.createElement('li');
  item.textContent = line;
  return item;
 });
 list.replaceChildren(...items);
 if (blobUrl) URL.revokeObjectURL(blobUrl);
 blobUrl = URL.createObjectURL(new Blob([content], {type}));
 download.href = blobUrl;
 download.download = file;
 output.hidden = false;
 feedback.textContent = title;
}

form.addEventListener('input', () => {
 output.hidden = true;
 feedback.textContent = '';
});

if (demo === 'catalogo') {
 const names = {'PV-103':'Pendente Vale','AS-207':'Abajur Serra','AP-311':'Arandela Pinha'};
 form.addEventListener('submit', event => {
  event.preventDefault();
  const selected = [...new FormData(form)].filter(([, amount]) => Number(amount) > 0);
  if (!selected.length) {
   feedback.textContent = 'Adicione pelo menos uma peça para montar a cotação.';
   return;
  }
  const lines = selected.map(([sku, amount]) => amount + ' × ' + names[sku] + ' (' + sku + ')');
  showResult('Cotação pronta para compartilhar.', lines, 'lista-de-cotacao.txt', ['Lista de cotação · Demonstração', ...lines].join('\r\n'));
 });
}

if (demo === 'vistoria') {
 form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const notes = data.get('Observações').trim();
  data.delete('Observações');
  const items = [...data];
  const pending = items.filter(([, result]) => result === 'Requer ajuste').length;
  if (pending && !notes) {
   feedback.textContent = 'Descreva os ajustes encontrados nas observações.';
   form.elements['Observações'].focus();
   return;
  }
  const heading = pending === 1 ? 'Vistoria concluída com 1 pendência.' : pending ? 'Vistoria concluída com ' + pending + ' pendências.' : 'Vistoria concluída sem pendências.';
  const lines = items.map(([label, result]) => label + ': ' + result);
  if (notes) lines.push('Observações: ' + notes);
  showResult(heading, lines, 'relatorio-de-vistoria.txt', [heading, ...lines].join('\r\n'));
 });
}

if (demo === 'agenda') {
 const dateSelect = form.elements.date;
 const dateLabel = new Intl.DateTimeFormat('pt-BR', {dateStyle:'full'});
 const nextDays = [];
 const day = new Date();
 while (nextDays.length < 3) {
  day.setDate(day.getDate() + 1);
  if (day.getDay() > 0 && day.getDay() < 6) nextDays.push(new Date(day));
 }
 dateSelect.replaceChildren(...nextDays.map((date, index) => new Option(dateLabel.format(date), String(index))));
 const calendarTime = value => value.toISOString().replace(/[-:]|\.\d{3}/g, '');
 form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const start = new Date(nextDays[Number(data.get('date'))]);
  const [hour, minute] = data.get('time').split(':').map(Number);
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + 30 * 60000);
  const calendar = [
   'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Pedro//Agenda demonstrativa//PT','BEGIN:VEVENT',
   'UID:agenda-demo-' + start.getTime() + '@example.com',
   'DTSTAMP:' + calendarTime(new Date()),
   'DTSTART:' + calendarTime(start),'DTEND:' + calendarTime(end),
   'SUMMARY:Conversa de projeto (demonstração)','END:VEVENT','END:VCALENDAR',''
  ].join('\r\n');
  showResult('Horário confirmado na demonstração.', [dateLabel.format(start) + ' às ' + data.get('time'), 'Duração de 30 minutos.'], 'atendimento.ics', calendar, 'text/calendar;charset=utf-8');
 });
}
