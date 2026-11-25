const form = document.querySelector('[data-booking]');
const fields = form.querySelector('[data-fields]');
const preview = form.querySelector('[data-preview]');
const summary = form.querySelector('[data-summary]');
const feedback = form.querySelector('[data-form-status]');
const copyStatus = form.querySelector('[data-copy-status]');
const slots = form.querySelector('[data-hours]');
const availability = form.querySelector('[data-availability]');
const dayNames = ['Terça-feira', 'Quinta-feira', 'Sábado'];
const branch = document.body.dataset.campaignDemo;
const offset = Number(form.dataset.variant);
const timeSets = {
  retrato: [['09h', '10h30', '14h'], ['11h', '14h30', '16h'], ['09h30', '12h', '15h30']],
  imagem: [['09h', '12h', '17h'], ['10h30', '13h', '18h'], ['09h30', '11h', '15h']],
  quadras: [['08h', '16h', '19h'], ['09h', '17h30', '20h'], ['08h30', '15h', '18h']],
};
const sceneSets = {
  retrato: [['cena-1.webp', 'Janela difusa · estúdio claro'], ['cena-2.webp', 'Fundo escuro · luz de recorte'], ['cena-0.webp', 'Azul mineral · retrato colorido']],
  imagem: [['cena-1.webp', 'Essenciais · peças que combinam entre si'], ['cena-2.webp', 'Contraste · cor em primeiro plano'], ['cena-3.webp', 'Ocasião · tecidos e acessórios']],
};
const mode = form.dataset.flow;
const requiresDuration = Boolean(form.querySelector('[name=duracao]'));
const summaryLabels = [[form.dataset.label, 'servico'], ['Duração', 'duracao'], [form.dataset.extraLabel, 'extra'], ['Dia de exemplo', 'dia'], ['Horário fictício', 'horario']];
const sceneImage = document.querySelector('.diptych-hero figure img');
const initialScene = sceneImage && [sceneImage.getAttribute('src'), sceneImage.alt];
let lastFocus;
let reviewedRows = [];

function ready(value) {
  const selected = form.querySelector('[name=servico]:checked');
  const day = form.querySelector('[name=dia]:checked');
  const duration = form.querySelector('[name=duracao]:checked');
  if (value === 'scene' && selected && mode === 'diptych') {
    const options = sceneSets[branch];
    const [src, caption] = options[Number(selected.dataset.option)];
    sceneImage.src = src;
    sceneImage.alt = caption;
    document.querySelector('[data-scene-caption]').textContent = caption;
  }
  slots.replaceChildren();
  feedback.textContent = '';
  if (!selected || !day || (requiresDuration && !duration)) {
    availability.textContent = 'Faça as escolhas acima para ver os horários disponíveis.';
    return;
  }

  const variant = Number(selected.dataset.option);
  const dayIndex = Number(day.value);
  const formatShift = branch === 'imagem' && form.querySelector('[name=extra]:checked')?.value === 'No estúdio' ? 1 : 0;
  const shift = (variant + offset + dayIndex + formatShift) % 3;
  const times = timeSets[branch][shift].slice(0, duration?.value === '120 min' ? 2 : 3);
  availability.textContent = dayNames[dayIndex] + ' · ' + times.length + ' opções de exemplo';
  slots.replaceChildren(...times.map(time => {
    const option = document.createElement('label');
    option.className = 'choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'horario';
    input.value = time;
    input.required = true;
    const text = document.createElement('span');
    text.textContent = time;
    option.append(input, text);
    return option;
  }));
}

function edit(reset = false) {
  preview.hidden = true;
  fields.hidden = false;
  copyStatus.textContent = '';
  if (reset) {
    form.reset();
    if (sceneImage) {
      [sceneImage.src, sceneImage.alt] = initialScene;
      document.querySelector('[data-scene-caption]').textContent = 'Referência de atendimento';
    }
    slots.replaceChildren();
    ready();
  }
  (reset ? fields.querySelector('input') : lastFocus || fields.querySelector('input')).focus();
}

form.addEventListener('change', event => {
  const field = event.target.name;
  if (field === 'horario' || (field === 'extra' && branch !== 'imagem')) return;
  ready(field === 'servico' ? 'scene' : '');
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(form);
  if (!values.get('horario')) {
    feedback.textContent = 'Selecione um horário de exemplo para revisar a visita.';
    return;
  }
  lastFocus = form.querySelector('[name=horario]:checked');
  reviewedRows = summaryLabels.flatMap(([label, key]) => {
    const value = values.get(key);
    return value ? [[label, key === 'dia' ? dayNames[Number(value)] : value]] : [];
  });
  summary.replaceChildren(...reviewedRows.map(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    row.append(term, detail);
    return row;
  }));
  fields.hidden = true;
  preview.hidden = false;
  preview.focus();
});

form.querySelector('[data-edit]').addEventListener('click', () => edit());
form.querySelector('[data-reset]').addEventListener('click', () => edit(true));
form.querySelector('[data-copy]').addEventListener('click', async () => {
  const text = [form.dataset.brand + ' · Horário de exemplo', ...reviewedRows.map(([label, value]) => label + ': ' + value), 'Simulação local. Nenhuma reserva registrada.'].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Resumo copiado.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(summary);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Selecione a opção Copiar do seu dispositivo.';
  }
});
ready();
