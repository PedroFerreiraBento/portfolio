const form = document.querySelector('form[data-mode]');

if (form) {
  const mode = form.dataset.mode;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-copy-status]');
  const quantities = Array.from(form.querySelectorAll('[data-volume]'));
  const steps = Array.from(form.querySelectorAll('[data-step]'));
  const planLabels = [['saida', 'Saída'], ['periodo', 'Período'], ['chegada', 'Chegada']];
  let currentStep = 0;

  function showStep(index, focus) {
    currentStep = index;
    steps.forEach((step, position) => {
      step.hidden = position !== index;
      const marker = form.querySelectorAll('.steps li')[position];
      if (position === index) marker.setAttribute('aria-current', 'step');
      else marker.removeAttribute('aria-current');
    });
    if (focus) (steps[index].querySelector('input:checked') || steps[index].querySelector('input')).focus();
  }

  function updateInventory() {
    const total = inputs => inputs.reduce((count, input) => count + (input.validity.valid ? input.valueAsNumber : 0), 0);
    const label = count => count + (count === 1 ? ' volume' : ' volumes');
    for (const room of form.querySelectorAll('details')) {
      room.querySelector('[data-room-total]').textContent = label(total(Array.from(room.querySelectorAll('input'))));
    }
    form.querySelector('[data-total]').textContent = label(total(quantities)) + ' na lista';
    form.querySelector('[data-error]').textContent = '';
  }

  function readRows() {
    if (mode === 'inventario') {
      return quantities.filter(input => input.valueAsNumber > 0).map(input => [input.labels[0].textContent, input.value]);
    }
    const data = new FormData(form);
    if (mode === 'plano') {
      return planLabels.map(([key, label]) => {
        const selected = fields.querySelector('input[name="' + key + '"]:checked');
        return [label, data.get(key) + ' · ' + selected.parentElement.querySelector('small').textContent];
      });
    }
    const card = fields.querySelector('input:checked').closest('label');
    const jobs = Array.from(card.querySelector('.scope-jobs').children, item => [
      item.firstChild.textContent.trim(),
      item.querySelector('strong').textContent,
    ]);
    return [['Serviço', data.get('escopo')], ...jobs];
  }

  form.addEventListener('click', event => {
    const delta = event.target.closest('[data-delta]');
    if (delta) {
      const input = delta.parentElement.querySelector('input');
      input.value = Math.min(99, Math.max(0, (input.valueAsNumber || 0) + Number(delta.dataset.delta)));
      updateInventory();
    }
    if (event.target.closest('[data-next]') && steps[currentStep].querySelector('input').reportValidity()) {
      showStep(currentStep + 1, true);
    }
    if (event.target.closest('[data-prev]')) showStep(currentStep - 1, true);
  });

  if (mode === 'inventario') {
    form.addEventListener('input', updateInventory);
    form.addEventListener('invalid', event => { event.target.closest('details').open = true; }, true);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (mode === 'plano' && currentStep !== steps.length - 1) return;
    const rows = readRows();
    if (!rows.length) {
      form.querySelector('[data-error]').textContent = 'Acrescente pelo menos um móvel ou uma caixa à lista.';
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

  function showFields() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    if (mode === 'plano') showStep(0, true);
    else (fields.querySelector('input:checked, details[open] input') || fields.querySelector('input')).focus();
  }

  form.querySelector('[data-edit]').addEventListener('click', showFields);
  form.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    if (mode === 'inventario') updateInventory();
    showFields();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const lines = readRows().map(([label, value]) => label + ': ' + value);
    const text = ['Casa em Trânsito · CT-DEMO-001', ...lines].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Resumo copiado.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      status.textContent = 'Selecione o comando Copiar do seu dispositivo.';
    }
  });
}
