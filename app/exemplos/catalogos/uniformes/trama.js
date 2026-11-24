const form = document.querySelector('form[data-mode]');

if (form) {
  const mode = form.dataset.mode;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const tally = form.querySelector('[data-tally]');
  const status = form.querySelector('[data-status]');
  const error = form.querySelector('[data-error]');
  const amounts = Array.from(form.querySelectorAll('[data-size]'));

  function pieceCount(total, ending) {
    return total + (total === 1 ? ' peça ' : ' peças ') + ending;
  }

  function refresh() {
    const values = new FormData(form);
    if (error) error.textContent = '';

    if (mode === 'vitrine') {
      const selectedSector = values.get('setor');
      for (const item of form.querySelectorAll('[data-sectors]')) {
        item.hidden = !item.dataset.sectors.split(' ').includes(selectedSector);
      }
      const count = values.getAll('peca').length;
      tally.textContent = count ? pieceCount(count, 'na lista') : 'Nenhuma peça na lista';
    }

    if (mode === 'grade') {
      let total = 0;
      for (const row of form.querySelectorAll('tbody tr')) {
        const sum = Array.from(row.querySelectorAll('input')).reduce((acc, input) => {
          return acc + (input.validity.valid ? input.valueAsNumber : 0);
        }, 0);
        row.querySelector('[data-row-total]').textContent = sum;
        total += sum;
      }
      tally.textContent = pieceCount(total, 'na grade');
    }

    if (mode === 'marca') {
      const preview = form.querySelector('[data-preview]');
      const svg = form.querySelector('[data-artboard]');
      svg.dataset.piece = values.get('modelo');
      svg.dataset.position = values.get('posicao');
      preview.textContent = [svg.dataset.piece, svg.dataset.position].join(' · ');
    }
  }

  function readRows() {
    const values = new FormData(form);
    if (mode === 'vitrine') return values.getAll('peca').map((piece, i) => ['Peça ' + (i + 1), piece]);
    if (mode === 'grade') {
      return amounts.filter(input => input.valueAsNumber > 0).map(input => [
        input.dataset.piece + ' · ' + input.dataset.size,
        pieceCount(input.valueAsNumber, '').trim(),
      ]);
    }
    return [['Peça', values.get('modelo')], ['Posição', values.get('posicao')], ['Acabamento', values.get('tecnica')]];
  }

  function showFields() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    fields.querySelector('input:not([type="hidden"])').focus();
  }

  form.addEventListener('input', refresh);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const rows = readRows();
    if (!rows.length) {
      error.textContent = mode === 'grade' ? 'Preencha a quantidade de pelo menos um tamanho.' : 'Escolha pelo menos uma peça.';
      return;
    }

    summary.replaceChildren(...rows.map(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      term.textContent = label;
      const detail = document.createElement('dd');
      detail.textContent = value;
      row.append(term, detail);
      return row;
    }));
    if (mode === 'grade') {
      const total = document.createElement('div');
      const title = document.createElement('dt');
      title.textContent = 'Total';
      const count = document.createElement('dd');
      count.textContent = tally.textContent;
      total.append(title, count);
      summary.append(total);
    }

    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  form.querySelector('[data-edit]').addEventListener('click', showFields);
  form.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    refresh();
    showFields();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const lines = Array.from(summary.children, row => row.firstElementChild.textContent + ': ' + row.lastElementChild.textContent);
    const text = ['Lista de demonstração · Trama de Ofício', ...lines].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Lista copiada.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Use o comando Copiar do seu dispositivo para copiar a seleção.';
    }
  });
}
