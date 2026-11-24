(() => {
  const request = document.querySelector('[data-request]');
  if (!request) return;

  const fields = request.querySelector('.request-fields');
  const receipt = request.querySelector('[data-receipt]');
  const summary = receipt.querySelector('[data-summary]');
  const reference = receipt.querySelector('[data-reference]');
  const copyStatus = receipt.querySelector('[data-copy-status]');
  const create = request.querySelector('[data-create]');
  const labels = { formato: 'Formato', periodo: 'Período', assunto: 'Assunto' };

  function refreshCard() {
    const values = new FormData(request);
    for (const note of document.querySelectorAll('[data-live]')) {
      note.textContent = values.get(note.dataset.live) || 'A escolher';
    }
  }

  function showFields() {
    fields.hidden = false;
    receipt.hidden = true;
    copyStatus.textContent = '';
    refreshCard();
    request.querySelector('select, input').focus();
  }

  request.addEventListener('change', refreshCard);
  request.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(request);
    const rows = [];
    for (const [key, label] of Object.entries(labels)) {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = values.get(key);
      row.append(term, detail);
      rows.push(row);
    }
    summary.replaceChildren(...rows);
    if (!reference.textContent) {
      const digits = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(-6).toUpperCase().padStart(6, '0');
      reference.textContent = 'VET-' + digits;
    }
    fields.hidden = true;
    receipt.hidden = false;
    receipt.querySelector('#recibo').focus();
  });

  request.querySelector('[data-edit]').addEventListener('click', showFields);
  request.querySelector('[data-reset]').addEventListener('click', () => {
    request.reset();
    reference.textContent = '';
    showFields();
  });

  request.querySelector('[data-copy]').addEventListener('click', async () => {
    const lines = Array.from(summary.children, (row) => row.children[0].textContent + ': ' + row.children[1].textContent);
    const message = ['Pedido de exemplo ' + reference.textContent, ...lines, 'Demonstração local. Nenhum horário reservado.'].join('\n');
    try {
      await navigator.clipboard.writeText(message);
      copyStatus.textContent = 'Resumo copiado.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Selecione o comando Copiar do seu dispositivo.';
    }
  });
  create.disabled = false;

  const tabs = Array.from(document.querySelectorAll('.place-tabs a'));
  if (!tabs.length) return;

  const tabList = tabs[0].parentElement;
  tabList.setAttribute('role', 'tablist');
  const panels = tabs.map((tab, index) => {
    const panel = document.getElementById(tab.hash.slice(1));
    tab.id = panel.id + '-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      showPlace(index);
      history.replaceState(null, '', tab.hash);
    });
    tab.addEventListener('keydown', (event) => {
      const directions = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in directions)) return;
      event.preventDefault();
      const next = (directions[event.key] + tabs.length) % tabs.length;
      showPlace(next);
      history.replaceState(null, '', tabs[next].hash);
      tabs[next].focus();
    });
    return panel;
  });

  function showPlace(active) {
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === active));
      tab.tabIndex = index === active ? 0 : -1;
      panels[index].hidden = index !== active;
    });
  }

  showPlace(Math.max(0, tabs.findIndex((tab) => tab.hash === location.hash)));
  window.addEventListener('hashchange', () => {
    const active = tabs.findIndex((tab) => tab.hash === location.hash);
    if (active >= 0) showPlace(active);
  });

  for (const link of document.querySelectorAll('[data-format]')) {
    link.addEventListener('click', () => {
      if (!receipt.hidden) showFields();
      request.elements.formato.value = link.dataset.format;
      request.elements.periodo.focus({ preventScroll: true });
    });
  }
})();
