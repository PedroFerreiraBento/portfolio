(() => {
 const menu = document.querySelector('.menu');
 const navigation = document.querySelector('#firm-nav');
 const setMenu = open => menu.setAttribute('aria-expanded', String(open));
 menu.hidden = false;
 menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
 navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
 });
 menu.parentElement.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
   setMenu(false);
   menu.focus();
  }
 });

 const scopes = new Map([
  ['abertura',{label:'Em que ponto está a abertura?',options:['Estou definindo a ideia','Já sei a atividade','Quero organizar a abertura']}],
  ['troca',{label:'Qual é a prioridade da troca?',options:['Planejar a mudança','Reunir documentos','Alinhar entregas pendentes']}],
  ['rotina',{label:'Qual rotina precisa de atenção?',options:['Organizar documentos','Organizar folha','Revisar pendências']}]
 ]);
 const form = document.querySelector('.intake');
 const topic = form.querySelector('#topic');
 const need = form.querySelector('#need');
 const business = form.querySelector('#business');
 const label = form.querySelector('[data-need-label]');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const receipt = document.querySelector('.receipt');
 const message = receipt.querySelector('[data-message]');
 const status = receipt.querySelector('.copy-status');
 let sequence = 0;

 function updateScope() {
  const scope = scopes.get(topic.value);
  need.disabled = !scope;
  label.textContent = scope?.label || 'O que precisa resolver?';
  need.replaceChildren(new Option(scope ? 'Selecione a prioridade' : 'Selecione o assunto primeiro', ''), ...(scope?.options || []).map(value => new Option(value,value)));
 }
 function clearReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function chooseTopic(value) {
  if (value !== topic.value) {
   topic.value = value;
   updateScope();
  }
  clearReceipt();
 }

 submit.disabled = false;
 example.hidden = false;
 updateScope();
 form.addEventListener('change', event => {
  if (event.target === topic) updateScope();
  clearReceipt();
 });
 document.querySelectorAll('[data-select-topic]').forEach(link => {
  link.addEventListener('click', () => {
   chooseTopic(link.dataset.selectTopic);
   if (link.dataset.selectNeed) need.value = link.dataset.selectNeed;
  });
 });
 example.addEventListener('click', () => {
  if (!topic.value) chooseTopic('abertura');
  if (!need.value) need.selectedIndex = 1;
  if (!business.value) business.value = 'Prestação de serviços';
  clearReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const subject = topic.selectedOptions[0].textContent;
  receipt.querySelector('[data-reference]').textContent = 'SC-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-topic]').textContent = subject;
  receipt.querySelector('[data-need]').textContent = need.value;
  receipt.querySelector('[data-business]').textContent = business.value;
  message.textContent = 'Olá! Gostaria de conversar com a Soma Clara. Assunto: ' + subject + '. Prioridade: ' + need.value + '. Atividade: ' + business.value + '.';
  status.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  clearReceipt();
  topic.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  updateScope();
  clearReceipt();
  topic.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   status.textContent = 'Mensagem copiada.';
  } catch {
   const range = document.createRange();
   range.selectNodeContents(message);
   const selection = window.getSelection();
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Mensagem selecionada para copiar.';
  }
 });
})();
