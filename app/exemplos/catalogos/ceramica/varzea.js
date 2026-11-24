const form = document.querySelector('[data-flow]');

if (form) {
  const mode = form.dataset.flow;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-status]');
  const error = form.querySelector('[data-error]');
  const total = form.querySelector('[data-total]');
  const cafePieces = { Espresso: 'Xícara · 90 ml', Cappuccino: 'Xícara · 180 ml', 'Serviço de mesa': 'Prato raso · 26 cm' };

  function quantityLabel(count) {
    return count + (count === 1 ? ' peça' : ' peças');
  }

  function lotCount() {
    const active = form.elements.ativas;
    const reserve = form.elements.reserva;
    return active.validity.valid && reserve.validity.valid ? active.valueAsNumber + reserve.valueAsNumber : null;
  }

  function refresh() {
    const values = new FormData(form);
    if (error) error.textContent = '';
    if (mode === 'mesa') {
      const places = Number(values.get('lugares'));
      const pieces = values.getAll('peca');
      for (const layer of form.querySelectorAll('[data-layer]')) layer.hidden = !pieces.includes(layer.dataset.layer);
      total.textContent = quantityLabel(places * pieces.length) + ' para ' + places + ' lugares';
    }
    if (mode === 'presente') {
      for (const product of form.querySelectorAll('[data-product]')) product.hidden = product.dataset.product !== values.get('peca');
    }
    if (mode === 'cafes') {
      form.querySelector('[data-cafe-piece]').textContent = cafePieces[values.get('uso')];
      form.querySelector('[data-swatch]').dataset.swatch = values.get('acabamento');
      const count = lotCount();
      total.textContent = count === null ? 'Confira as quantidades' : quantityLabel(count) + ' no lote';
    }
  }

  function readRows() {
    const values = new FormData(form);
    if (mode === 'mesa') {
      const places = Number(values.get('lugares'));
      const pieces = values.getAll('peca');
      if (!pieces.length) return [];
      return [['Lugares', String(places)], ...pieces.map(piece => [piece, quantityLabel(places)]), ['Total', quantityLabel(places * pieces.length)]];
    }
    if (mode === 'presente') {
      return [['Peça escolhida', values.get('peca')], ['Quantidade', quantityLabel(Number(values.get('quantidade')))], ['Apresentação', values.get('embalagem') || 'Embalagem padrão']];
    }
    return [['Uso', values.get('uso')], ['Peça', cafePieces[values.get('uso')]], ['Em uso', values.get('ativas')], ['Reposição', values.get('reserva')], ['Acabamento', values.get('acabamento')], ['Total do lote', quantityLabel(lotCount())]];
  }

  function edit() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    (fields.querySelector('input:checked') || fields.querySelector('input')).focus();
  }

  form.addEventListener('input', refresh);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const rows = readRows();
    if (!rows.length) {
      error.textContent = 'Inclua pelo menos um tipo de peça para montar o conjunto.';
      form.querySelector('[name=peca]').focus();
      return;
    }
    summary.replaceChildren(...rows.map(([key, value]) => {
      const group = document.createElement('div');
      const label = document.createElement('dt');
      const detail = document.createElement('dd');
      label.textContent = key;
      detail.textContent = value;
      group.append(label, detail);
      return group;
    }));
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
    const lines = readRows().map(([label, value]) => label + ': ' + value);
    try {
      await navigator.clipboard.writeText(['Ateliê Várzea · VZ-DEMO-001', ...lines].join('\n'));
      status.textContent = 'Resumo copiado.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Use a opção Copiar do seu dispositivo.';
    }
  });

  refresh();
}
