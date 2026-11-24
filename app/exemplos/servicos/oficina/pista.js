(() => {
 const form = document.querySelector('.intake');
 const topic = form.querySelector('#topic');
 const detail = form.querySelector('#detail');
 const vehicle = form.querySelector('#vehicle');
 const detailLabel = form.querySelector('[data-detail-label]');
 const receipt = document.querySelector('.receipt');
 const message = receipt.querySelector('[data-message]');
 const status = receipt.querySelector('.copy-status');
 const checks = [...document.querySelectorAll('[data-record]')];
 const checkedCount = document.querySelector('[data-count]');
 const example = document.querySelector('[data-example]');
 const submit = form.querySelector('[type=submit]');
 const steps = [...form.querySelectorAll('[data-step]')];
 const wizard = form.hasAttribute('data-wizard');
 const stepFields = [topic, detail, vehicle];
 const controlPanel = form.querySelector('.wizard-controls');
 const next = form.querySelector('[data-next]');
 const back = form.querySelector('[data-back]');
 const stepMarkers = [...document.querySelectorAll('.step-list li')];
 const stepStatus = document.querySelector('[data-step-status]');
 let current = 0;
 let sequence = 0;
 const topics = new Map([
  ['revisao',{label:'O que motivou a revisão?',choices:['Quero organizar minha revisão','Tenho o histórico de serviços','Quero conversar sobre o que ficou pendente']}],
  ['freios',{label:'Em que situação você percebeu a mudança?',choices:['Ao frear','Ao passar por desníveis','Ainda não sei em que situação']}],
  ['observacao',{label:'O que você observou?',choices:['Barulho diferente','Luz no painel','Vibração ou mudança percebida','Prefiro explicar na conversa']}]
 ]);
 function refreshOptions() {
  const setup = topics.get(topic.value);
  detail.disabled = !setup;
  detailLabel.textContent = setup?.label || 'Detalhe para a oficina';
  const blank = new Option(setup ? 'Selecione uma observação' : 'Selecione o motivo primeiro','');
  detail.replaceChildren(blank,...(setup?.choices || []).map(choice => new Option(choice,choice)));
 }
 function hideReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function marked() {
  return checks.filter(input => input.checked).map(input => input.dataset.record);
 }
 function updateCheckCount() {
  if (!checkedCount) return;
  const size = marked().length;
  checkedCount.textContent = size ? size + (size === 1 ? ' informação marcada.' : ' informações marcadas.') : 'Nenhuma informação marcada.';
 }
 function showStep(index, focus = false) {
  if (!wizard) return;
  current = index;
  steps.forEach((step,position) => step.hidden = position !== index);
  stepMarkers.forEach((marker,position) => {
   if (position === index) marker.setAttribute('aria-current','step');
   else marker.removeAttribute('aria-current');
  });
  stepStatus.textContent = 'Etapa ' + (index + 1) + ' de ' + steps.length;
  back.hidden = index === 0;
  next.hidden = index === steps.length - 1;
  controlPanel.hidden = back.hidden && next.hidden;
  submit.hidden = index !== steps.length - 1;
  if (focus) stepFields[index].focus();
 }
 function advance() {
  if (stepFields[current].reportValidity()) showStep(current + 1, true);
 }

 submit.disabled = false;
 example.hidden = false;
 refreshOptions();
 if (wizard) {
  form.noValidate = true;
  showStep(0);
  next.addEventListener('click',advance);
  back.addEventListener('click',() => showStep(current - 1,true));
 }
 form.addEventListener('change',event => {
  if (event.target === topic) refreshOptions();
  hideReceipt();
 });
 checks.forEach(input => input.addEventListener('change',() => {
  updateCheckCount();
  hideReceipt();
 }));
 example.addEventListener('click',() => {
  if (!topic.value) {
   topic.value = 'observacao';
   refreshOptions();
  }
  if (!detail.value) detail.selectedIndex = 1;
  if (!vehicle.value) vehicle.selectedIndex = 1;
  hideReceipt();
  showStep(steps.length - 1);
  submit.focus();
 });
 form.addEventListener('submit',event => {
  event.preventDefault();
  if (wizard && current < steps.length - 1) {
   advance();
   return;
  }
  const incomplete = stepFields.findIndex(field => !field.validity.valid);
  if (incomplete !== -1) {
   showStep(incomplete);
   stepFields[incomplete].reportValidity();
   return;
  }
  const selectedTopic = topic.selectedOptions[0].textContent;
  const available = marked();
  const list = receipt.querySelector('[data-checklist-summary]');
  receipt.querySelector('[data-code]').textContent = 'P22-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-summary-topic]').textContent = selectedTopic;
  receipt.querySelector('[data-summary-detail]').textContent = detail.value;
  receipt.querySelector('[data-summary-vehicle]').textContent = vehicle.value;
  list.textContent = available.length ? 'Informações à mão: ' + available.join(', ') + '.' : '';
  list.hidden = !available.length;
  message.textContent = 'Olá! Quero conversar com a Pista 22. Motivo: ' + selectedTopic + '. Observação: ' + detail.value + '. Veículo: ' + vehicle.value + '.';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click',() => {
  hideReceipt();
  showStep(0);
  topic.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click',() => {
  form.reset();
  checks.forEach(input => input.checked = false);
  updateCheckCount();
  refreshOptions();
  hideReceipt();
  showStep(0);
  topic.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click',async() => {
  const list = receipt.querySelector('[data-checklist-summary]');
  try {
   await navigator.clipboard.writeText([message.textContent,list.textContent].filter(Boolean).join(' '));
   status.textContent = 'Pedido copiado.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.setStartBefore(list.hidden ? message : list);
   range.setEndAfter(message);
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Pedido selecionado para copiar.';
  }
 });
})();
