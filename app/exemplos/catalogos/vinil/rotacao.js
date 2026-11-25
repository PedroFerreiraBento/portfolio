const records = [
  { id:'RD-01', name:'A rua fica acesa', artist:'Luma Valverde Trio', genre:'Samba-jazz', tag:'samba', art:'rua', note:'Piano, baixo e percussão em arranjos de balanço contido.', editions:[
    ['1982', 'Edição brasileira', 'LP · 33 rpm', 'VG+', 'VG', 'Leves marcas no vinil; desgaste visível nas quinas da capa.'],
    ['2021', 'Reedição brasileira', 'LP · 33 rpm', 'NM', 'NM', 'Vinil e capa com pouquíssimos sinais de manuseio.'],
  ] },
  { id:'RD-02', name:'Entre marés', artist:'Pedro Sal e Ondas', genre:'Ambient', tag:'ambient', art:'mares', note:'Camadas de sintetizador e ruídos suaves de fita.', editions:[
    ['1991', 'Edição portuguesa', 'LP · 33 rpm', 'VG', 'VG+', 'Marcas visíveis no disco. Capa com leve desgaste de borda.'],
    ['2023', 'Reedição brasileira', 'LP duplo · 45 rpm', 'NM', 'VG+', 'Discos com pouquíssimos sinais de manuseio; capa com marca discreta de quina.'],
  ] },
  { id:'RD-03', name:'Passo de dentro', artist:'Jana Doca', genre:'Groove', tag:'groove', art:'passo', note:'Baixo marcado, metais curtos e batidas de rua.', editions:[
    ['1978', 'Edição brasileira', 'LP · 33 rpm', 'VG+', 'VG+', 'Leves marcas de manuseio no disco e na capa.'],
    ['2020', 'Reedição brasileira', 'LP · 33 rpm', 'NM', 'VG+', 'Disco com poucos sinais de uso; capa com marcas leves de armazenamento.'],
  ] },
];
const editions = records.flatMap(album => album.editions.map(([year,label,format,record,jacket,note],index) => ({
  id: album.id + (index === 0 ? '-A' : '-B'), album, year, label, format, record, jacket, note,
})));
const select = selector => document.querySelector(selector);
const storageKey = 'rotacao-discos-lista-v1';
const cart = new Map();
const list = select('[data-items]');
const status = select('[data-status]');
const simulate = select('[data-simulate]');
const preview = select('[data-preview]');
const message = select('[data-message]');
const copyStatus = select('[data-copy-status]');

try {
  const saved = JSON.parse(sessionStorage.getItem(storageKey));
  for (const edition of editions) {
    const value = saved?.[edition.id];
    if (Number.isInteger(value) && value > 0 && value <= 99) cart.set(edition.id, value);
  }
} catch {}

function hideMessage() {
  preview.hidden = true;
  simulate.setAttribute('aria-expanded', 'false');
  copyStatus.textContent = '';
}

function addToCart(entries, notice) {
  if (entries.some(([key, count]) => (cart.get(key) || 0) + count > 99)) {
    notice.textContent = 'O limite é de 99 por edição. Reduza a quantidade na lista.';
    return;
  }
  for (const [key, count] of entries) cart.set(key, (cart.get(key) || 0) + count);
  hideMessage();
  renderCart();
  notice.textContent = entries.length === 1 ? 'Seleção adicionada à lista.' : 'Discos adicionados à lista.';
}

function getCartRows() {
  return editions.filter(edition => cart.has(edition.id)).map(edition => ({
    key: edition.id, product: edition.album, format: edition.label + ' · ' + edition.year + ' · ' + edition.format, count: cart.get(edition.id),
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
    row.querySelector('small').textContent = key + ' · ' + format;
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
  const lines = getCartRows().map(({ key, product, format, count }) =>
    count + ' × ' + product.name + ' · ' + key + ' · ' + format);
  message.textContent = ['Olá, Rotação Discos! Gostaria de cotar estes itens:', '', ...lines, '', 'Podem confirmar os preços e a disponibilidade?'].join('\n');
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


function albumCover(record) {
  const figure = document.createElement('figure');
  figure.className = 'sleeve ' + record.art;
  const image = new Image(512, 512);
  image.src = record.art + '.webp';
  image.alt = '';
  image.loading = 'lazy';
  const caption = document.createElement('figcaption');
  caption.textContent = record.name;
  figure.append(image, caption);
  return figure;
}

if (document.body.classList.contains('garimpo')) {
  const shelf = select('[data-albums]');
  const cards = records.map(record => {
    const card = document.createElement('article');
    card.className = 'album';
    card.innerHTML = '<div><h3></h3><p class="credit"></p><p></p><small></small><button class="primary" type="button">Adicionar reedição</button><p role="status"></p></div>';
    card.prepend(albumCover(record));
    card.querySelector('h3').textContent = record.name;
    const [credit, note, status] = card.querySelectorAll('p');
    credit.textContent = record.artist + ' · ' + record.genre;
    note.textContent = record.note;
    const edition = editions.find(item => item.id === record.id + '-B');
    card.querySelector('small').textContent = edition.year + ' · ' + edition.format + ' · ' + edition.id;
    const button = card.querySelector('button');
    button.setAttribute('aria-label', 'Adicionar reedição de ' + record.name);
    button.addEventListener('click', () => addToCart([[edition.id, 1]], status));
    return card;
  });
  shelf.append(...cards);
  function filter() {
    const genre = select('[name=genero]:checked').value;
    cards.forEach((card, i) => { card.hidden = genre !== 'todos' && genre !== records[i].tag; });
    const count = cards.filter(card => !card.hidden).length;
    select('[data-filter]').textContent = count + (count === 1 ? ' disco' : ' discos');
  }
  document.querySelectorAll('[name=genero]').forEach(radio => radio.addEventListener('change', filter));
  filter();
}

if (document.body.classList.contains('prensagem')) {
  const control = select('[data-press-title]');
  const comparison = select('[data-press-options]');
  records.forEach(record => control.add(new Option(record.name, record.id)));
  function compare() {
    const chosen = editions.filter(edition => edition.album.id === control.value);
    const fields = [['Ano','year'], ['Formato','format'], ['Estado do vinil','record'], ['Estado da capa','jacket'], ['Código','id']];
    comparison.replaceChildren(...chosen.map(edition => {
      const card = document.createElement('article');
      card.className = 'press-card';
      card.innerHTML = '<h3></h3><dl></dl><p></p><button class="primary" type="button">Adicionar esta edição</button><p role="status"></p>';
      card.querySelector('h3').textContent = edition.label;
      for (const [label,key] of fields) {
        const row = document.createElement('div');
        const term = document.createElement('dt');
        term.textContent = label;
        const value = document.createElement('dd');
        value.textContent = edition[key];
        row.append(term,value);
        card.querySelector('dl').append(row);
      }
      card.querySelector('p').textContent = edition.note;
      const button = card.querySelector('button');
      button.setAttribute('aria-label','Adicionar ' + edition.label.toLowerCase() + ' de ' + edition.year);
      button.addEventListener('click', () => addToCart([[edition.id,1]],card.querySelector('[role=status]')));
      return card;
    }));
  }
  control.addEventListener('change',compare);
  compare();
}

if (document.body.classList.contains('sessao')) {
  const form = select('[data-session]');
  const queue = select('[data-queue]');
  const notice = select('[data-session-status]');
  const sessions = {
    janela: ['Janela aberta','Comece com o trio, passe pelo baixo marcado e encerre com texturas de fita.', [0,2,1]],
    mesa: ['Fim de tarde à mesa','Abra com o baixo e os metais, ceda lugar ao piano e deixe o som mais leve no fim.', [2,0,1]],
    luzes: ['Luzes baixas','Parta de uma escuta de texturas, siga para o piano e encerre no balanço da banda.', [1,0,2]],
  };
  const marked = new Set();
  function reorder() {
    const [title,note,order] = sessions[select('[name=sessao]:checked').value];
    select('[data-session-title]').textContent = title;
    select('[data-session-note]').textContent = note;
    notice.textContent = '';
    queue.replaceChildren(...order.map(index => {
      const record = records[index];
      const item = document.createElement('li');
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.name = 'disco';
      check.value = record.id + '-B';
      check.checked = marked.has(check.value);
      const label = document.createElement('label');
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      const genre = document.createElement('small');
      title.textContent = record.name;
      genre.textContent = record.genre + ' · reedição';
      copy.append(title,genre);
      label.append(check,albumCover(record),copy);
      item.append(label);
      return item;
    }));
  }
  form.addEventListener('change', event => {
    if (event.target.checked) marked.add(event.target.value);
    else marked.delete(event.target.value);
    notice.textContent = '';
  });
  document.querySelectorAll('[name=sessao]').forEach(control => control.addEventListener('change',reorder));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const entries = [...new FormData(form).getAll('disco')].map(id => [id,1]);
    if (!entries.length) { notice.textContent = 'Marque pelo menos um disco da sequência.'; return; }
    addToCart(entries,notice);
  });
  reorder();
}
renderCart();
