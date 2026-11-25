const form = document.querySelector('[data-flow]');

if (form) {
  const mode = form.dataset.flow;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-status]');
  const error = form.querySelector('[data-error]');
  const flavors = [...form.querySelectorAll('[data-flavor]')];
  const formats = ['Brigadeiros', 'Trufas', 'Bombons'];
  const fillings = {
    Baunilha: ['Baunilha e amora', 'Doce de leite'],
    Chocolate: ['Ganache de cacau', 'Doce de leite'],
  };
  const finishes = {
    'Creme rosa': ['bolo-rosa.webp', 'Bolo redondo coberto com creme rosa'],
    'Creme marfim': [
      'bolo-marfim.webp',
      'Bolo redondo marfim com acabamento em bico',
    ],
  };
  const value = (input) => (input.validity.valid ? input.valueAsNumber : 0);
  const capacity = () => Number(form.elements.capacidade.value);
  const packed = () =>
    flavors.reduce((total, input) => total + value(input), 0);
  const desired = () =>
    value(form.elements.convidados) * value(form.elements.porcao);
  const assigned = () =>
    formats.reduce(
      (total, label, index) => total + value(form.elements['lote-' + index]),
      0,
    );
  const count = (n, singular, plural) =>
    n + ' ' + (n === 1 ? singular : plural);

  function updateBox() {
    const total = packed();
    const limit = capacity();
    form.querySelector('[data-tally]').textContent =
      total + ' de ' + limit + ' doces';
    for (const input of flavors) {
      const counter = input.closest('.counter');
      counter.querySelector('[data-delta="1"]').disabled = total >= limit;
      counter.querySelector('[data-delta="-1"]').disabled = value(input) <= 0;
    }
    const cells = flavors.flatMap((input, index) =>
      Array.from({ length: value(input) }, () => index),
    );
    const tray = form.querySelector('[data-box-grid]');
    tray.replaceChildren(
      ...Array.from({ length: limit }, (_, index) => {
        const cell = document.createElement('i');
        if (index < cells.length) cell.dataset.kind = cells[index];
        return cell;
      }),
    );
  }

  function updateCake() {
    const filling = form.elements.recheio;
    const candidates = fillings[form.elements.massa.value];
    const old = filling.value;
    if (filling.options[0]?.value !== candidates[0]) {
      filling.replaceChildren(
        ...candidates.map((label) => new Option(label, label)),
      );
      filling.value = candidates.includes(old) ? old : candidates[0];
    }
    const finish = form.elements.acabamento.value;
    const photo = form.querySelector('.cake-photo img');
    const [src, alt] = finishes[finish];
    if (photo.getAttribute('src') !== src) {
      photo.src = src;
      photo.alt = alt;
    }
    form.querySelector('[data-finish-caption]').textContent =
      finish + ' · referência do acabamento';
  }

  function updateTable() {
    const people = value(form.elements.convidados);
    const portion = value(form.elements.porcao);
    const total = desired();
    const distribution = assigned();
    form.querySelector('[data-formula]').textContent =
      count(people, 'convidado', 'convidados') +
      ' × ' +
      count(portion, 'doce', 'doces') +
      ' = ' +
      count(total, 'unidade', 'unidades');
    form.querySelector('[data-balance]').textContent =
      distribution + ' de ' + total + ' unidades distribuídas';
  }

  function update() {
    if (error) error.textContent = '';
    if (mode === 'caixa') updateBox();
    if (mode === 'bolo') updateCake();
    if (mode === 'mesa') updateTable();
  }

  function rows() {
    if (mode === 'caixa')
      return [
        ['Tamanho da caixa', count(capacity(), 'doce', 'doces')],
        ...flavors
          .filter((input) => value(input) > 0)
          .map((input) => [input.dataset.flavor, String(value(input))]),
      ];
    if (mode === 'bolo')
      return [
        ['Diâmetro', 'tamanho'],
        ['Massa', 'massa'],
        ['Recheio', 'recheio'],
        ['Acabamento', 'acabamento'],
      ].map(([label, field]) => [label, form.elements[field].value]);
    return [
      ['Convidados', form.elements.convidados.value],
      ['Doces por pessoa', form.elements.porcao.value],
      ...formats.map((label, index) => [
        label,
        form.elements['lote-' + index].value,
      ]),
      ['Total', count(desired(), 'unidade', 'unidades')],
    ];
  }

  function edit() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    fields.querySelector('input:checked, input').focus();
  }

  form.addEventListener('input', update);
  form.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delta]');
    if (!button) return;
    const input = button.closest('.counter').querySelector('input');
    input.value = value(input) + Number(button.dataset.delta);
    updateBox();
    error.textContent = '';
    if (button.disabled) input.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (mode === 'caixa' && packed() !== capacity()) {
      error.textContent =
        packed() < capacity()
          ? 'Complete a caixa com mais ' +
            count(capacity() - packed(), 'doce', 'doces') +
            '.'
          : 'Retire ' +
            count(packed() - capacity(), 'doce', 'doces') +
            ' para caber na caixa.';
      return;
    }
    if (mode === 'mesa' && desired() !== assigned()) {
      error.textContent =
        assigned() < desired()
          ? 'Distribua mais ' +
            count(desired() - assigned(), 'unidade', 'unidades') +
            '.'
          : 'Retire ' +
            count(assigned() - desired(), 'unidade', 'unidades') +
            ' para igualar o total.';
      return;
    }
    summary.replaceChildren(
      ...rows().map(([label, data]) => {
        const item = document.createElement('div');
        const term = document.createElement('dt');
        const detail = document.createElement('dd');
        term.textContent = label;
        detail.textContent = data;
        item.append(term, detail);
        return item;
      }),
    );
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  form.querySelector('[data-edit]').addEventListener('click', edit);
  form.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    update();
    edit();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const text = [
      'Dobra Doce · DD-DEMO-001',
      ...rows().map(([label, data]) => label + ': ' + data),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Resumo copiado.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Use a opção Copiar do seu dispositivo.';
    }
  });

  update();
}
