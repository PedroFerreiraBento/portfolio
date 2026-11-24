(() => {
 const photoData = document.querySelector('#photo-data');
 if (photoData) {
  const photos = JSON.parse(photoData.textContent);
  const stage = document.querySelector('.film-stage');
  const viewer = document.querySelector('.viewer');
  const full = viewer.querySelector('[data-full]');
  const title = viewer.querySelector('#viewer-title');
  const count = viewer.querySelector('[data-view-count]');
  const previous = viewer.querySelector('[data-prev]');
  const next = viewer.querySelector('[data-next]');
  const close = viewer.querySelector('[data-close]');
  const sceneButtons = [...document.querySelectorAll('[data-film]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const gridItems = [...document.querySelectorAll('[data-group]')];
  let visible = photos;
  let selected = 0;
  let origin;

  function displayPhoto() {
   const photo = visible[selected];
   full.src = photo.id + '-1440.webp';
   full.alt = photo.alt;
   title.textContent = photo.title;
   count.textContent = (selected + 1) + ' / ' + visible.length;
   previous.disabled = selected === 0;
   next.disabled = selected === visible.length - 1;
  }

  function moveBy(step) {
   const destination = selected + step;
   if (destination < 0 || destination >= visible.length) return;
   selected = destination;
   displayPhoto();
  }

  document.querySelectorAll('[data-open]').forEach(button => {
   button.addEventListener('click', () => {
    selected = visible.findIndex(photo => photo.id === button.dataset.open);
    if (selected < 0) return;
    origin = button;
    displayPhoto();
    viewer.showModal();
    close.focus();
   });
  });
  previous.addEventListener('click', () => moveBy(-1));
  next.addEventListener('click', () => moveBy(1));
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('keydown', event => {
   if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
   event.preventDefault();
   moveBy(event.key === 'ArrowLeft' ? -1 : 1);
  });
  viewer.addEventListener('close', () => origin?.focus());

  function chooseScene(button) {
   const photo = photos.find(item => item.id === button.dataset.film);
   const stagePhoto = stage.querySelector('.film-frame img');
   stagePhoto.src = photo.id + '-720.webp';
   stagePhoto.srcset = photo.id + '-720.webp 720w, ' + photo.id + '-1440.webp 1440w';
   stagePhoto.alt = photo.alt;
   stage.querySelector('[data-film-caption]').textContent = photo.title;
   stage.querySelector('[data-open]').dataset.open = photo.id;
   sceneButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }
  sceneButtons.forEach(button => button.addEventListener('click', () => chooseScene(button)));

  filters.forEach(button => button.addEventListener('click', () => {
   const group = button.dataset.filter;
   visible = group === 'todas' ? photos : photos.filter(photo => photo.group === group);
   gridItems.forEach(item => item.hidden = group !== 'todas' && item.dataset.group !== group);
   filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
   document.querySelector('[data-count]').textContent = visible.length + ' fotografias';
  }));
 }

 const form = document.querySelector('.request');
 const session = form.querySelector('#session');
 const focus = form.querySelector('#focus');
 const focusLabel = form.querySelector('[data-focus-label]');
 const date = form.querySelector('#date');
 const place = form.querySelector('#place');
 const example = form.querySelector('[data-example]');
 const submit = form.querySelector('[type=submit]');
 const receipt = document.querySelector('.receipt');
 const notice = receipt.querySelector('.copy-status');
 const message = receipt.querySelector('[data-message]');
 let sequence = 0;
 const topics = {
  casamento:{label:'Que parte quer guardar?',choices:['Cerimônia e celebração','Bastidores e cerimônia','A cobertura inteira']},
  familia:{label:'Como imagina o ensaio?',choices:['Uma manhã em casa','Um encontro ao ar livre','Prefiro conversar sobre o lugar']},
  retrato:{label:'Onde as fotos serão usadas?',choices:['Apresentação do meu trabalho','Site e redes profissionais','Quero decidir na conversa']}
 };
 function syncFocus() {
  const topic = topics[session.value];
  focus.disabled = !topic;
  focusLabel.textContent = topic?.label || 'O que quer fotografar?';
  focus.replaceChildren(new Option(topic ? 'Selecione uma opção' : 'Escolha a sessão primeiro',''), ...(topic?.choices || []).map(choice => new Option(choice,choice)));
 }

 function hideReceipt() {
  receipt.hidden = true;
  notice.textContent = '';
 }

 function chooseSession(value) {
  if (session.value === value) return;
  session.value = value;
  syncFocus();
 }

 submit.disabled = false;
 example.hidden = false;
 syncFocus();
 form.addEventListener('change', event => {
  if (event.target === session) syncFocus();
  hideReceipt();
 });
 document.querySelectorAll('a[data-session]').forEach(link => {
  link.addEventListener('click', () => {
   chooseSession(link.dataset.session);
   hideReceipt();
  });
 });
 example.addEventListener('click', () => {
  if (!session.value) chooseSession('casamento');
  if (!focus.value) focus.selectedIndex = 1;
  if (!place.value) place.value = 'Campinas';
  hideReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const sessionName = session.selectedOptions[0].textContent;
  const dateText = date.value ? date.value.split('-').reverse().join('/') : 'A combinar';
  receipt.querySelector('[data-ref]').textContent = 'AA-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-session-summary]').textContent = sessionName;
  receipt.querySelector('[data-focus-summary]').textContent = focus.value;
  receipt.querySelector('[data-date-summary]').textContent = dateText;
  receipt.querySelector('[data-place-summary]').textContent = place.value;
  message.textContent = 'Olá! Quero conversar sobre ' + sessionName.toLocaleLowerCase('pt-BR') + '. Preferência: ' + focus.value + '. Data: ' + dateText + '. Região: ' + place.value + '.';
  notice.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  hideReceipt();
  session.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  syncFocus();
  hideReceipt();
  session.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   notice.textContent = 'Briefing copiado.';
  } catch {
   const range = document.createRange();
   range.selectNodeContents(message);
   const selection = window.getSelection();
   selection.removeAllRanges();
   selection.addRange(range);
   notice.textContent = 'Briefing selecionado para copiar.';
  }
 });
})();
