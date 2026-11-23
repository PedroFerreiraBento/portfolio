(() => {
 const service = document.querySelector('#demo-service');
 const period = document.querySelector('#demo-period');
 const action = document.querySelector('[data-demo-action]');
 const result = document.querySelector('.portfolio-demo-result');
 if (!service || !period || !action || !result) return;

 action.disabled = false;
 action.addEventListener('click', () => {
  result.querySelector('[data-demo-message]').textContent =
    'Olá! Gostaria de saber mais sobre ' + service.value.toLocaleLowerCase('pt-BR')
    + '. Melhor horário para retorno: ' + period.value.toLocaleLowerCase('pt-BR') + '.';
  result.hidden = false;
  result.querySelector('h3').focus();
 });
})();
