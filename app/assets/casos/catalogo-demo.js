(() => {
 const find = selector => document.querySelector(selector);
 const form = find('#catalog-form');
 const filters = [...document.querySelectorAll('[data-filter]')];
 const feedback = find('.catalog-feedback');
 const review = find('#catalog-review');
 const cart = find('#catalog-cart');
 const projectInput = find('#catalog-project-name');
 const total = find('#catalog-total');
 const tray = find('.catalog-mobile-tray');
 const download = find('#download');
 const sheet = find('#download-sheet');
 const products = [...form.querySelectorAll('[data-product]')].map(card => ({
  card,
  input: card.querySelector('input'),
  name: card.querySelector('h3').textContent,
  specs: [...card.querySelectorAll('.catalog-specs span,.catalog-usage')].map(spec => spec.textContent),
  controls: [...card.querySelectorAll('[data-quantity]')]
 }));

 function selectCategory(category) {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === category)));
  products.forEach(({card}) => { card.hidden = category !== 'todos' && card.dataset.category !== category; });
 }

 function quoteRows() {
  return products.filter(({input}) => input.validity.valid && input.valueAsNumber > 0).map(product => ({
   ...product,
   quantity: product.input.valueAsNumber,
   code: product.input.name
  }));
 }

 function summarize(rows) {
  const units = rows.reduce((sum, {quantity}) => sum + quantity, 0);
  return units + (units === 1 ? ' peça' : ' peças');
 }

 function refresh() {
  review.hidden = true;
  feedback.textContent = '';
  for (const link of [download, sheet]) {
   if (!link.hasAttribute('href')) continue;
   URL.revokeObjectURL(link.href);
   link.removeAttribute('href');
  }

  const rows = quoteRows();
  const units = summarize(rows);
  total.textContent = units + ' na cotação';
  find('#catalog-mobile-total').textContent = units + ' na seleção';
  tray.hidden = !rows.length;
  find('#catalog-empty').hidden = Boolean(rows.length);
  cart.hidden = !rows.length;
  cart.replaceChildren(...rows.map(row => {
   const item = document.createElement('li');
   const text = document.createElement('span');
   const remove = document.createElement('button');
   text.textContent = row.quantity + ' × ' + row.name;
   remove.type = 'button';
   remove.textContent = 'Remover';
   remove.setAttribute('aria-label', 'Remover ' + row.name);
   remove.addEventListener('click', () => {
    row.input.value = '0';
    refresh();
    find('#catalog-selection-title').focus();
   });
   item.append(text, remove);
   return item;
  }));
  products.forEach(({input, controls, card}) => {
   const quantity = input.valueAsNumber;
   card.classList.toggle('is-selected', input.validity.valid && quantity > 0);
   controls[0].disabled = !Number.isFinite(quantity) || quantity <= 0;
   controls[1].disabled = quantity >= Number(input.max);
  });
 }

 function setDownload(link, contents, type, name) {
  link.href = URL.createObjectURL(new Blob([contents], {type}));
  link.download = name;
 }

 function csvCell(value) {
  const text = String(value);
  const safe = /^\s*[=+@-]|^[\t\r\n]/u.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
 }

 filters.forEach(filter => filter.addEventListener('click', () => selectCategory(filter.dataset.filter)));
 products.forEach(({input, controls}) => controls.forEach(control => control.addEventListener('click', () => {
  const current = Math.trunc(input.valueAsNumber) || 0;
  input.value = String(Math.min(Number(input.max), Math.max(0, current + Number(control.dataset.quantity))));
  refresh();
 })));
 document.querySelectorAll('a[href="#catalog-selection"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  find('#catalog-selection-title').focus({preventScroll:true});
  find('#catalog-selection').scrollIntoView({block:'start'});
  if (link.closest('.catalog-mobile-tray')) tray.hidden = true;
 }));

 form.addEventListener('input', refresh);
 form.addEventListener('submit', event => {
  event.preventDefault();
  const invalid = products.find(({input}) => !input.validity.valid);
  if (invalid) {
   selectCategory('todos');
   feedback.textContent = 'Use números inteiros entre 0 e 999.';
   invalid.input.reportValidity();
   return;
  }
  const selected = quoteRows();
  if (!selected.length) {
   feedback.textContent = 'Adicione pelo menos uma peça para montar a cotação.';
   return;
  }
  const project = projectInput.value.trim();
  const date = new Intl.DateTimeFormat('pt-BR').format(new Date());
  const units = summarize(selected);
  find('#catalog-review-meta').textContent = [project, units, date].filter(Boolean).join(' · ');
  find('#catalog-items').replaceChildren(...selected.map(({quantity, name, code, specs}) => {
   const item = document.createElement('li');
   const title = document.createElement('strong');
   const detail = document.createElement('span');
   title.textContent = quantity + ' × ' + name;
   detail.textContent = [code, ...specs].join(' · ');
   item.append(title, detail);
   return item;
  }));
  const lines = [
   'Solicitação de cotação — catálogo demonstrativo Luz & Forma',
   date,
   ...(project ? ['Projeto: ' + project] : []),
   '',
   'Olá! Por favor, informe preços e prazos para as peças abaixo.',
   '',
   ...selected.flatMap(({quantity, name, code, specs}) => [quantity + ' × ' + name, [code, ...specs].join(' · ')]),
   '',
   units + ' na cotação'
  ];
  const headings = ['Código','Produto','Quantidade','Acabamento','Medidas','Indicação'];
  const csv = [
   [...headings, ...(project ? ['Projeto'] : [])],
   ...selected.map(({code,name,quantity,specs}) => [code,name,quantity,...specs,...(project ? [project] : [])])
  ].map(row => row.map(csvCell).join(';')).join('\r\n');

  refresh();
  setDownload(download, lines.join('\r\n'), 'text/plain;charset=utf-8', 'lista-de-cotacao.txt');
  setDownload(sheet, '\uFEFF' + csv, 'text/csv;charset=utf-8', 'lista-de-cotacao.csv');
  tray.hidden = true;
  review.hidden = false;
  feedback.textContent = 'Cotação pronta para compartilhar.';
  find('#catalog-review-title').focus();
 });
 find('.catalog-filters').hidden = false;
 form.querySelector('button[type=submit]').disabled = false;
 refresh();
})();

