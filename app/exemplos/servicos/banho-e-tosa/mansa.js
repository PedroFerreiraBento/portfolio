const form = document.querySelector('[data-demo]');

if (form) {
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const live = form.querySelector('[data-live]');
  const status = form.querySelector('[data-copy-status]');
  const mode = form.dataset.mode;
  const fieldLabels = {
    guide: [['porte', 'Porte'], ['pelagem', 'Pelagem']],
    agenda: [['horario', 'Horário de exemplo'], ['servico', 'Serviço']],
    ritual: [['servico', 'Serviço'], ['extra', 'Acabamentos']],
  };

  function getRows() {
    const data = new FormData(form);
    return fieldLabels[mode].map(([name, label]) => [label, data.getAll(name).join(', ') || 'Nenhum']);
  }

  function showLive() {
    if (!live) return;
    const data = new FormData(form);
    const base = data.get('servico');
    live.textContent = base ? [base, ...data.getAll('extra')].join(' + ') : 'Escolha a base para começar.';
  }

  function showFields() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    const selected = fields.querySelector('input:checked') || fields.querySelector('input');
    selected.focus();
  }

  form.addEventListener('change', showLive);
  form.addEventListener('submit', event => {
    event.preventDefault();
    summary.replaceChildren(...getRows().map(([label, value]) => {
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
    showLive();
    showFields();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const lines = getRows().map(([label, value]) => label + ': ' + value);
    const text = ['Linha Mansa · Simulação LM-DEMO-001', ...lines].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Resumo copiado.';
    } catch {
      status.textContent = 'Não foi possível copiar automaticamente. Selecione e copie o texto do resumo.';
    }
  });
}
