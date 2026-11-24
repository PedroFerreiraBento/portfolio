(() => {
 const form = document.querySelector('.intake');
 const receipt = document.querySelector('.receipt');
 const summary = receipt.querySelector('[data-summary]');
 const message = receipt.querySelector('[data-message]');
 const copyStatus = receipt.querySelector('.copy-status');
 const carry = form.querySelector('[data-carry]');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const fields = Object.fromEntries([...form.querySelectorAll('select')].map(control => [control.id, control]));
 const map = document.querySelector('[data-yard-map]');
 let source = '';
 let sourceKind = '';
 let sequence = 0;

 function connectPicker(control, item) {
  const buttons = [...document.querySelectorAll('[data-' + control + ']')];
  const panels = [...document.querySelectorAll('[data-' + control + '-panel]')];
  buttons.forEach(button => button.addEventListener('click', () => {
   const selected = button.dataset[control];
   buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
   panels.forEach(panel => panel.hidden = panel.getAttribute('data-' + control + '-panel') !== selected);
   item?.(selected);
  }));
 }

 const calendar = {
  pontual: [['Visita a combinar','Entre visitas','Entre visitas','Retorno se preciso'],[0],'Uma visita a combinar, com retorno se necessário.'],
  mensal: [['Observação','Entre visitas','Entre visitas','Revisão do jardim'],[3],'Uma revisão no exemplo de quatro semanas.'],
  semanal: [['Visita','Visita','Visita','Visita'],[0,1,2,3],'Um encontro por semana neste exemplo.']
 };
 const weeks = [...document.querySelectorAll('[data-week]')];
 connectPicker('area');
 connectPicker('rhythm', rhythm => {
  const [labels, active, note] = calendar[rhythm];
  weeks.forEach((week,index) => {
   week.textContent = labels[index];
   week.parentElement.toggleAttribute('data-visit',active.includes(index));
  });
  document.querySelector('[data-calendar-note]').textContent = note;
 });
 weeks[3]?.parentElement.setAttribute('data-visit','');

 function updateMap() {
  if (!map) return;
  const types = {'Jardim ou quintal':'jardim','Varanda ou terraço':'varanda','Entrada ou corredor':'entrada'};
  const lights = {'Sol direto':'sol','Meia-sombra':'meia','Sombra predominante':'sombra'};
  map.dataset.space = types[fields.space.value] || '';
  map.dataset.light = lights[fields.light.value] || 'indefinida';
  document.querySelector('[data-map-space]').textContent = fields.space.value || 'Espaço a definir';
  document.querySelector('[data-map-status]').textContent = (fields.light.value || 'Luz em aberto') + ' · ' + (fields.size.value || 'tamanho em aberto');
 }

 function updateSource(label, kind = '') {
  source = label;
  sourceKind = kind;
  carry.textContent = label;
  carry.hidden = !label;
 }

 function clearReceipt() {
  receipt.hidden = true;
  copyStatus.textContent = '';
 }

 form.addEventListener('change', event => {
  if (event.target === fields.service && sourceKind === 'rhythm' && fields.service.value !== 'Manutenção') updateSource('');
  clearReceipt();
  updateMap();
 });
 document.querySelectorAll('[data-use-area]').forEach(link => link.addEventListener('click', () => {
  fields.space.value = link.dataset.space;
  fields.light.value = link.dataset.light;
  updateSource('Referência: ' + link.closest('article').querySelector('h3').textContent);
  clearReceipt();
  updateMap();
 }));
 document.querySelectorAll('[data-use-rhythm]').forEach(link => link.addEventListener('click', () => {
  fields.service.value = 'Manutenção';
  updateSource('Frequência em estudo: ' + link.dataset.useRhythm, 'rhythm');
  clearReceipt();
  updateMap();
 }));

 example.hidden = false;
 submit.disabled = false;
 example.addEventListener('click', () => {
  const defaults = {service:'Renovação de canteiros',space:'Jardim ou quintal',light:'Meia-sombra',size:'Até 30 m²'};
  for (const [key,value] of Object.entries(defaults)) if (!fields[key].value) fields[key].value = value;
  clearReceipt();
  updateMap();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const reference = 'SF-DEMO-' + String(++sequence).padStart(3,'0');
  const entries = [['Protocolo de teste',reference],['Serviço',fields.service.value],['Espaço',fields.space.value],['Luz',fields.light.value],['Tamanho',fields.size.value]];
  if (source) entries.push(['Escolha da página',source]);
  summary.replaceChildren(...entries.map(([key,value]) => {
   const row = document.createElement('div');
   const term = document.createElement('dt');
   const detail = document.createElement('dd');
   term.textContent = key;
   detail.textContent = value;
   row.append(term,detail);
   return row;
  }));
  message.textContent = 'Olá! Quero conversar sobre ' + fields.service.value.toLocaleLowerCase('pt-BR') + '. Espaço: ' + fields.space.value + '. Luz: ' + fields.light.value + '. Tamanho: ' + fields.size.value + '.' + (source ? ' ' + source + '.' : '');
  receipt.hidden = false;
  copyStatus.textContent = '';
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  clearReceipt();
  fields.service.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  updateSource('');
  clearReceipt();
  updateMap();
  fields.service.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   copyStatus.textContent = 'Pedido copiado.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   copyStatus.textContent = 'Mensagem selecionada para copiar.';
  }
 });
})();
