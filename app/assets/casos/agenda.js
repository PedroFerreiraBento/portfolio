(() => {
 const find = selector => document.querySelector(selector);
 const form = find('#schedule-form');
 const dates = form.querySelector('.day-row');
 const times = [...form.querySelectorAll('[name=time]')];
 const previous = find('#agenda-previous');
 const next = find('#agenda-next');
 const confirm = form.querySelector('[type=submit]');
 const cancel = find('#agenda-cancel');
 const picker = find('#agenda-picker');
 const confirmation = find('#agenda-confirmation');
 const download = find('#download');
 const zone = 'America/Sao_Paulo';
 const dateLabel = new Intl.DateTimeFormat('pt-BR', { dateStyle:'full', timeZone:'UTC' });
 const weekdayLabel = new Intl.DateTimeFormat('pt-BR', { weekday:'short', timeZone:'UTC' });
 const rangeLabel = new Intl.DateTimeFormat('pt-BR', { day:'numeric', month:'long', timeZone:'UTC' });
 const todayInBrasilia = new Intl.DateTimeFormat('en', { year:'numeric', month:'numeric', day:'numeric', timeZone:zone });
 const offsetFormat = new Intl.DateTimeFormat('en', { timeZone:zone, timeZoneName:'longOffset' });
 const batchSize = 5;
 const availability = [
  ['10:00','14:00','15:30'],
  ['11:00','14:00'],
  [],
  ['10:00','11:00','14:00'],
  ['11:00','15:30']
 ];
 const schedule = [];
 const today = Object.fromEntries(todayInBrasilia.formatToParts(new Date()).map(({type,value}) => [type, Number(value)]));
 const cursor = new Date(Date.UTC(today.year, today.month - 1, today.day));
 while (schedule.length < batchSize * 3) {
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  if (cursor.getUTCDay() === 0 || cursor.getUTCDay() === 6) continue;
  schedule.push({ date:new Date(cursor), times:availability[schedule.length % availability.length] });
 }

 let page = 0;
 let day = 0;
 let booking = null;
 let sequence = 0;
 const uid = (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2)) + '@caosdomado.demo';

 function renderDays() {
  const start = page * batchSize;
  const batch = schedule.slice(start, start + batchSize);
  find('#agenda-range').textContent = rangeLabel.formatRange(batch[0].date, batch[batch.length - 1].date);
  dates.replaceChildren(...batch.map((entry, position) => {
   const index = start + position;
   const label = document.createElement('label');
   const radio = document.createElement('input');
   const card = document.createElement('span');
   const weekday = document.createElement('small');
   const dateNumber = document.createElement('strong');
   radio.type = 'radio';
   radio.name = 'date';
   radio.value = String(index);
   radio.checked = index === day;
   radio.setAttribute('aria-label', dateLabel.format(entry.date) + (entry.times.length ? '' : ', sem horários livres'));
   label.dataset.available = String(Boolean(entry.times.length));
   weekday.textContent = weekdayLabel.format(entry.date).replace('.', '');
   dateNumber.textContent = entry.date.getUTCDate();
   card.append(weekday, dateNumber);
   if (!entry.times.length) {
    const soldOut = document.createElement('small');
    soldOut.className = 'agenda-day-state';
    soldOut.textContent = 'Lotado';
    card.append(soldOut);
   }
   label.append(radio, card);
   return label;
  }));
  previous.disabled = page === 0;
  next.disabled = start + batchSize >= schedule.length;
 }

 function renderTimes(time = '') {
  const available = schedule[day].times;
  for (const control of times) {
   control.disabled = !available.includes(control.value);
   control.checked = !control.disabled && control.value === time;
   control.parentElement.querySelector('small').textContent = control.disabled ? 'Ocupado' : 'Livre';
  }
  find('.time-row').hidden = !available.length;
  find('#agenda-unavailable').hidden = Boolean(available.length);
  const selected = form.elements.time.value;
  const unchanged = booking?.day === day && booking?.time === selected;
  confirm.disabled = !selected || unchanged;
  find('#agenda-summary').textContent = unchanged ? 'Este é o seu horário atual.'
   : selected ? dateLabel.format(schedule[day].date) + ', às ' + selected + ' · 30 minutos'
   : 'Selecione um horário para continuar.';
 }

 function movePage(direction, button) {
  const destination = page + direction;
  if (destination < 0 || destination * batchSize >= schedule.length) return;
  page = destination;
  day = page * batchSize;
  renderDays();
  renderTimes();
  if (button.disabled) dates.querySelector(':checked').focus();
 }

 function toInstant(date, time) {
  const [hours,minutes] = time.split(':').map(Number);
  const localClock = date.getTime() + (hours * 60 + minutes) * 60000;
  const offset = offsetFormat.formatToParts(new Date(localClock)).find(part => part.type === 'timeZoneName').value;
  const parts = /^GMT([+-])(\d{2}):(\d{2})$/.exec(offset);
  const offsetMinutes = parts ? (parts[1] === '-' ? -1 : 1) * (Number(parts[2]) * 60 + Number(parts[3])) : 0;
  return new Date(localClock - offsetMinutes * 60000);
 }

 const icsTime = date => date.toISOString().replace(/[-:]|\.\d{3}/g, '');

 function updateInvite() {
  if (download.hasAttribute('href')) URL.revokeObjectURL(download.href);
  const start = toInstant(schedule[booking.day].date, booking.time);
  const end = new Date(start.getTime() + 30 * 60000);
  const lines = [
   'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Caos Domado//Agenda demonstrativa//PT',
   'CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:' + uid,'SEQUENCE:' + sequence,
   'DTSTAMP:' + icsTime(new Date()),'DTSTART:' + icsTime(start),'DTEND:' + icsTime(end),
   'SUMMARY:Conversa de projeto (demonstração)',
   'DESCRIPTION:Horário de exemplo do portfólio Caos Domado.',
   'END:VEVENT','END:VCALENDAR',''
  ];
  download.href = URL.createObjectURL(new Blob([lines.join('\r\n')], {type:'text/calendar;charset=utf-8'}));
  download.download = 'conversa-de-projeto.ics';
 }

 function showBooking() {
  find('#agenda-confirmed-date').textContent = dateLabel.format(schedule[booking.day].date);
  find('#agenda-confirmed-time').textContent = booking.time + ' · horário de Brasília';
  picker.hidden = true;
  confirmation.hidden = false;
  find('#agenda-confirmed-title').focus();
 }

 previous.addEventListener('click', () => movePage(-1, previous));
 next.addEventListener('click', () => movePage(1, next));
 form.addEventListener('change', event => {
  if (event.target.name === 'date') {
   day = Number(event.target.value);
   renderTimes();
  } else {
   renderTimes(event.target.value);
  }
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  const time = form.elements.time.value;
  if (confirm.disabled || !schedule[day].times.includes(time)) return;
  if (booking) sequence += 1;
  booking = { day, time };
  updateInvite();
  showBooking();
 });
 find('#agenda-edit').addEventListener('click', () => {
  day = booking.day;
  page = Math.floor(day / batchSize);
  confirmation.hidden = true;
  picker.hidden = false;
  cancel.hidden = false;
  confirm.textContent = 'Confirmar novo horário';
  renderDays();
  renderTimes(booking.time);
  find('#booking-title').focus();
 });
 cancel.addEventListener('click', showBooking);
 renderDays();
 renderTimes();
})();

