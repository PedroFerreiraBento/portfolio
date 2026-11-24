
const form = document.querySelector('form[data-flow]');

if (form) {
  const mode = form.dataset.flow;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-status]');
  const error = form.querySelector('[data-error]');
  const slots = form.querySelector('[data-slots]');
  const slotHours = {
    'Terça-feira': ['08h30', '10h00', '15h30'],
    'Quinta-feira': ['09h00', '16h00'],
    'Sábado': ['08h00', '10h30'],
  };

  function renderSlots() {
    const day = form.elements.dia.value;
    slots.replaceChildren(...slotHours[day].map(hour => {
      const label = document.createElement('label');
      const option = document.createElement('input');
      const text = document.createElement('span');
      option.type = 'radio';
      option.name = 'horario';
      option.value = hour;
      option.required = true;
      text.textContent = hour;
      label.append(option, text);
      return label;
    }));
  }

  function renderTicket() {
    const services = new FormData(form).getAll('servico');
    const tally = form.querySelector('[data-tally]');
    const items = form.querySelector('[data-items]');
    tally.textContent = services.length ? services.length + (services.length === 1 ? ' serviço selecionado' : ' serviços selecionados') : 'Nenhum serviço escolhido';
    items.replaceChildren(...services.map(service => {
      const item = document.createElement('li');
      item.textContent = service;
      return item;
    }));
    items.hidden = !services.length;
    error.textContent = '';
  }

  function readRows() {
    const data = new FormData(form);
    if (mode === 'bancada') return data.getAll('servico').map((service, index) => ['Serviço ' + (index + 1), service]);
    const labels = mode === 'diario'
      ? [['Uso', 'uso'], ['Sinal percebido', 'sinal'], ['Quando acontece', 'momento']]
      : [['Dia escolhido', 'dia'], ['Horário fictício', 'horario'], ['Motivo', 'motivo']];
    return labels.map(([label, field]) => [label, data.get(field)]);
  }

  function showFields() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    const first = fields.querySelector('input:checked') || fields.querySelector('input');
    first.focus();
  }

  form.addEventListener('change', event => {
    if (mode === 'bancada') renderTicket();
    if (event.target.name === 'dia') renderSlots();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const rows = readRows();
    if (!rows.length) {
      error.textContent = 'Escolha pelo menos um serviço para montar a lista.';
      return;
    }
    summary.replaceChildren(...rows.map(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      row.append(term, detail);
      return row;
    }));
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  form.querySelector('[data-edit]').addEventListener('click', showFields);
  form.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    if (mode === 'encaixe') renderSlots();
    if (mode === 'bancada') renderTicket();
    showFields();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const lines = readRows().map(([label, value]) => label + ': ' + value);
    try {
      await navigator.clipboard.writeText(['Oficina Contrapedal · CP-DEMO-001', ...lines].join('\n'));
      status.textContent = 'Resumo copiado.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      status.textContent = 'Selecione o comando Copiar do seu dispositivo.';
    }
  });

  if (mode === 'encaixe') renderSlots();
}
