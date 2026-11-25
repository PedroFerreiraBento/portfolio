const root = document.querySelector('[data-catalog]');
const mode = root.dataset.catalog;
const products = [
  { id: 'FN-01', name: 'Zamioculca', plant: true, light: 'indireta', size: 12, file: 'zamioculca.webp', form: 'Folhagem ereta' },
  { id: 'FN-02', name: 'Jiboia-dourada', plant: true, light: 'indireta', size: 11, file: 'jiboia.webp', form: 'Folhagem pendente' },
  { id: 'FN-03', name: 'Alecrim', plant: true, light: 'direta', size: 16, file: 'alecrim.webp', form: 'Ramos finos e eretos' },
  { id: 'FN-04', name: 'Cachepô Telha', size: 13, file: 'telha.webp', form: 'Cerâmica fosca' },
  { id: 'FN-05', name: 'Cachepô Índigo', size: 16, file: 'indigo.webp', form: 'Cerâmica esmaltada' },
  { id: 'FN-06', name: 'Cachepô Areia', size: 20, file: 'areia.webp', form: 'Cerâmica texturizada' },
];

if (mode !== 'compare') startCatalog();

function startCatalog() {
  const cartKey = 'folha-norte-cotacao-v1';
  const all = selector => Array.from(document.querySelectorAll(selector));
  const find = selector => document.querySelector(selector);
  const status = find('[data-quote-status]');
  const preview = find('[data-preview]');
  const simulate = find('[data-simulate]');
  const message = find('[data-message]');
  let cart = {};

  try {
    const savedCart = JSON.parse(sessionStorage.getItem(cartKey)) || {};
    cart = Object.fromEntries(products.flatMap(({ id }) =>
      Number.isInteger(savedCart[id]) && savedCart[id] > 0 && savedCart[id] <= 99 ? [[id, savedCart[id]]] : [],
    ));
  } catch {
    // The catalog can still run when session storage is unavailable.
  }

  function hidePreview() {
    preview.hidden = true;
    simulate.setAttribute('aria-expanded', 'false');
    find('[data-copy-status]').textContent = '';
  }

  function sync(text, focusTarget) {
    try { sessionStorage.setItem(cartKey, JSON.stringify(cart)); } catch {}
    paintCart();
    if (text) status.textContent = text;
    if (focusTarget) {
      const next = find(focusTarget) || find('.cart-link');
      next.focus();
    }
  }

  function addQuantities(entries) {
    if (entries.some(([id, count]) => (cart[id] || 0) + count > 99)) {
      status.textContent = 'O limite é de 99 unidades por produto. Ajuste as quantidades na lista.';
      return false;
    }
    for (const [id, count] of entries) cart[id] = (cart[id] || 0) + count;
    sync('Lista atualizada.');
    return true;
  }

  function paintCart() {
    const list = find('[data-quote-items]');
    const selected = products.filter(product => cart[product.id]);
    list.replaceChildren(...selected.map(product => {
      const row = document.createElement('li');
      row.innerHTML = '<div><strong></strong><small></small></div><div class="counter"><button type="button" data-delta="-1">−</button><span></span><button type="button" data-delta="1">+</button></div><button type="button" class="plain remove">Remover</button>';
      row.querySelector('strong').textContent = product.name;
      row.querySelector('small').textContent = product.id;
      const minus = row.querySelector('[data-delta="-1"]');
      const plus = row.querySelector('[data-delta="1"]');
      minus.setAttribute('aria-label', 'Reduzir ' + product.name);
      plus.setAttribute('aria-label', 'Aumentar ' + product.name);
      minus.disabled = cart[product.id] === 1;
      plus.disabled = cart[product.id] === 99;
      row.querySelector('.counter span').textContent = cart[product.id];
      const remove = row.querySelector('.remove');
      remove.setAttribute('aria-label', 'Remover ' + product.name);
      row.querySelectorAll('button').forEach(button => {
        button.dataset.cartId = product.id;
        button.addEventListener('click', () => {
          if (button === remove) delete cart[product.id];
          else cart[product.id] += Number(button.dataset.delta);
          hidePreview();
          const selector = button === remove
            ? '[data-cart-id]:not(:disabled)'
            : '[data-cart-id="' + product.id + '"][data-delta="' + button.dataset.delta + '"]:not(:disabled), [data-cart-id="' + product.id + '"].remove';
          sync(button === remove ? product.name + ' removido da lista.' : 'Quantidade atualizada.', selector);
        });
      });
      return row;
    }));
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    all('[data-cart-count]').forEach(el => { el.textContent = count; });
    find('[data-empty]').hidden = selected.length > 0;
    find('[data-review]').hidden = selected.length === 0;
  }

  simulate.addEventListener('click', () => {
    const lines = products.filter(p => cart[p.id]).map(p => cart[p.id] + ' × ' + p.name + ' (' + p.id + ')');
    message.textContent = ['Olá, Folha Norte! Gostaria de cotar estes produtos:', '', ...lines, '', 'Podem informar os preços e a disponibilidade?'].join('\n');
    preview.hidden = false;
    simulate.setAttribute('aria-expanded', 'true');
    find('#whatsapp-title').focus();
  });
  find('[data-copy]').addEventListener('click', async () => {
    const copyStatus = find('[data-copy-status]');
    try {
      await navigator.clipboard.writeText(message.textContent);
      copyStatus.textContent = 'Mensagem copiada.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(message);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Use a opção Copiar do seu dispositivo.';
    }
  });
  find('[data-edit]').addEventListener('click', () => {
    hidePreview();
    find('[data-quote-items] button:not(:disabled)')?.focus();
  });
  find('[data-clear]').addEventListener('click', () => {
    cart = {};
    hidePreview();
    sync('Lista limpa.', '.cart-link');
  });

  function addWithFeedback(entries, target, notice, success) {
    hidePreview();
    if (addQuantities(entries)) {
      notice.textContent = success;
      return true;
    }
    notice.textContent = status.textContent;
    target.focus();
    return false;
  }

  if (mode === 'luz') {
    const list = find('[data-plants]');
    const cards = products.filter(p => p.plant).map(product => {
      const card = document.createElement('article');
      card.className = 'plant';
      card.dataset.light = product.light;
      card.innerHTML = '<img width="640" height="640" loading="lazy" alt=""><div class="plant-detail"><p class="sku"></p><h3></h3><dl><div><dt>Luz</dt><dd></dd></div><div><dt>Vaso de cultivo</dt><dd></dd></div><div><dt>Forma</dt><dd></dd></div></dl><button class="button" type="button">Adicionar à lista</button><p class="feedback" role="status"></p></div>';
      card.querySelector('img').src = product.file;
      card.querySelector('img').alt = product.name + ' no vaso de cultivo';
      card.querySelector('.sku').textContent = product.id;
      card.querySelector('h3').textContent = product.name;
      const facts = [product.light === 'direta' ? 'Sol direto' : 'Luz indireta', product.size + ' cm externos', product.form];
      card.querySelectorAll('dd').forEach((dd, index) => { dd.textContent = facts[index]; });
      const button = card.querySelector('button');
      button.setAttribute('aria-label', 'Adicionar ' + product.name + ' à lista');
      button.addEventListener('click', () => addWithFeedback(
        [[product.id, 1]], button, card.querySelector('.feedback'), 'Adicionado à lista.',
      ));
      return card;
    });
    list.append(...cards);
    const showPlants = selected => {
      cards.forEach(card => { card.hidden = selected !== 'todas' && card.dataset.light !== selected; });
      const count = cards.filter(card => !card.hidden).length;
      find('[data-results]').textContent = count + (count === 1 ? ' planta' : ' plantas');
    };
    all('[name=luz]').forEach(input => input.addEventListener('change', () => showPlants(input.value)));
    showPlants(find('[name=luz]:checked').value);
  }

  if (mode === 'dupla') {
    const plantChoice = find('[data-plant-choice]');
    const potChoice = find('[data-pot-choice]');
    const button = find('[data-add-pair]');
    const fit = find('[data-fit]');
    const count = find('[data-pair-count]');
    for (const p of products) {
      (p.plant ? plantChoice : potChoice).add(new Option(p.name + ' · ' + p.size + ' cm', p.id));
    }
    const pick = control => products.find(p => p.id === control.value);
    function updatePair() {
      const plant = pick(plantChoice);
      const pot = pick(potChoice);
      const gap = pot.size - plant.size;
      for (const [key, p, side] of [['plant', plant, 'Ø externo'], ['pot', pot, 'Ø interno']]) {
        const image = find('[data-' + key + '-preview]');
        image.src = p.file;
        image.alt = p.name;
        find('[data-' + key + '-caption]').textContent = p.name + ' · ' + side + ' ' + p.size + ' cm';
      }
      button.disabled = gap < 1 || gap > 4;
      fit.textContent = gap < 1 ? 'A abertura é insuficiente. Escolha um cachepô com pelo menos 1 cm de folga.'
        : gap > 4 ? 'A folga passa de 4 cm. Selecione um cachepô menor para esta combinação.'
        : 'Encaixe da demonstração · ' + gap + ' cm de folga.';
      fit.dataset.fit = button.disabled ? 'review' : 'ok';
    }
    plantChoice.addEventListener('change', updatePair);
    potChoice.addEventListener('change', updatePair);
    button.addEventListener('click', () => {
      if (!count.reportValidity()) return;
      const n = count.valueAsNumber;
      addWithFeedback([[plantChoice.value, n], [potChoice.value, n]], button, fit,
        n === 1 ? 'Dupla adicionada à lista.' : 'Duplas adicionadas à lista.');
    });
    updatePair();
  }

  if (mode === 'rapido') {
    const rows = find('[data-rows]');
    const search = find('[data-search]');
    const notice = find('[data-draft-total]');
    const add = find('[data-add-all]');
    const lookup = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    rows.replaceChildren(...products.map(product => {
      const row = document.createElement('div');
      row.className = 'rapid-row';
      row.setAttribute('role', 'listitem');
      row.innerHTML = '<div><img width="60" height="60" loading="lazy" alt=""><div><strong></strong><small></small></div></div><label><span class="sr">Quantidade de </span><input type="number" min="0" max="99" step="1" value="0" inputmode="numeric" required></label>';
      row.dataset.lookup = lookup(product.name + ' ' + product.id);
      row.querySelector('img').src = product.file;
      row.querySelector('strong').textContent = product.name;
      row.querySelector('small').textContent = product.id + ' · ' + product.form;
      row.querySelector('input').dataset.id = product.id;
      row.querySelector('input').setAttribute('aria-label', 'Quantidade de ' + product.name);
      return row;
    }));
    const inputs = all('.rapid-row input');
    function updateDraft() {
      const count = inputs.reduce((n, input) => n + (input.validity.valid ? input.valueAsNumber : 0), 0);
      notice.textContent = count ? count + (count === 1 ? ' unidade selecionada' : ' unidades selecionadas') : 'Nenhuma unidade selecionada';
    }
    inputs.forEach(input => input.addEventListener('input', updateDraft));
    function filterRows() {
      const term = lookup(search.value);
      const list = all('.rapid-row');
      list.forEach(row => { row.hidden = !row.dataset.lookup.includes(term); });
      find('[data-no-results]').hidden = list.some(row => !row.hidden);
    }
    search.addEventListener('input', filterRows);
    add.addEventListener('click', () => {
      const invalid = inputs.find(input => !input.validity.valid);
      if (invalid) {
        if (invalid.closest('.rapid-row').hidden) {
          search.value = '';
          filterRows();
        }
        invalid.reportValidity();
        return;
      }
      const draft = inputs.filter(input => input.valueAsNumber > 0)
        .map(input => [input.dataset.id, input.valueAsNumber]);
      if (!draft.length) {
        notice.textContent = 'Informe pelo menos uma quantidade para continuar.';
        return;
      }
      if (addWithFeedback(draft, add, notice, 'Produtos adicionados à lista.')) {
        inputs.forEach(input => { input.value = 0; });
      }
    });
  }

  paintCart();
}
