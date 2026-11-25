const products = [
  { id: 'EP-01', name: 'Linha Cal', tone: 'Terracota', mood: 'acolhedor', width: 53, length: 1005, repeat: 0, image: 'linha' },
  { id: 'EP-02', name: 'Folha Branda', tone: 'Sálvia', mood: 'natural', width: 53, length: 1005, repeat: 32, image: 'folha' },
  { id: 'EP-03', name: 'Arcos da Noite', tone: 'Azul-marinho', mood: 'grafico', width: 53, length: 1005, repeat: 64, image: 'arcos' },
];
const formats = { amostra: 'Amostra de 20 × 25 cm', rolo: 'Rolo de 0,53 × 10,05 m' };
const select = selector => document.querySelector(selector);
const page = document.body.dataset.version;
const unitKey = (id, type) => id + '-' + type;
const storageKey = 'entreparedes-lista-v1';
const cart = new Map();
const list = select('[data-items]');
const status = select('[data-status]');
const simulate = select('[data-simulate]');
const preview = select('[data-preview]');
const message = select('[data-message]');
const copyStatus = select('[data-copy-status]');
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

try {
  const saved = JSON.parse(sessionStorage.getItem(storageKey));
  for (const product of products) {
    for (const unit of Object.keys(formats)) {
      const key = unitKey(product.id, unit);
      const value = saved?.[key];
      if (Number.isInteger(value) && value > 0 && value <= 99) cart.set(key, value);
    }
  }
} catch {}

function hideMessage() {
  preview.hidden = true;
  simulate.setAttribute('aria-expanded', 'false');
  copyStatus.textContent = '';
}

function addToCart(entries, notice) {
  if (entries.some(([key, count]) => (cart.get(key) || 0) + count > 99)) {
    notice.textContent = 'O limite é de 99 por produto e unidade. Reduza a quantidade na lista.';
    return;
  }
  for (const [key, count] of entries) cart.set(key, (cart.get(key) || 0) + count);
  hideMessage();
  renderCart();
  notice.textContent = entries.length === 1 ? 'Seleção adicionada à lista.' : 'Amostras adicionadas à lista.';
}

function getCartRows() {
  return products.flatMap(product => Object.entries(formats).flatMap(([type, format]) => {
    const key = unitKey(product.id, type);
    return cart.has(key) ? [{ key, product, format, count: cart.get(key) }] : [];
  }));
}

function renderCart(focusKey, focusIndex) {
  const rows = getCartRows();
  let focusRow;
  try { sessionStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(cart))); } catch {}
  list.replaceChildren(...rows.map(({ key, product, format, count }) => {
    const row = document.createElement('li');
    row.innerHTML = '<div><strong></strong><small></small></div><div class="counter"><button type="button">−</button><output></output><button type="button">+</button></div><button class="text-button" type="button">Remover</button>';
    row.querySelector('strong').textContent = product.name;
    row.querySelector('small').textContent = product.id + ' · ' + product.tone + ' · ' + format;
    row.querySelector('output').textContent = count;
    const buttons = row.querySelectorAll('button');
    if (key === focusKey) focusRow = buttons;
    const label = product.name + ' · ' + format;
    buttons[0].disabled = count === 1;
    buttons[1].disabled = count === 99;
    for (const [index, verb] of ['Diminuir', 'Aumentar', 'Remover'].entries()) {
      buttons[index].setAttribute('aria-label', verb + ' ' + label);
      buttons[index].addEventListener('click', () => {
        if (index === 2) cart.delete(key);
        else cart.set(key, count + (index === 0 ? -1 : 1));
        hideMessage();
        renderCart(key, index);
        status.textContent = index === 2 ? 'Produto removido.' : 'Quantidade atualizada.';
      });
    }
    return row;
  }));
  select('[data-count]').textContent = rows.reduce((total, row) => total + row.count, 0);
  select('[data-empty]').hidden = rows.length > 0;
  select('[data-review]').hidden = rows.length === 0;
  if (focusKey) {
    const target = focusRow?.[focusIndex];
    (target && !target.disabled ? target : list.querySelector('button:not(:disabled)') || select('.list-link')).focus();
  }
}

simulate.addEventListener('click', () => {
  const lines = getCartRows().map(({ product, format, count }) =>
    count + ' × ' + product.name + ' · ' + product.tone + ' · ' + product.id + ' · ' + format);
  message.textContent = ['Olá, Entreparedes! Gostaria de cotar estes itens:', '', ...lines, '', 'Podem confirmar os preços e a disponibilidade?'].join('\n');
  preview.hidden = false;
  simulate.setAttribute('aria-expanded', 'true');
  select('#mensagem').focus();
});

select('[data-copy]').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(message.textContent);
    copyStatus.textContent = 'Mensagem copiada.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(message);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Use a opção Copiar do seu dispositivo.';
  }
});
select('[data-edit]').addEventListener('click', () => {
  hideMessage();
  list.querySelector('button:not(:disabled)')?.focus();
});
select('[data-clear]').addEventListener('click', () => {
  cart.clear();
  hideMessage();
  renderCart();
  status.textContent = 'Lista limpa.';
  select('.list-link').focus();
});

if (page === 'ambientes') {
  const cards = products.map(product => {
    const article = document.createElement('article');
    article.innerHTML = '<figure><img width="512" height="512" loading="lazy" alt=""></figure><div><h3></h3><p></p><small></small><button class="primary" type="button">Adicionar amostra</button><p class="form-status" role="status"></p></div>';
    const photo = article.querySelector('img');
    photo.src = product.image + '-ambiente.webp';
    photo.alt = product.name + ' aplicado na parede';
    article.querySelector('h3').textContent = product.name;
    article.querySelector('p').textContent = product.tone + ' · ' + product.id;
    article.querySelector('small').textContent = product.repeat ? 'Repetição de ' + product.repeat + ' cm' : 'Sem encaixe de estampa';
    const button = article.querySelector('button');
    button.setAttribute('aria-label', 'Adicionar amostra de ' + product.name);
    button.addEventListener('click', () => addToCart([[unitKey(product.id, 'amostra'), 1]], article.querySelector('[role=status]')));
    return article;
  });
  select('[data-patterns]').append(...cards);
  function filter() {
    const mood = select('[name=clima]:checked').value;
    cards.forEach((card, i) => { card.hidden = mood !== 'todas' && products[i].mood !== mood; });
    const count = cards.filter(card => !card.hidden).length;
    select('[data-filter]').textContent = count + (count === 1 ? ' estampa' : ' estampas');
  }
  document.querySelectorAll('[name=clima]').forEach(input => input.addEventListener('change', filter));
  filter();
}

function metres(value) {
  return decimal.format(value / 100) + ' m';
}

if (page === 'medir') {
  const form = select('[data-calc]');
  const { papel, largura, altura } = form.elements;
  const specs = select('[data-roll-spec]');
  const result = select('[data-roll-result]');
  const breakdown = select('[data-breakdown]');
  const wall = select('[data-wall]');
  const notice = select('[data-calc-status]');
  const addButton = select('[data-add-rolls]');
  products.forEach(product => papel.add(new Option(product.name + ' · ' + product.id, product.id)));
  function calculate() {
    const product = products.find(item => item.id === papel.value);
    specs.textContent = 'Rolo ' + metres(product.width) + ' × ' + metres(product.length) + ' · ' +
      (product.repeat ? 'repetição de ' + product.repeat + ' cm' : 'sem encaixe de estampa');
    if (!largura.validity.valid || !altura.validity.valid) {
      result.textContent = 'Confira as medidas';
      breakdown.replaceChildren();
      wall.replaceChildren();
      addButton.disabled = true;
      return null;
    }
    const cut = Math.round(altura.valueAsNumber * 100) + 10;
    const drop = product.repeat ? Math.ceil(cut / product.repeat) * product.repeat : cut;
    const strips = Math.ceil(Math.round(largura.valueAsNumber * 100) / product.width);
    const perRoll = Math.floor(product.length / drop);
    const rolls = Math.ceil(strips / perRoll);
    result.textContent = rolls + (rolls === 1 ? ' rolo estimado' : ' rolos estimados');
    wall.style.setProperty('--columns', strips);
    wall.style.backgroundImage = 'url("' + product.image + '-amostra.webp")';
    wall.replaceChildren(...Array.from({ length: strips }, () => document.createElement('i')));
    breakdown.replaceChildren(...[['Faixas na parede', strips], ['Comprimento por faixa', metres(drop)], ['Faixas por rolo', perRoll]].map(([label, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));
    addButton.disabled = false;
    return [unitKey(product.id, 'rolo'), rolls];
  }
  form.addEventListener('input', () => { notice.textContent = ''; calculate(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const item = calculate();
    if (item) addToCart([item], notice);
  });
  calculate();
}

if (page === 'pasta') {
  const form = select('[data-folder]');
  const notices = select('[data-folder-status]');
  const compare = select('[data-comparison]');
  select('[data-folder-options]').replaceChildren(...products.map(product => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'referencia';
    input.value = product.id;
    label.append(input, ' ' + product.name + ' · ' + product.id);
    return label;
  }));
  const choices = () => products.filter(product => form.querySelector('input[value="' + product.id + '"]').checked);
  function renderFolder() {
    notices.textContent = '';
    const chosen = choices();
    if (!chosen.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Escolha as estampas que você quer comparar.';
      compare.replaceChildren(empty);
      return;
    }
    compare.replaceChildren(...chosen.map(product => {
      const figure = document.createElement('figure');
      const swatch = document.createElement('img');
      swatch.src = product.image + '-amostra.webp';
      swatch.alt = 'Amostra ' + product.name + ' em ' + product.tone;
      swatch.width = 512;
      swatch.height = 512;
      const caption = document.createElement('figcaption');
      caption.textContent = product.name + ' · ' + product.tone;
      figure.append(swatch, caption);
      return figure;
    }));
  }
  form.addEventListener('change', renderFolder);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const chosen = choices();
    if (!chosen.length) {
      notices.textContent = 'Marque pelo menos uma referência para montar a pasta.';
      form.querySelector('input').focus();
      return;
    }
    addToCart(chosen.map(product => [unitKey(product.id, 'amostra'), 1]), notices);
  });
}

renderCart();
