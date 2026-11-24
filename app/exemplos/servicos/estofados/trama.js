const form = document.querySelector('[data-flow]');

if (form) {
  const mode = form.dataset.flow;
  const fields = form.querySelector('[data-fields]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-status]');
  const error = form.querySelector('[data-error]');
  const inventory = new Map();
  const rooms = Array.from(form.querySelectorAll('[data-room]'));
  const spaces = Array.from(form.querySelectorAll('[data-space]'));
  let lastFocus = null;

  function inventoryLabel(entry) {
    return entry.size ? entry.piece + ' · ' + entry.size : entry.piece;
  }

  function renderInventory() {
    const list = form.querySelector('[data-items]');
    list.replaceChildren(...Array.from(inventory, ([key, entry]) => {
      const item = document.createElement('li');
      const description = document.createElement('span');
      const remove = document.createElement('button');
      description.textContent = entry.count + ' × ' + inventoryLabel(entry);
      remove.type = 'button';
      remove.textContent = 'Remover';
      remove.setAttribute('aria-label', 'Remover ' + inventoryLabel(entry));
      remove.addEventListener('click', () => {
        inventory.delete(key);
        renderInventory();
        form.querySelector('[data-add]').focus();
      });
      item.append(description, remove);
      return item;
    }));
    const count = Array.from(inventory.values()).reduce((total, entry) => total + entry.count, 0);
    form.querySelector('[data-tally]').textContent = count + (count === 1 ? ' peça na lista' : ' peças na lista');
    form.querySelector('[data-empty]').hidden = count > 0;
  }

  function updatePiece() {
    const field = form.elements.tamanho;
    field.disabled = form.elements.movel.value !== 'Sofá';
    field.hidden = field.disabled;
    field.labels[0].hidden = field.disabled;
  }

  function countRooms() {
    let count = 0;
    spaces.forEach((space, index) => {
      const selected = space.querySelectorAll(':checked').length;
      rooms[index].querySelector('[data-room-count]').textContent = selected || '';
      count += selected;
    });
    form.querySelector('[data-tally]').textContent = count
      ? count + (count === 1 ? ' item marcado' : ' itens marcados')
      : 'Nenhum item marcado';
  }

  function showRoom(index) {
    spaces.forEach((space, position) => {
      const active = index === position;
      space.hidden = !active;
      rooms[position].setAttribute('aria-pressed', String(active));
    });
  }

  function refreshSituation() {
    const selected = form.elements.situacao.value;
    for (const panel of form.querySelectorAll('[data-guidance]')) {
      panel.hidden = panel.dataset.guidance !== selected;
    }
  }

  function readRows() {
    if (mode === 'inventario') {
      const entries = Array.from(inventory.values());
      if (!entries.length) return [];
      const total = entries.reduce((count, entry) => count + entry.count, 0);
      return [...entries.map(entry => [inventoryLabel(entry), String(entry.count)]), ['Total de peças', String(total)]];
    }
    if (mode === 'casa') {
      return spaces.flatMap(space => {
        const checked = Array.from(space.querySelectorAll(':checked'), field => field.value);
        return checked.length ? [[space.querySelector('legend').textContent, checked.join(', ')]] : [];
      });
    }
    const selected = form.querySelector('[name=situacao]:checked');
    const note = form.querySelector('[data-guidance]:not([hidden])');
    return [
      ['Situação', selected.nextElementSibling.textContent],
      ['Material', form.elements.material.value],
      ['Para informar na avaliação', note.textContent],
    ];
  }

  function edit() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = '';
    (lastFocus || fields.querySelector('input,select,button')).focus();
  }

  if (mode === 'inventario') {
    form.elements.movel.addEventListener('change', updatePiece);
    form.querySelector('[data-add]').addEventListener('click', () => {
      const quantity = form.elements.quantidade;
      if (!quantity.reportValidity()) return;
      const piece = form.elements.movel.value;
      const size = form.elements.tamanho.disabled ? '' : form.elements.tamanho.value;
      const key = piece + size;
      const count = (inventory.get(key)?.count ?? 0) + quantity.valueAsNumber;
      inventory.set(key, { piece, size, count });
      error.textContent = '';
      renderInventory();
    });
  } else if (mode === 'casa') {
    rooms.forEach((button, index) => button.addEventListener('click', () => showRoom(index)));
    form.addEventListener('change', () => {
      error.textContent = '';
      countRooms();
    });
  } else form.addEventListener('input', refreshSituation);

  form.addEventListener('submit', event => {
    event.preventDefault();
    const rows = readRows();
    if (!rows.length) {
      error.textContent = mode === 'casa' ? 'Marque pelo menos um item para preparar a visita.' : 'Adicione pelo menos um estofado à lista.';
      return;
    }
    lastFocus = event.submitter;
    summary.replaceChildren(...rows.map(([label, value]) => {
      const line = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      line.append(term, detail);
      return line;
    }));
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  form.querySelector('[data-edit]').addEventListener('click', edit);
  form.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    if (mode === 'inventario') {
      inventory.clear();
      updatePiece();
      renderInventory();
    } else if (mode === 'casa') {
      showRoom(0);
      countRooms();
    } else refreshSituation();
    edit();
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const lines = readRows().map(([label, value]) => label + ': ' + value);
    try {
      await navigator.clipboard.writeText(['Casa em Trama · CET-DEMO-001', ...lines].join('\n'));
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
