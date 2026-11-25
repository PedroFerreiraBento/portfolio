const products = [
  { id: 'PC-CL', name: 'Colina', profile: 'chocolate', notes: 'Cacau e castanha', roast: 'Torra média', file: 'colina.webp' },
  { id: 'PC-VA', name: 'Vaivém', profile: 'frutado', notes: 'Laranja e frutas amarelas', roast: 'Torra clara', file: 'vaivem.webp' },
  { id: 'PC-PO', name: 'Pouso', profile: 'caramelo', notes: 'Caramelo e amêndoa', roast: 'Torra média', file: 'pouso.webp' },
];
const grinds = ['Em grãos', 'Moagem para italiana', 'Moagem média', 'Moagem grossa'];
const grindCodes = ['GR', 'IT', 'MD', 'GS'];
const methods = {
  Coado: ['Moagem média', 'Para o coado, comece pela moagem média. Ajuste a opção conforme seu filtro e sua preferência.'],
  Italiana: ['Moagem para italiana', 'A opção para cafeteira italiana usa uma granulação média. Confira a orientação do fabricante do seu equipamento.'],
  Prensa: ['Moagem grossa', 'Na prensa, a moagem grossa costuma ser um bom ponto de partida. Você também pode pedir em grãos.'],
};
const select = selector => document.querySelector(selector);
const mode = document.body.dataset.mode;
const allItems = products.flatMap(product => [
  ...grinds.map((grind, i) => ({ key: product.id + '|' + grind, sku: product.id + '250-' + grindCodes[i], name: product.name, weight: 250, grind })),
  { key: product.id + '1', sku: product.id + '1', name: product.name, weight: 1000, grind: 'Em grãos', notes: product.notes },
  { key: product.id + '5', sku: product.id + '5', name: product.name, weight: 5000, grind: 'Em grãos', notes: product.notes },
]);
const cartKey = 'pedra-clara-v1';
const itemList = select('[data-items]');
const status = select('[data-status]');
const preview = select('[data-preview]');
const message = select('[data-message]');
const simulate = select('[data-simulate]');
const copyStatus = select('[data-copy-status]');
const format = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });
const weightText = grams => grams >= 1000 ? format.format(grams / 1000) + ' kg' : grams + ' g';
let cart = {};
try {
  const saved = JSON.parse(sessionStorage.getItem(cartKey)) || {};
  cart = Object.fromEntries(allItems.flatMap(item => {
    const count = saved[item.key];
    return Number.isInteger(count) && count > 0 && count <= 99 ? [[item.key, count]] : [];
  }));
} catch {}

function hidePreview() {
  preview.hidden = true;
  simulate.setAttribute('aria-expanded', 'false');
  copyStatus.textContent = '';
}

function add(entries, notice) {
  if (entries.some(([key, count]) => (cart[key] || 0) + count > 99)) {
    notice.textContent = 'Cada variante aceita até 99 pacotes. Ajuste a quantidade e tente novamente.';
    return false;
  }
  entries.forEach(([key, count]) => { cart[key] = (cart[key] || 0) + count; });
  hidePreview();
  sync();
  notice.textContent = 'Adicionado à lista para cotação.';
  return true;
}

function sync() {
  try { sessionStorage.setItem(cartKey, JSON.stringify(cart)); } catch {}
  const selected = allItems.filter(item => cart[item.key]);
  itemList.replaceChildren(...selected.map(item => {
    const li = document.createElement('li');
    li.innerHTML = '<div><strong></strong><small></small></div><div class="counter"><button type="button">−</button><output></output><button type="button">+</button></div><button type="button" class="link remove">Remover</button>';
    li.querySelector('strong').textContent = item.name;
    li.querySelector('small').textContent = [weightText(item.weight), item.grind, item.sku].join(' · ');
    const [minus, plus, remove] = li.querySelectorAll('button');
    li.querySelector('output').textContent = cart[item.key];
    const variant = item.name + ', ' + weightText(item.weight) + ', ' + item.grind.toLowerCase();
    minus.disabled = cart[item.key] === 1;
    plus.disabled = cart[item.key] === 99;
    minus.setAttribute('aria-label', 'Diminuir ' + variant);
    plus.setAttribute('aria-label', 'Aumentar ' + variant);
    remove.setAttribute('aria-label', 'Remover ' + variant);
    [minus, plus, remove].forEach((button, index) => {
      button.addEventListener('click', () => {
        if (index === 2) delete cart[item.key];
        else cart[item.key] += index === 0 ? -1 : 1;
        hidePreview();
        sync();
        const newRow = index === 2 ? itemList.firstElementChild : itemList.children[selected.indexOf(item)];
        const focus = index === 2 ? newRow?.querySelector('button:not(:disabled)') : newRow?.querySelectorAll('button')[index];
        (focus && !focus.disabled ? focus : newRow?.querySelector('button:not(:disabled)') || select('.cart-link')).focus();
        status.textContent = index === 2 ? 'Produto removido.' : 'Quantidade atualizada.';
      });
    });
    return li;
  }));
  const count = selected.reduce((sum, item) => sum + cart[item.key], 0);
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = count; });
  select('[data-empty]').hidden = selected.length > 0;
  select('[data-review]').hidden = selected.length === 0;
}

simulate.addEventListener('click', () => {
  const lines = allItems.filter(item => cart[item.key]).map(item =>
    cart[item.key] + ' × ' + item.name + ' — ' + [weightText(item.weight), item.grind, item.sku].join(' · '));
  message.textContent = ['Olá, Pedra Clara! Gostaria de cotar estes cafés:', '', ...lines, '', 'Podem informar os preços e a disponibilidade?'].join('\n');
  preview.hidden = false;
  simulate.setAttribute('aria-expanded', 'true');
  select('#mensagem').focus();
});
select('[data-copy]').addEventListener('click', async () => {
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
select('[data-edit]').addEventListener('click', () => {
  hidePreview();
  itemList.querySelector('button:not(:disabled)')?.focus();
});
select('[data-clear]').addEventListener('click', () => {
  cart = {};
  hidePreview();
  sync();
  status.textContent = 'Lista limpa.';
  select('.cart-link').focus();
});

if (mode === 'shelf') {
  const cards = products.map(product => {
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = '<img width="512" height="512" loading="lazy" alt=""><h3></h3><p></p><small></small><button class="primary" type="button">Adicionar em grãos</button><p class="feedback" role="status"></p>';
    const img = card.querySelector('img');
    img.src = product.file;
    img.alt = 'Pacote demonstrativo ' + product.name;
    card.querySelector('h3').textContent = product.name;
    card.querySelector('p').textContent = product.notes;
    card.querySelector('small').textContent = [product.roast, '250 g', product.id + '250-GR'].join(' · ');
    const button = card.querySelector('button');
    button.setAttribute('aria-label', 'Adicionar ' + product.name + ' em grãos');
    button.addEventListener('click', () => add([[product.id + '|Em grãos', 1]], card.querySelector('[role=status]')));
    return card;
  });
  select('[data-products]').append(...cards);
  const update = value => {
    cards.forEach((card, i) => { card.hidden = value !== 'todos' && products[i].profile !== value; });
    const visible = cards.filter(card => !card.hidden).length;
    select('[data-filter-status]').textContent = visible === 1 ? '1 café' : visible + ' cafés';
  };
  document.querySelectorAll('[name=perfil]').forEach(input => input.addEventListener('change', () => update(input.value)));
  update('todos');
}

if (mode === 'method') {
  const form = select('[data-method]');
  const notice = select('[data-method-status]');
  products.forEach(product => form.elements.cafe.add(new Option(product.name + ' · ' + product.notes, product.id)));
  grinds.forEach(grind => form.elements.moagem.add(new Option(grind, grind)));
  function updateMethod() {
    const [grind, note] = methods[form.elements.metodo.value];
    form.elements.moagem.value = grind;
    select('[data-method-note]').textContent = note;
    notice.textContent = '';
  }
  form.querySelectorAll('[name=metodo]').forEach(input => input.addEventListener('change', updateMethod));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const key = form.elements.cafe.value + '|' + form.elements.moagem.value;
    add([[key, form.elements.quantidade.valueAsNumber]], notice);
  });
  updateMethod();
}

if (mode === 'batch') {
  const tbody = select('[data-batch-rows]');
  const search = select('[data-search]');
  const notice = select('[data-batch-status]');
  const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const list = allItems.filter(item => item.weight > 250);
  const rows = list.map(item => {
    const row = document.createElement('tr');
    row.innerHTML = '<td><strong></strong><small></small></td><td></td><td><input type="number" min="0" max="99" value="0" step="1" inputmode="numeric" required></td>';
    row.querySelector('strong').textContent = item.name;
    row.querySelector('small').textContent = item.sku + ' · ' + item.notes;
    row.children[1].textContent = weightText(item.weight);
    row.querySelector('input').setAttribute('aria-label', 'Pacotes ' + item.name + ' ' + weightText(item.weight));
    return row;
  });
  tbody.append(...rows);
  const inputs = rows.map(row => row.querySelector('input'));
  function updateWeight() {
    const grams = inputs.reduce((sum, input, i) => sum + (input.validity.valid ? input.valueAsNumber * list[i].weight : 0), 0);
    select('[data-weight]').textContent = format.format(grams / 1000) + ' kg';
  }
  inputs.forEach(input => input.addEventListener('input', updateWeight));
  function filter() {
    const term = normalize(search.value.trim());
    rows.forEach((row, i) => { row.hidden = !normalize(list[i].name + ' ' + list[i].sku).includes(term); });
    select('[data-no-results]').hidden = rows.some(row => !row.hidden);
  }
  search.addEventListener('input', filter);
  const form = select('[data-batch]');
  form.noValidate = true;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = inputs.find(input => !input.validity.valid);
    if (invalid) {
      if (invalid.closest('tr').hidden) { search.value = ''; filter(); }
      invalid.reportValidity();
      return;
    }
    const entries = inputs.flatMap((input, i) => input.valueAsNumber > 0 ? [[list[i].key, input.valueAsNumber]] : []);
    if (!entries.length) { notice.textContent = 'Informe a quantidade de pelo menos um pacote.'; return; }
    if (add(entries, notice)) {
      inputs.forEach(input => { input.value = 0; });
      updateWeight();
    }
  });
}

sync();
