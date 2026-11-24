(() => {
 const navigation = document.querySelector('#firm-nav');
 const menu = document.querySelector('.menu');
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

 const form = document.querySelector('.contact-form');
 const area = form.querySelector('#area');
 const period = form.querySelector('#period');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const receipt = document.querySelector('.receipt');
 const message = receipt.querySelector('[data-message]');
 const status = receipt.querySelector('.copy-status');
 let sequence = 0;

 function hideReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }

 submit.disabled = false;
 example.hidden = false;
 form.addEventListener('change', hideReceipt);
 document.querySelectorAll('[data-area]').forEach(link => {
  link.addEventListener('click', () => {
   area.value = link.dataset.area;
   hideReceipt();
  });
 });
 example.addEventListener('click', () => {
  if (!area.value) area.value = 'contratos';
  if (!period.value) period.value = 'À tarde';
  hideReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const subject = area.selectedOptions[0].textContent;
  receipt.querySelector('[data-receipt-id]').textContent = 'PA-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-receipt-area]').textContent = subject;
  receipt.querySelector('[data-receipt-period]').textContent = period.value;
  message.textContent = 'Olá! Gostaria de conversar com o Pátio Advocacia. Assunto: ' + subject + '. Período para retorno: ' + period.value + '.';
  status.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  hideReceipt();
  area.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  hideReceipt();
  area.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   status.textContent = 'Mensagem copiada.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Mensagem selecionada para copiar.';
  }
 });
})();
