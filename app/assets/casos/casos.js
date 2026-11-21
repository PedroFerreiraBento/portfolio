const page = document.body.dataset.demo;
const find = selector => document.querySelector(selector);

if (page === 'painel') {
 const deliveries = {
  landing: {title:'Landing page da campanha', state:'Em revisão', date:'30 de janeiro', owner:'Pedro', checks:[true,true,false]},
  mobile: {title:'Versão mobile da campanha', state:'Aprovada', date:'27 de janeiro', owner:'Pedro', checks:[true,true,true]},
  banners: {title:'Banners do disparo', state:'Em produção', date:'2 de fevereiro', owner:'Equipe de criação', checks:[false,false,false]}
 };
 const choices = [...document.querySelectorAll('[name=delivery]')];
 const checks = [...document.querySelectorAll('#review-list input')];
 const approve = find('#approve');
 let current = 'landing';

 function renderDelivery() {
  const delivery = deliveries[current];
  const ready = delivery.checks.every(Boolean);
  const inReview = delivery.state === 'Em revisão';
  find('#delivery-title').textContent = delivery.title;
  find('#delivery-meta').textContent = 'Prazo: ' + delivery.date + ' · Responsável: ' + delivery.owner;
  find('#delivery-state').textContent = delivery.state;
  find('#delivery-state').classList.toggle('good', delivery.state === 'Aprovada');
  find('[data-state="' + current + '"]').textContent = delivery.state;
  find('#campaign-preview').hidden = current !== 'landing';
  checks.forEach((check, index) => {
   check.checked = delivery.checks[index];
   check.disabled = !inReview;
  });
  find('#progress').textContent = delivery.checks.filter(Boolean).length + ' de ' + delivery.checks.length;
  find('[data-state="' + current + '"]').toggleAttribute('data-approved', delivery.state === 'Aprovada');
  find('#review-again').hidden = current !== 'landing' || delivery.state !== 'Aprovada';
  approve.disabled = !inReview || !ready;
  if (delivery.state === 'Aprovada') {
   find('#review-help').textContent = 'Entrega aprovada. O status foi atualizado na lista.';
  } else if (!inReview) {
   find('#review-help').textContent = 'Esta entrega ainda está em produção.';
  } else {
   find('#review-help').textContent = ready ? 'Checklist concluído. A entrega pode ser aprovada.' : 'Conclua o checklist para liberar a aprovação.';
  }
 }

 choices.forEach(choice => choice.addEventListener('change', () => {
  current = choice.value;
  renderDelivery();
 }));
 checks.forEach((check, index) => check.addEventListener('change', () => {
  deliveries[current].checks[index] = check.checked;
  renderDelivery();
 }));
 find('#review-again').addEventListener('click', () => {
  deliveries.landing.state = 'Em revisão';
  deliveries.landing.checks[2] = false;
  renderDelivery();
  checks[2].focus();
 });
 approve.addEventListener('click', () => {
  if (approve.disabled) return;
  deliveries[current].state = 'Aprovada';
  renderDelivery();
 });
 renderDelivery();
}

if (page === 'integracao') {
 const event = {id:'loja-1042-pago', order:1042, item:'Luminária de mesa', quantity:1, paid:true};
 const processed = new Set();
 const orders = new Map();
 const dispatch = find('#dispatch');

 function log(message) {
  const step = document.createElement('li');
  const stamp = document.createElement('time');
  const now = new Date();
  stamp.dateTime = now.toISOString();
  stamp.textContent = now.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  step.append(stamp, message);
  find('#event-history').append(step);
 }

 dispatch.addEventListener('click', () => {
  log('Evento ' + event.id + ' recebido da loja.');
  if (processed.has(event.id)) {
   log('Evento já processado. Registro existente preservado.');
   find('#event-status').textContent = 'Reenvio detectado. A operação continua com 1 pedido.';
   return;
  }
  if (!Number.isInteger(event.order) || !event.paid || !event.item || event.quantity < 1) {
   log('Não foi possível validar os dados do pedido.');
   find('#event-status').textContent = 'Pedido recusado. Confira os dados da loja.';
   return;
  }
  log('Número, pagamento e itens validados.');
  orders.set(event.order, {...event, status:'Pronto para separar'});
  processed.add(event.id);
  const order = orders.get(event.order);
  const record = document.createElement('li');
  record.textContent = 'Pedido #' + order.order + ' · ' + order.status + ' · ' + order.quantity + ' × ' + order.item;
  find('#orders').replaceChildren(record);
  find('#orders').hidden = false;
  find('#order-empty').hidden = true;
  find('#order-count').textContent = orders.size + ' pedido';
  find('#order-count').classList.add('good');
  log('Pedido #' + order.order + ' registrado na operação.');
  find('#event-status').textContent = 'Pedido pronto para separar. Você já pode testar o reenvio.';
  dispatch.textContent = 'Reenviar evento';
  find('#restart').hidden = false;
 });
 find('#restart').addEventListener('click', () => {
  processed.clear();
  orders.clear();
  find('#orders').replaceChildren();
  find('#orders').hidden = true;
  find('#order-empty').hidden = false;
  find('#event-history').replaceChildren();
  find('#order-count').textContent = '0 pedidos';
  find('#order-count').classList.remove('good');
  find('#event-status').textContent = 'Aguardando envio da loja.';
  dispatch.textContent = 'Enviar pedido';
  find('#restart').hidden = true;
  dispatch.focus();
 });
 dispatch.disabled = false;
}
