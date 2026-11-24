(() => {
 const form = document.querySelector('.intake');
 const receipt = document.querySelector('.receipt');
 const piece = form.querySelector('#piece');
 const width = form.querySelector('#width');
 const height = form.querySelector('#height');
 const finish = form.querySelector('#finish');
 const visit = form.querySelector('#visit');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const notice = receipt.querySelector('.copy-status');
 const message = receipt.querySelector('[data-message]');
 const drawing = document.querySelector('[data-drawing]');
 const lab = document.querySelector('[data-lab]');
 let serial = 0;

 function hideReceipt() {
  receipt.hidden = true;
  notice.textContent = '';
 }
 function measure(input) {
  return input.value && input.validity.valid ? input.valueAsNumber.toLocaleString('pt-BR') + ' cm' : 'A medir';
 }
 function updateDrawing() {
  if (!drawing) return;
  drawing.dataset.piece = piece.value || 'divisoria';
  document.querySelector('[data-drawing-piece]').textContent = piece.value ? piece.selectedOptions[0].textContent : 'Peça a definir';
  drawing.querySelector('[data-drawing-width]').textContent = measure(width);
  drawing.querySelector('[data-drawing-height]').textContent = measure(height);
  const ratio = width.valueAsNumber / height.valueAsNumber;
  const valid = width.validity.valid && height.validity.valid && Number.isFinite(ratio) && ratio > 0;
  drawing.style.setProperty('--draw-width', valid ? Math.max(30, Math.min(86, ratio * 70)) + '%' : '70%');
  drawing.style.setProperty('--draw-height', valid ? Math.max(34, Math.min(88, 74 / ratio)) + '%' : '82%');
  document.querySelector('[data-drawing-note]').textContent = 'Largura: ' + measure(width) + ' · Altura: ' + measure(height) + '. Esquema ilustrativo, fora de escala.';
 }
 if (lab) {
  const descriptions = {
   transparente:['Transparente','Mantém formas e contornos mais nítidos dos dois lados. Observe os objetos e a luz de fundo.'],
   fosco:['Fosco','Suaviza os contornos de objetos do outro lado. Observe como a imagem fica menos definida.'],
   canelado:['Canelado','Cria faixas verticais que alteram a leitura dos contornos. Compare linhas retas, sombras e áreas iluminadas.']
  };
  const slider = document.querySelector('#coverage');
  const buttons = [...document.querySelectorAll('[data-sample]')];
  function setSplit() {
   lab.style.setProperty('--split', slider.value + '%');
   slider.setAttribute('aria-valuetext',slider.value + '% da cena à esquerda');
  }
  slider.addEventListener('input',setSplit);
  buttons.forEach(button => button.addEventListener('click', () => {
   const key = button.dataset.sample;
   const [title,copy] = descriptions[key];
   lab.dataset.finish = key;
   buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
   lab.querySelector('[data-sample-label]').textContent = title;
   document.querySelector('[data-sample-title]').textContent = title;
   document.querySelector('[data-sample-copy]').textContent = copy;
   document.querySelector('[data-choose-finish]').dataset.chooseFinish = key;
  }));
  setSplit();
 }

 submit.disabled = false;
 example.hidden = false;
 updateDrawing();
 form.addEventListener('input', () => { hideReceipt(); updateDrawing(); });
 document.querySelectorAll('[data-choose-piece],[data-choose-finish]').forEach(link => link.addEventListener('click', () => {
  if (link.dataset.choosePiece) piece.value = link.dataset.choosePiece;
  if (link.dataset.chooseFinish) finish.value = link.dataset.chooseFinish;
  hideReceipt();
  updateDrawing();
 }));
 example.addEventListener('click', () => {
  if (!piece.value) piece.value = 'divisoria';
  if (!width.value) width.value = '120';
  if (!height.value) height.value = '210';
  if (!finish.value) finish.value = 'transparente';
  if (!visit.value) visit.value = 'visita';
  hideReceipt();
  updateDrawing();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const code = 'PC-DEMO-' + String(++serial).padStart(3,'0');
  const measures = 'Largura: ' + measure(width) + ' · Altura: ' + measure(height);
  const pieceName = piece.selectedOptions[0].textContent;
  const finishName = finish.selectedOptions[0].textContent;
  const visitName = visit.selectedOptions[0].textContent;
  receipt.querySelector('[data-code]').textContent = code;
  receipt.querySelector('[data-piece-summary]').textContent = pieceName;
  receipt.querySelector('[data-measures-summary]').textContent = measures;
  receipt.querySelector('[data-finish-summary]').textContent = finishName;
  receipt.querySelector('[data-visit-summary]').textContent = visitName;
  message.textContent = 'Olá! Gostaria de conversar sobre: ' + pieceName + '. ' + measures + '. Referência de acabamento: ' + finishName + '. Etapa: ' + visitName + '.';
  notice.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {hideReceipt();piece.focus();});
 receipt.querySelector('[data-reset]').addEventListener('click', () => {form.reset();hideReceipt();updateDrawing();piece.focus();});
 receipt.querySelector('[data-copy]').addEventListener('click',async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   notice.textContent = 'Pedido copiado.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   notice.textContent = 'Mensagem selecionada para copiar.';
  }
 });
})();
