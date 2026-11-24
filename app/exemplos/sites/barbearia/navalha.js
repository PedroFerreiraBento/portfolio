(() => {
 const form = document.querySelector('.intake');
 const service = form.querySelector('#service');
 const preference = form.querySelector('#preference');
 const period = form.querySelector('#period');
 const carry = form.querySelector('[data-carry]');
 const receipt = document.querySelector('.receipt');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const status = receipt.querySelector('.copy-status');
 const order = [...document.querySelectorAll('[data-order]')];
 let reference = '';
 let sequence = 0;

 const choices = new Map([
  ['corte',['Manter o comprimento','Mudar o comprimento','Conversar sobre o corte']],
  ['barba',['Alinhar o contorno','Ajustar o volume','Conversar sobre a barba']],
  ['ambos',['Ajustar corte e barba','Manter o comprimento','Conversar sobre os dois']]
 ]);

 function refresh() {
  preference.disabled = !service.value;
  preference.replaceChildren(new Option(service.value ? 'Selecione uma preferência' : 'Selecione o serviço primeiro',''), ...(choices.get(service.value) || []).map(item => new Option(item,item)));
  order.forEach(button => button.setAttribute('aria-pressed',String(service.value === 'ambos' || service.value === button.dataset.order)));
  const total = document.querySelector('[data-order-summary]');
  if (total) total.textContent = service.value ? service.selectedOptions[0].textContent : 'Escolha um serviço acima.';
 }
 function hideReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function showReference(value) {
  reference = value;
  carry.hidden = !value;
  carry.textContent = value ? 'Referência de corte: ' + value : '';
 }
 function chooseService(value) {
  if (service.value === value) return;
  service.value = value;
  if (value !== 'corte' && value !== 'ambos') showReference('');
  refresh();
  hideReceipt();
 }

 document.querySelectorAll('[data-cut]').forEach(button => {
  button.addEventListener('click', () => {
   document.querySelectorAll('[data-cut]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
   document.querySelectorAll('[data-cut-panel]').forEach(panel => panel.hidden = panel.dataset.cutPanel !== button.dataset.cut);
  });
 });
 document.querySelectorAll('[data-pick-cut]').forEach(link => {
  link.addEventListener('click', () => {
   chooseService('corte');
   showReference(link.closest('article').querySelector('h2').textContent);
   hideReceipt();
  });
 });
 order.forEach(button => {
  button.addEventListener('click', () => {
   const chosen = new Set(service.value === 'ambos' ? ['corte','barba'] : service.value ? [service.value] : []);
   const value = button.dataset.order;
   if (chosen.has(value)) chosen.delete(value);
   else chosen.add(value);
   chooseService(chosen.size === 2 ? 'ambos' : [...chosen][0] || '');
  });
 });
 form.addEventListener('change', event => {
  if (event.target === service) {
   if (service.value !== 'corte' && service.value !== 'ambos') showReference('');
   refresh();
  }
  hideReceipt();
 });
 refresh();
 example.hidden = false;
 submit.disabled = false;
 example.addEventListener('click', () => {
  if (!service.value) chooseService('corte');
  if (!preference.value) preference.selectedIndex = 1;
  if (!period.value) period.value = 'À tarde';
  hideReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const code = 'ON-DEMO-' + String(++sequence).padStart(3,'0');
  const item = service.selectedOptions[0].textContent;
  const values = [['Protocolo de teste',code],['Serviço',item],['Preferência',preference.value],['Retorno',period.value]];
  if (reference) values.push(['Referência',reference]);
  receipt.querySelector('[data-summary]').replaceChildren(...values.map(([key,value]) => {
   const line = document.createElement('div');
   const term = document.createElement('dt');
   const detail = document.createElement('dd');
   term.textContent = key;
   detail.textContent = value;
   line.append(term,detail);
   return line;
  }));
  receipt.querySelector('[data-message]').textContent = 'Olá! Quero conversar sobre ' + item.toLocaleLowerCase('pt-BR') + '. Preferência: ' + preference.value + '. Melhor período para retorno: ' + period.value + '.' + (reference ? ' Referência de corte: ' + reference + '.' : '');
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {hideReceipt();service.focus();});
 receipt.querySelector('[data-reset]').addEventListener('click', () => {form.reset();showReference('');refresh();hideReceipt();service.focus();});
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(receipt.querySelector('[data-message]').textContent);
   status.textContent = 'Pedido copiado.';
  } catch {
   status.textContent = 'Não foi possível copiar automaticamente. Selecione e copie a mensagem acima.';
  }
 });
})();
