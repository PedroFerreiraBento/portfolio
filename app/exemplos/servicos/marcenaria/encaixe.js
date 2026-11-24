(() => {
 const rooms = {
  cozinha:{label:'Cozinha',alt:'Cozinha sob medida em freijó com ilha e bancada clara',spots:[
   ['Armários da bancada','Organizar o que mais se usa perto das áreas de preparo e cocção evita percursos desnecessários.','25%','42%'],
   ['Ilha e passagem','A ilha pode concentrar preparo e armazenamento. Convém observar a passagem e a abertura das portas ao redor.','60%','72%']]},
  sala:{label:'Sala e estante',alt:'Estante baixa de nogueira com nichos e armários fechados',spots:[
   ['Nichos à vista','Objetos e livros ganham lugar nos nichos. O tamanho das peças ajuda a decidir a divisão das prateleiras.','67%','36%'],
   ['Parte fechada','Portas baixas ajudam a guardar eletrônicos e itens de uso menos frequente. Cabos e pontos de energia entram na conversa.','51%','74%']]},
  escritorio:{label:'Escritório',alt:'Bancada de trabalho com armários e prateleiras de madeira',spots:[
   ['Bancada de trabalho','A superfície precisa acomodar os equipamentos usados na rotina. Observe também a posição das tomadas.','56%','63%'],
   ['Armários altos','A parte mais alta pode receber itens pouco usados. Deixe o que acessa todo dia ao alcance.','74%','37%']]}
 };
 const finishes = {
  freijo:{title:'Freijó natural',alt:'Detalhe da fibra natural de freijó em painéis de marcenaria',caption:'Madeira · veios aparentes',copy:'De tom quente e veios visíveis, combina com tecidos e pedras claras. A variação natural do desenho faz parte da superfície.',look:'Quente e claro',use:'Estantes, portas e painéis'},
  nogueira:{title:'Nogueira escura',alt:'Detalhe da lâmina escura de nogueira com veios longos',caption:'Madeira · veios escuros',copy:'A nogueira cria contraste com paredes claras e dá profundidade à composição. Vale ver a amostra sob a iluminação que o móvel vai receber.',look:'Escuro e contrastante',use:'Painéis, estantes e frentes'},
  verde:{title:'Laca verde fosca',alt:'Frentes de móvel em laca verde fosca com junta fina',caption:'Laca · cor lisa',copy:'A cor uniforme reduz o contraste entre as frentes. Na escolha final, compare a amostra com o piso e com a luz natural do ambiente.',look:'Verde oliva suave',use:'Portas e frentes de gaveta'}
 };
 const request = document.querySelector('.brief');
 const room = request.querySelector('#room');
 const width = request.querySelector('#width');
 const height = request.querySelector('#height');
 const material = request.querySelector('#material');
 const stage = request.querySelector('#stage');
 const submit = request.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const receipt = document.querySelector('.receipt');
 const status = receipt.querySelector('.copy-status');
 const message = receipt.querySelector('[data-message]');
 const drawing = document.querySelector('.drawing-body');
 let sequence = 0;

 function swapPhoto(image, key, alt) {
  image.src = key + '-720.webp';
  image.srcset = key + '-720.webp 720w, ' + key + '-1440.webp 1440w';
  image.alt = alt;
 }
 function hideReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function dimension(field) {
  return field.value && field.validity.valid ? field.value + ' cm' : 'A medir';
 }
 function renderDrawing() {
  if (!drawing) return;
  drawing.querySelector('[data-drawing-width]').textContent = dimension(width);
  drawing.querySelector('[data-drawing-height]').textContent = dimension(height);
  drawing.classList.toggle('has-measures', Boolean((width.value && width.validity.valid) || (height.value && height.validity.valid)));
  drawing.parentElement.setAttribute('aria-label','Esquema fora de escala. Largura: ' + dimension(width) + '. Altura: ' + dimension(height) + '.');
 }

 const tour = document.querySelector('.room-tour');
 if (tour) {
  const switches = [...tour.querySelectorAll('button[data-room]')];
  const spots = [...tour.querySelectorAll('[data-hotspot]')];
  const figure = tour.querySelector('.tour-photo');
  let activeRoom = 'cozinha';
  function selectSpot(index) {
   const spot = rooms[activeRoom].spots[index];
   tour.querySelector('[data-spot-title]').textContent = spot[0];
   tour.querySelector('[data-spot-copy]').textContent = spot[1];
   spots.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
  function selectRoom(key) {
   activeRoom = key;
   const data = rooms[key];
   swapPhoto(figure.querySelector('img'),key,data.alt);
   tour.querySelector('[data-room-name]').textContent = data.label;
   tour.querySelector('[data-use-room]').dataset.useRoom = key;
   switches.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.room === key)));
   data.spots.forEach(([label, , x, y], i) => {
    spots[i].setAttribute('aria-label',label);
    const letter = i === 0 ? 'a' : 'b';
    figure.style.setProperty('--spot-' + letter + '-left',x);
    figure.style.setProperty('--spot-' + letter + '-top',y);
   });
   selectSpot(0);
  }
  switches.forEach(button => button.addEventListener('click', () => selectRoom(button.dataset.room)));
  spots.forEach((button, index) => button.addEventListener('click', () => selectSpot(index)));
  selectRoom('cozinha');
 }
 const library = document.querySelector('.material-library');
 if (library) {
  const samples = [...library.querySelectorAll('[data-finish]')];
  function selectFinish(key) {
   const data = finishes[key];
   swapPhoto(library.querySelector('.texture img'),key,data.alt);
   for (const field of ['title','copy','look','use']) library.querySelector('[data-finish-' + field + ']').textContent = data[field];
   library.querySelector('[data-sample-caption]').textContent = data.caption;
   library.querySelector('[data-use-finish]').dataset.useFinish = key;
   samples.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.finish === key)));
  }
  samples.forEach(button => button.addEventListener('click', () => selectFinish(button.dataset.finish)));
 }

 submit.disabled = false;
 example.hidden = false;
 renderDrawing();
 request.addEventListener('input', () => {
  renderDrawing();
  hideReceipt();
 });
 request.addEventListener('change', hideReceipt);
 document.querySelectorAll('[data-use-room],[data-use-finish]').forEach(link => {
  link.addEventListener('click', () => {
   if (link.dataset.useRoom) room.value = link.dataset.useRoom;
   if (link.dataset.useFinish) material.value = link.dataset.useFinish;
   hideReceipt();
  });
 });
 example.addEventListener('click', () => {
  if (!room.value) room.value = 'cozinha';
  if (!width.value) width.value = '240';
  if (!height.value) height.value = '220';
  if (!material.value) material.value = 'freijo';
  if (!stage.value) stage.selectedIndex = 2;
  renderDrawing();
  hideReceipt();
  submit.focus();
 });
 request.addEventListener('submit', event => {
  event.preventDefault();
  if (!request.reportValidity()) return;
  const roomLabel = room.selectedOptions[0].textContent;
  const materialLabel = material.selectedOptions[0].textContent;
  const measure = 'Largura: ' + dimension(width) + ' · Altura: ' + dimension(height);
  receipt.querySelector('[data-ref]').textContent = 'EC-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-room-summary]').textContent = roomLabel;
  receipt.querySelector('[data-measure-summary]').textContent = measure;
  receipt.querySelector('[data-material-summary]').textContent = materialLabel;
  receipt.querySelector('[data-stage-summary]').textContent = stage.value;
  message.textContent = 'Olá! Gostaria de conversar sobre um móvel sob medida. Ambiente: ' + roomLabel + '. ' + measure + '. Acabamento: ' + materialLabel + '. Etapa: ' + stage.value + '.';
  status.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {hideReceipt();room.focus();});
 receipt.querySelector('[data-reset]').addEventListener('click', () => {request.reset();hideReceipt();renderDrawing();room.focus();});
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   status.textContent = 'Briefing copiado.';
  } catch {
   const range = document.createRange();
   range.selectNodeContents(message);
   const selection = window.getSelection();
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Briefing selecionado para copiar.';
  }
 });
})();
