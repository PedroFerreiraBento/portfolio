const form = document.querySelector('[data-booking]');
const fields = form.querySelector('[data-fields]');
const schedule = form.querySelector('[data-slots]');
const receipt = form.querySelector('[data-receipt]');
const summary = form.querySelector('[data-summary]');
const error = form.querySelector('[data-error]');
const copyStatus = form.querySelector('[data-copy-status]');
const layout = form.dataset.layout;
const activeExperience = () => form.querySelector('[name="experiencia"]:checked');
let days = [];
let activeDay = 0;

function create(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  return element;
}

function makeTimes(day) {
  const row = create('div', 'time-grid');
  for (const time of day.times) {
    const label = create('label', 'time');
    const option = create('input');
    option.type = 'radio';
    option.name = 'horario';
    option.value = time;
    option.dataset.day = day.name;
    option.setAttribute('aria-label', day.name + ' às ' + time);
    label.append(option, create('span', '', time));
    row.append(label);
  }
  return row;
}

function calendarForDay() {
  const tabs = create('div', 'day-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'Dia da visita');
  const times = create('div');
  times.id = 'opcoes-dia';
  days.forEach((day, index) => {
    const tab = create('button', '', day.name);
    tab.type = 'button';
    tab.setAttribute('aria-controls', times.id);
    tab.setAttribute('aria-pressed', String(index === activeDay));
    tab.addEventListener('click', () => {
      if (index === activeDay) return;
      activeDay = index;
      [...tabs.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      times.replaceChildren(makeTimes(day));
      error.textContent = '';
    });
    tabs.append(tab);
  });
  times.replaceChildren(makeTimes(days[activeDay]));
  schedule.replaceChildren(tabs, times);
}

function calendarForWeek() {
  const matrix = create('div', 'slot-matrix');
  for (const day of days) {
    const column = create('section');
    column.setAttribute('aria-label', day.name);
    column.append(create('strong', '', day.name), makeTimes(day));
    matrix.append(column);
  }
  schedule.replaceChildren(matrix);
}

function resetCalendar() {
  activeDay = 0;
  days = activeExperience().dataset.window.split(';').map(value => {
    const [name, times] = value.split('|');
    return { name, times: times.split(',') };
  });
  if (layout === 'matrix') calendarForWeek();
  else calendarForDay();
  error.textContent = '';
}

form.addEventListener('change', event => {
  if (event.target.name === 'experiencia') resetCalendar();
  if (event.target.name === 'horario') error.textContent = '';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const time = form.querySelector('[name="horario"]:checked');
  if (!time) {
    error.textContent = 'Escolha um dia e um horário para revisar.';
    schedule.querySelector('input').focus();
    return;
  }

  const rows = [
    ['Referência', form.dataset.reference],
    ['Experiência', activeExperience().value],
    ['Dia fictício', time.dataset.day],
    ['Horário fictício', time.value],
  ];
  summary.replaceChildren(...rows.map(([term, detail]) => {
    const row = create('div');
    row.append(create('dt', '', term), create('dd', '', detail));
    return row;
  }));
  fields.hidden = true;
  receipt.hidden = false;
  receipt.querySelector('h2').focus();
});

function showFields() {
  receipt.hidden = true;
  fields.hidden = false;
  copyStatus.textContent = '';
  activeExperience().focus();
}

form.querySelector('[data-edit]').addEventListener('click', showFields);
form.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  resetCalendar();
  showFields();
});
form.querySelector('[data-copy]').addEventListener('click', async () => {
  const lines = [...summary.children].map(row => row.firstChild.textContent + ': ' + row.lastChild.textContent);
  const message = [form.dataset.brand + ' · Agendamento de exemplo', ...lines].join('\n');
  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = 'Ficha copiada.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(summary);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Use a opção Copiar do seu dispositivo.';
  }
});

resetCalendar();
