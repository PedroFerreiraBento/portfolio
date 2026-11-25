const books = [
  { id:'CC-01', name:'Os quintais suspensos', author:'Lia Vilar', genre:'Contos', pages:112, art:'quintais',
    intent:['rapida','conversa'], synopsis:'Doze apartamentos, um varal coletivo e pequenos dramas que atravessam as janelas.', hard:true },
  { id:'CC-02', name:'À margem da volta', author:'Raul Teixeira Luz', genre:'Romance', pages:264, art:'margem',
    intent:['mergulho','conversa'], synopsis:'Um barqueiro volta ao povoado de infância e descobre que alguém passou anos guardando suas cartas.', hard:true },
  { id:'CC-03', name:'O avesso dos dias lentos', author:'Inês Sampaio Vale', genre:'Crônicas', pages:144, art:'dias',
    intent:['rapida'], synopsis:'Crônicas sobre sementes, calendários e a delicada arte de deixar uma tarde em aberto.', hard:false },
];
const editions = {
  B: { title:'Brochura', detail:'Capa flexível com orelhas e papel de leitura.' },
  D: { title:'Capa dura', detail:'Capa rígida revestida em tecido e marcador de fita.' },
};
const notes = ['Uma história para você','Para lermos juntos','Sem bilhete'];
const items = books.flatMap(book => (book.hard ? ['B','D'] : ['B']).flatMap(code => {
  const sku = book.id + '-' + code;
  const edition = editions[code].title;
  return [
    { key:sku, sku, book, detail:edition },
    ...notes.map((note, index) => ({key:sku + '-KIT-' + index, sku, book, detail:edition + ' · embrulho lilás · ' +
      (index === 2 ? note : 'bilhete “' + note + '”') })),
  ];
}));
const pick = selector => document.querySelector(selector);
const mode = document.body.dataset.version;
const cartKey = 'contracapa-cotacao-v1';
const list = pick('[data-items]');
const preview = pick('[data-preview]');
const message = pick('[data-message]');
const simulate = pick('[data-simulate]');
const status = pick('[data-status]');
const copyStatus = pick('[data-copy-status]');
let cart = {};
try {
  const stored = JSON.parse(sessionStorage.getItem(cartKey)) || {};
  cart = Object.fromEntries(items.flatMap(({key}) => Number.isInteger(stored[key]) &&
    stored[key] > 0 && stored[key] <= 99 ? [[key, stored[key]]] : []));
} catch {}

function hidePreview() {
  preview.hidden = true;
  simulate.setAttribute('aria-expanded','false');
  copyStatus.textContent = '';
}

function add(entries, notice) {
  if (entries.some(([key, count]) => (cart[key] || 0) + count > 99)) {
    notice.textContent = 'Cada versão do produto aceita até 99 unidades. Ajuste a quantidade.';
    return false;
  }
  entries.forEach(([key,count]) => { cart[key] = (cart[key] || 0) + count; });
  hidePreview();
  sync();
  notice.textContent = 'Adicionado à lista para cotação.';
  return true;
}

function sync() {
  try { sessionStorage.setItem(cartKey, JSON.stringify(cart)); } catch {}
  const selected = items.filter(item => cart[item.key]);
  list.replaceChildren(...selected.map(item => {
    const row = document.createElement('li');
    row.innerHTML = '<div><strong></strong><small></small></div><div class="counter"><button type="button">−</button><output></output><button type="button">+</button></div><button class="plain remove" type="button">Remover</button>';
    row.querySelector('strong').textContent = item.book.name;
    row.querySelector('small').textContent = item.detail + ' · ' + item.sku;
    row.querySelector('output').textContent = cart[item.key];
    const buttons = row.querySelectorAll('button');
    buttons[0].disabled = cart[item.key] === 1;
    buttons[1].disabled = cart[item.key] === 99;
    buttons.forEach((button, index) => {
      button.setAttribute('aria-label', ['Diminuir','Aumentar','Remover'][index] + ' ' + item.book.name + ', ' + item.detail);
      button.addEventListener('click', () => {
        if (index === 2) delete cart[item.key];
        else cart[item.key] += index === 0 ? -1 : 1;
        hidePreview();
        sync();
        const updated = list.children[selected.indexOf(item)];
        const next = index === 2 ? updated?.querySelector('button:not(:disabled)') : updated?.querySelectorAll('button')[index];
        (next && !next.disabled ? next : updated?.querySelector('button:not(:disabled)') || pick('.list-link')).focus();
        status.textContent = index === 2 ? 'Produto removido.' : 'Quantidade atualizada.';
      });
    });
    return row;
  }));
  const count = selected.reduce((total, item) => total + cart[item.key], 0);
  pick('[data-count]').textContent = count;
  pick('[data-empty]').hidden = selected.length > 0;
  pick('[data-review]').hidden = selected.length === 0;
}

simulate.addEventListener('click', () => {
  const lines = items.filter(item => cart[item.key]).map(item =>
    cart[item.key] + ' × ' + item.book.name + ' — ' + item.detail + ' · ' + item.sku);
  message.textContent = ['Olá, Casa Contracapa! Gostaria de cotar esta lista:', '', ...lines, '', 'Podem informar os preços e a disponibilidade?'].join('\n');
  preview.hidden = false;
  simulate.setAttribute('aria-expanded','true');
  pick('#mensagem').focus();
});
pick('[data-copy]').addEventListener('click', async () => {
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
pick('[data-edit]').addEventListener('click', () => {
  hidePreview();
  list.querySelector('button:not(:disabled)')?.focus();
});
pick('[data-clear]').addEventListener('click', () => {
  cart = {};
  hidePreview();
  sync();
  status.textContent = 'Lista limpa.';
  pick('.list-link').focus();
});

if (mode === 'estante') {
  const shelf = pick('[data-books]');
  const cards = books.map(book => {
    const card = document.createElement('article');
    card.className = 'book';
    card.innerHTML = '<figure class="cover" aria-hidden="true"><img width="720" height="720" loading="lazy" alt=""><figcaption></figcaption></figure><div><h3></h3><small></small><p></p><span class="spec"></span><button class="primary" type="button">Adicionar brochura</button><p role="status"></p></div>';
    card.querySelector('figure').classList.add(book.art);
    card.querySelector('img').src = book.art + '.webp';
    card.querySelector('figcaption').textContent = book.name;
    card.querySelector('h3').textContent = book.name;
    card.querySelector('small').textContent = book.author + ' · ' + book.genre;
    card.querySelector('p').textContent = book.synopsis;
    card.querySelector('.spec').textContent = book.pages + ' páginas · Brochura';
    const button = card.querySelector('button');
    button.setAttribute('aria-label','Adicionar brochura de ' + book.name);
    button.addEventListener('click', () => add([[book.id+'-B',1]],card.querySelector('[role=status]')));
    return card;
  });
  shelf.append(...cards);
  function filter(value) {
    cards.forEach((card, index) => { card.hidden = value !== 'todas' && !books[index].intent.includes(value); });
    const count = cards.filter(card => !card.hidden).length;
    pick('[data-filter]').textContent = count === 1 ? '1 título' : count + ' títulos';
  }
  for (const input of document.querySelectorAll('[name=intencao]')) {
    input.addEventListener('change', () => filter(input.value));
  }
  filter('todas');
}

if (mode === 'presente') {
  const gift = pick('[data-gift]');
  const fields = gift.elements;
  const notice = pick('[data-gift-status]');
  books.forEach(book => fields.titulo.add(new Option(book.name, book.id)));
  function updateEditions() {
    const book = books.find(current => current.id === fields.titulo.value);
    const old = fields.edicao.value;
    fields.edicao.replaceChildren(...(book.hard ? ['B','D'] : ['B'])
      .map(code => new Option(editions[code].title, code)));
    if (book.hard && old === 'D') fields.edicao.value = old;
  }
  function paintGift() {
    const book = books.find(current => current.id === fields.titulo.value);
    const edition = editions[fields.edicao.value];
    pick('[data-edition]').textContent = edition.detail;
    pick('[data-gift-title]').textContent = book.name + ' · ' + edition.title;
    const note = pick('[data-note]');
    note.textContent = fields.bilhete.value;
    note.hidden = fields.bilhete.value === 'Sem bilhete';
    notice.textContent = '';
  }
  updateEditions();
  paintGift();
  gift.addEventListener('change', event => {
    if (event.target === fields.titulo) updateEditions();
    paintGift();
  });
  gift.addEventListener('submit', event => {
    event.preventDefault();
    const key = [fields.titulo.value, fields.edicao.value, 'KIT', notes.indexOf(fields.bilhete.value)].join('-');
    add([[key, fields.quantidade.valueAsNumber]], notice);
  });
}

if (mode === 'clube') {
  const form = pick('[data-club]');
  const search = pick('[data-search]');
  const notice = pick('[data-club-status]');
  const readers = form.elements.leitores;
  const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  const rows = books.map(book => {
    const row = document.createElement('tr');
    row.innerHTML = '<th scope="row"><strong></strong><small></small></th><td><input type="number" min="0" max="99" step="1" value="0" inputmode="numeric" required></td>';
    row.querySelector('strong').textContent = book.name;
    row.querySelector('small').textContent = book.id + '-B · ' + book.pages + ' páginas';
    row.querySelector('input').setAttribute('aria-label', 'Exemplares de ' + book.name);
    return row;
  });
  pick('[data-club-rows]').append(...rows);
  const inputs = rows.map(row => row.querySelector('input'));
  function filter() {
    const term = normalize(search.value);
    rows.forEach((row,index) => { row.hidden = !normalize(books[index].name + ' ' + books[index].id + '-B').includes(term); });
    pick('[data-no-results]').hidden = rows.some(row => !row.hidden);
  }
  function updateCount() {
    const count = inputs.reduce((total,input) => total + (input.validity.valid ? input.valueAsNumber : 0),0);
    let label = count + (count === 1 ? ' exemplar planejado' : ' exemplares planejados');
    if (readers.validity.valid) label += ' para ' + readers.value + (readers.value === '1' ? ' leitor' : ' leitores');
    pick('[data-club-total]').textContent = label;
  }
  search.addEventListener('input', filter);
  form.addEventListener('input', () => { updateCount(); notice.textContent = ''; });
  form.noValidate = true;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = [readers, ...inputs].find(input => !input.validity.valid);
    if (invalid) {
      if (invalid.closest('tr')?.hidden) { search.value=''; filter(); }
      invalid.reportValidity();
      return;
    }
    const entries = inputs.flatMap((input,index) => input.valueAsNumber > 0
      ? [[books[index].id + '-B', input.valueAsNumber]] : []);
    if (!entries.length) { notice.textContent = 'Informe pelo menos um exemplar.'; return; }
    if (add(entries, notice)) {
      inputs.forEach(input => { input.value = 0; });
      updateCount();
    }
  });
  updateCount();
}
sync();
