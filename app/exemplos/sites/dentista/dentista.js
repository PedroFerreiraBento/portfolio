(() => {
 const menu = document.querySelector('.clinic-menu');
 const navigation = document.querySelector('#clinic-navigation');
 menu.hidden = false;
 const setMenuOpen = open => menu.setAttribute('aria-expanded',String(open));
 menu.addEventListener('click', () => setMenuOpen(menu.getAttribute('aria-expanded') !== 'true'));
 navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
 });
 menu.parentElement.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
   setMenuOpen(false);
   menu.focus();
  }
 });

 const form = document.querySelector('.request-form');
 const result = document.querySelector('.request-result');
 if (!form || !result) return;

 const service = form.elements.service;
 const period = form.elements.period;
 const message = result.querySelector('[data-demo-message]');
 form.querySelector('[type=submit]').disabled = false;
 const status = result.querySelector('.copy-status');

 const clearResult = () => {
  result.hidden = true;
  status.textContent = '';
 };

 document.querySelectorAll('[data-service-choice]').forEach(link => {
  link.addEventListener('click', () => {
   service.value = link.dataset.serviceChoice;
   clearResult();
  });
 });

 form.addEventListener('change', clearResult);
 form.addEventListener('submit', event => {
  event.preventDefault();
  const choice = service.selectedOptions[0].textContent.toLocaleLowerCase('pt-BR');
  message.textContent = 'Olá! Gostaria de solicitar uma avaliação na Odonto Premium. Meu interesse é: '
   + choice + '. Prefiro receber retorno ' + period.value + '.';
  status.textContent = '';
  result.hidden = false;
  result.querySelector('h3').focus();
 });

 result.querySelector('[data-edit-request]').addEventListener('click', () => {
  clearResult();
  service.focus();
 });

 result.querySelector('[data-copy-message]').addEventListener('click', async () => {
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
