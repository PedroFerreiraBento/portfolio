(() => {
 const find = selector => document.querySelector(selector);
 const payment = find('#dispatch');
 const pack = find('#mark-packed');
 const label = find('#generate-label');
 const ship = find('#confirm-shipment');
 const retry = find('.shipment-retry');
 const packingError = find('#packing-error');
 const checks = [...document.querySelectorAll('#packing-items input')];
 const panels = [...document.querySelectorAll('[data-step]')];
 const steps = [...document.querySelectorAll('.shipment-steps li')];
 const history = find('#event-history');
 const live = find('#event-status');
 const clock = new Intl.DateTimeFormat('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
 const stages = ['payment', 'packing', 'label', 'shipping', 'done'];
 const warehouse = ['Aguardando pedido', 'Pronto para separar', 'Separado', 'Aguardando coleta', 'Enviado'];
 let current = 0;
 let retries = 0;

 function render() {
  panels.forEach(panel => { panel.hidden = panel.dataset.step !== stages[current]; });
  steps.forEach((step, index) => {
   step.classList.toggle('is-complete', index < current);
   if (index === current) step.setAttribute('aria-current', 'step');
   else step.removeAttribute('aria-current');
  });
  find('#store-state').textContent = current === 0 ? 'Aguardando pagamento' : current === 4 ? 'Enviado' : 'Pagamento aprovado';
  find('#packing-state').textContent = warehouse[current];
  find('#order-count').textContent = current > 0 && current < 4 ? '1 pedido' : '0 pedidos';
  retry.hidden = current === 0;
 }

 function log(title, detail) {
  const event = document.createElement('li');
  const time = document.createElement('time');
  const now = new Date();
  time.dateTime = now.toISOString();
  time.textContent = clock.format(now);
  const copy = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = title;
  const description = document.createElement('p');
  description.textContent = detail;
  copy.append(heading, description);
  event.append(time, copy);
  history.prepend(event);
  find('#history-empty').hidden = true;
 }

 function advance(expected, title, detail) {
  if (current !== expected) return;
  current += 1;
  live.textContent = '';
  log(title, detail);
  render();
  panels[current].querySelector('h3').focus();
 }

 payment.addEventListener('click', () => {
  advance(0, 'Pagamento aprovado', 'Pedido #1042 recebido automaticamente pela expedição.');
 });
 checks.forEach(check => check.addEventListener('change', () => { packingError.hidden = true; }));
 pack.addEventListener('click', () => {
  const pending = checks.find(check => !check.checked);
  if (pending) {
   packingError.hidden = false;
   pending.focus();
   return;
  }
  advance(1, 'Itens separados', 'Duas unidades do Pendente Vale e uma da Arandela Pinha conferidas.');
 });
 label.addEventListener('click', () => {
  advance(2, 'Etiqueta gerada', 'Volume 1 de 1 vinculado ao pedido #1042. Rastreio simulado LF-001042.');
 });
 ship.addEventListener('click', () => {
  advance(3, 'Coleta registrada', 'Pedido marcado como enviado na loja e removido da fila ativa.');
 });
 find('#print-label').addEventListener('click', () => window.print());
 find('#retry-dispatch').addEventListener('click', () => {
  if (!current) return;
  retries += 1;
  log('Reenvio detectado', 'Nova confirmação para o pedido #1042. Nenhum registro duplicado.');
  live.textContent = 'Reenvio ' + retries + ' ignorado. ' + (current === 4
   ? 'O pedido continua enviado e a fila está vazia.'
   : 'A fila continua com 1 pedido.');
 });
 find('#restart').addEventListener('click', () => {
  current = 0;
  retries = 0;
  checks.forEach(check => { check.checked = false; });
  retry.open = false;
  packingError.hidden = true;
  live.textContent = '';
  history.replaceChildren();
  find('#history-empty').hidden = false;
  find('.shipment-history').open = false;
  render();
  payment.focus();
 });

 payment.disabled = false;
 render();
})();

