const form = document.querySelector('[data-flow]');

if (form) {
  const mode = form.dataset.flow;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-status]');
  const error = form.querySelector('[data-error]');
  const pointLabels = { mesas: 'Mesas de convidados', recepcao: 'Recepção', destaque: 'Mesa principal' };
  const palettes = {
    'Vinho e rosa': ['vinho.webp', 'Flores em vinho e rosa sobre uma superfície ameixa'],
    'Sol e creme': ['creme.webp', 'Flores douradas e creme em vaso fosco'],
  };
  const scaleNotes = {
    Compacto: 'Para um aparador pequeno ou uma mesa lateral.',
    Médio: 'Para um aparador ou uma mesa de jantar.',
    Amplo: 'Para um ponto de destaque com espaço ao redor.',
  };

  function countPoints() {
    const inputs = Object.keys(pointLabels).map((key) => form.elements[key]);
    return inputs.every((input) => input.validity.valid)
      ? inputs.reduce((total, input) => total + input.valueAsNumber, 0)
      : null;
  }

  function quantity(count) {
    return count + (count === 1 ? ' arranjo' : ' arranjos');
  }

  function refresh() {
    const data = new FormData(form);
    if (mode === 'gesto') {
      const intent = data.get('intencao');
      for (const product of form.querySelectorAll('[data-intents]')) {
        const input = product.querySelector('input');
        product.hidden = intent !== 'todas' && !product.dataset.intents.split(' ').includes(intent);
        input.disabled = product.hidden;
        if (product.hidden) input.checked = false;
      }
      form.querySelector('[data-picked]').textContent =
        form.elements.buque.value || 'Nenhum buquê escolhido';
    } else if (mode === 'arranjo') {
      const palette = data.get('paleta');
      const picture = form.querySelector('[data-palette-image]');
      const [source, alt] = palettes[palette];
      if (picture.getAttribute('src') !== source) {
        picture.src = source;
        picture.alt = alt;
      }
      form.querySelector('[data-palette-caption]').textContent = palette + ' · referência de paleta';
      form.querySelector('[data-scale]').textContent = scaleNotes[data.get('escala')];
    } else {
      const count = countPoints();
      form.querySelector('[data-count]').textContent =
        count === null ? 'Confira as quantidades' : quantity(count);
      error.textContent = '';
    }
  }

  function readRows() {
    const data = new FormData(form);
    if (mode === 'gesto') {
      const intent = form.querySelector('[name=intencao]:checked').nextElementSibling.textContent;
      return [
        ['Gesto', intent === 'Todos' ? 'Livre' : intent],
        ['Buquê', data.get('buque')],
      ];
    }
    if (mode === 'arranjo')
      return [
        ['Paleta', data.get('paleta')],
        ['Escala', data.get('escala')],
        ['Apresentação', data.get('base')],
      ];
    return [
      ...Object.entries(pointLabels).map(([key, label]) => [label, data.get(key)]),
      ['Paleta', data.get('cores')],
      ['Total', quantity(countPoints())],
    ];
  }

  function edit() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    (fields.querySelector('input:checked') || fields.querySelector('input')).focus();
  }

  form.addEventListener('input', refresh);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (mode === 'evento' && countPoints() === 0) {
      error.textContent = 'Informe pelo menos um ponto que receberá flores.';
      form.elements.mesas.focus();
      return;
    }
    summary.replaceChildren(
      ...readRows().map(([key, value]) => {
        const row = document.createElement('div');
        const label = document.createElement('dt');
        const detail = document.createElement('dd');
        label.textContent = key;
        detail.textContent = value;
        row.append(label, detail);
        return row;
      }),
    );
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });
  form.querySelector('[data-edit]').addEventListener('click', edit);
  form.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    refresh();
    edit();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const text = [
      'Botânica das Horas · BH-DEMO-001',
      ...readRows().map(([key, value]) => key + ': ' + value),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Resumo copiado.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Use o comando Copiar do seu dispositivo.';
    }
  });
  refresh();
}
