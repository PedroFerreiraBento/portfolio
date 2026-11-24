(() => {
 const menu = document.querySelector('.menu');
 const navigation = document.querySelector('#salon-navigation');
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

 const choices = {
  corte: {label:'O que você quer fazer no corte?', options:['Manter o comprimento','Mudar o corte','Decidir com a equipe']},
  cor: {label:'O que você quer fazer com a cor?', options:['Retocar a cor','Mudar a cor','Entender as opções']},
  penteado: {label:'Qual é a ocasião?', options:['Casamento','Festa ou formatura','Ensaio ou outra ocasião']}
 };
 const form = document.querySelector('.service-form');
 const receipt = document.querySelector('.receipt');
 const example = document.querySelector('[data-example]');
 const guidance = document.querySelector('[data-preference-label]');
 const submit = form.querySelector('[type=submit]');
 const {service, preference, period} = form.elements;
 const status = receipt.querySelector('.copy-status');
 const message = receipt.querySelector('[data-message]');
 let sequence = 0;

 function updatePreference() {
  const choice = choices[service.value];
  preference.disabled = !choice;
  guidance.textContent = choice?.label || 'O que você procura?';
  preference.replaceChildren(new Option(choice ? 'Selecione sua preferência' : 'Escolha o serviço primeiro', ''), ...(choice?.options || []).map(value => new Option(value,value)));
 }
 function hideReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function setService(value) {
  if (service.value !== value) {
   service.value = value;
   updatePreference();
  }
  hideReceipt();
 }

 submit.disabled = false;
 example.hidden = false;
 updatePreference();
 form.addEventListener('change', event => {
  if (event.target === service) updatePreference();
  hideReceipt();
 });
 document.querySelectorAll('[data-service-choice]').forEach(link => {
  link.addEventListener('click', () => setService(link.dataset.serviceChoice));
 });
 example.addEventListener('click', () => {
  if (!service.value) setService('corte');
  if (!preference.value) preference.selectedIndex = 1;
  if (!period.value) period.value = 'À tarde';
  hideReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const serviceName = service.selectedOptions[0].textContent;
  receipt.querySelector('[data-receipt-id]').textContent = 'BL-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-receipt-service]').textContent = serviceName;
  receipt.querySelector('[data-receipt-preference]').textContent = preference.value;
  receipt.querySelector('[data-receipt-period]').textContent = period.value;
  message.textContent = 'Olá! Quero pedir um atendimento na Bellezza. Serviço: ' + serviceName
   + '. Preferência: ' + preference.value + '. Melhor período para retorno: ' + period.value + '.';
  status.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  hideReceipt();
  service.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  updatePreference();
  hideReceipt();
  service.focus();
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
