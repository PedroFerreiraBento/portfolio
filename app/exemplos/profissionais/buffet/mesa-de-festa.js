(() => {
 const form = document.querySelector('.event-form');
 const occasion = form.querySelector('#occasion');
 const people = form.querySelector('#people');
 const format = form.querySelector('#format');
 const place = form.querySelector('#place');
 const diet = form.querySelector('#diet');
 const receipt = document.querySelector('.receipt');
 const message = receipt.querySelector('[data-message]');
 const menuOutput = receipt.querySelector('[data-menu-choice]');
 const copyStatus = receipt.querySelector('.copy-status');
 const example = document.querySelector('[data-example]');
 const submit = form.querySelector('[type=submit]');
 const plan = document.querySelector('[data-plan]');
 const planStatus = document.querySelector('[data-plan-status]');
 const preferenceButtons = [...document.querySelectorAll('[data-menu]')];
 const menuStatus = document.querySelector('[data-menu-status]');
 let sequence = 0;

 const formats = {
  celebracao:['Almoço ou jantar','Coquetel','Mesa de petiscos'],
  empresa:['Coffee break','Almoço ou jantar','Coquetel'],
  recepcao:['Coquetel','Estações de serviço','Almoço ou jantar']
 };
 const plans = {
  celebracao:['Combinar o horário da refeição com os momentos da festa','Confirmar apoio para entrada, prato principal e sobremesa'],
  empresa:['Alinhar a montagem e a retirada à agenda do encontro','Separar a área de café da circulação principal'],
  recepcao:['Definir como as bandejas ou estações circulam no espaço','Revisar apoio de louças e descarte durante a recepção']
 };

 function hideReceipt() {
  receipt.hidden = true;
  copyStatus.textContent = '';
 }
 function refreshFormats() {
  const choices = formats[occasion.value] || [];
  format.disabled = choices.length === 0;
  format.replaceChildren(new Option(choices.length ? 'Escolha como servir' : 'Escolha a ocasião primeiro',''),...choices.map(item=>new Option(item,item)));
 }
 function refreshPlan() {
  if (!plan) return;
  const count = people.valueAsNumber;
  const visibleCount = people.validity.valid && Number.isFinite(count);
  const checks = [...(plans[occasion.value] || ['Acesso, montagem e retirada','Estrutura de apoio do espaço'])];
  if (visibleCount && count <= 30) checks.push('Confirmar a bancada de apoio e os pontos de passagem');
  if (visibleCount && count > 30 && count <= 80) checks.push('Planejar o fluxo entre estações e lugares sentados');
  if (visibleCount && count > 80) checks.push('Revisar filas, acessos e reposição em mais de um ponto');
  if (format.value === 'Coffee break') checks.push('Combinar reposição de bebidas durante a pausa');
  if (format.value === 'Coquetel') checks.push('Definir percursos para o serviço volante');
  if (format.value === 'Almoço ou jantar') checks.push('Alinhar horários de entrada, prato principal e sobremesa');
  if (!place.value) checks.push('Confirmar o local e o horário de acesso da equipe');
  checks.push(diet.checked ? 'Reunir as restrições alimentares para conversar com a equipe' : 'Verificar se há preferências ou restrições alimentares');
  const heading = occasion.value ? occasion.selectedOptions[0].textContent : 'Ocasião em aberto';
  const status = visibleCount ? heading + ' · ' + count + (count === 1 ? ' convidado' : ' convidados') : heading + ' · número de convidados em aberto';
  if (planStatus.textContent !== status) planStatus.textContent = status;
  plan.replaceChildren(...checks.map(copy=>{
   const row = document.createElement('li');
   row.textContent = copy;
   return row;
  }));
 }
 function chooseOccasion(value, service) {
  if (occasion.value !== value) {
   occasion.value = value;
   refreshFormats();
  }
  if (service && formats[value]?.includes(service)) format.value = service;
  hideReceipt();
  refreshPlan();
 }
 function selectedMenu() {
  return preferenceButtons.filter(button=>button.getAttribute('aria-pressed')==='true').map(button=>button.dataset.menu);
 }
 function refreshMenu() {
  if (!menuStatus) return;
  const picks = selectedMenu();
  menuStatus.textContent = picks.length ? 'No pedido: ' + picks.join(', ') + '.' : 'Nenhuma preferência incluída.';
 }

 const tablist = document.querySelector('.course-tabs');
 if (tablist) {
  const tabs = [...tablist.querySelectorAll('[role=tab]')];
  function showCourse(active, focus = false) {
   tabs.forEach(tab=>{
    const selected = tab === active;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
   });
   if (focus) active.focus();
  }
  tabs.forEach(tab=>tab.addEventListener('click',()=>showCourse(tab)));
  tablist.addEventListener('keydown',event=>{
   const index = tabs.indexOf(event.target);
   if (index < 0) return;
   const positions = {ArrowLeft:(index+tabs.length-1)%tabs.length,ArrowRight:(index+1)%tabs.length,Home:0,End:tabs.length-1};
   if (!(event.key in positions)) return;
   event.preventDefault();
   showCourse(tabs[positions[event.key]],true);
  });
 }
 preferenceButtons.forEach(button=>button.addEventListener('click',()=>{
  const active = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed',String(active));
  button.textContent = active ? 'Retirar do pedido' : 'Levar para o pedido';
  refreshMenu();
  hideReceipt();
 }));

 const filters = [...document.querySelectorAll('[data-occasion-choice]')];
 const panels = [...document.querySelectorAll('[data-occasion-panel]')];
 filters.forEach(button=>button.addEventListener('click',()=>{
  const active = button.dataset.occasionChoice;
  filters.forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
  panels.forEach(panel=>{panel.hidden=panel.dataset.occasionPanel!==active});
 }));
 document.querySelectorAll('[data-pick-occasion]').forEach(link=>{
  link.addEventListener('click',()=>chooseOccasion(link.dataset.pickOccasion,formats[link.dataset.pickOccasion]?.[0]));
 });

 submit.disabled = false;
 example.hidden = false;
 refreshFormats();
 refreshPlan();
 form.addEventListener('input',event=>{
  if (event.target === occasion) refreshFormats();
  hideReceipt();
  refreshPlan();
 });
 example.addEventListener('click',()=>{
  if (!occasion.value) chooseOccasion('celebracao');
  if (!people.value) people.value = 60;
  if (!format.value) format.selectedIndex = 1;
  if (!place.value) place.selectedIndex = 2;
  hideReceipt();
  refreshPlan();
  submit.focus();
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if (!form.reportValidity()) return;
  const subject = occasion.selectedOptions[0].textContent;
  const count = people.valueAsNumber;
  const where = place.value || 'Ainda vou definir';
  const needs = diet.checked ? 'Conversar com o buffet' : 'A confirmar';
  const picks = selectedMenu();
  receipt.querySelector('[data-code]').textContent = 'MF-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-occasion]').textContent = subject;
  receipt.querySelector('[data-people]').textContent = count;
  receipt.querySelector('[data-format]').textContent = format.value;
  receipt.querySelector('[data-place]').textContent = where;
  receipt.querySelector('[data-diet]').textContent = needs;
  menuOutput.textContent = picks.length ? 'Preferências do menu: ' + picks.join(', ') + '.' : '';
  menuOutput.hidden = !picks.length;
  message.textContent = 'Olá! Gostaria de conversar sobre buffet para ' + subject.toLowerCase() + '. Convidados: ' + count + '. Formato: ' + format.value + '. Espaço: ' + where + '. Restrições alimentares: ' + needs + '. ' + menuOutput.textContent;
  copyStatus.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click',()=>{
  hideReceipt();
  occasion.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click',()=>{
  form.reset();
  preferenceButtons.forEach(button=>{
   button.setAttribute('aria-pressed','false');
   button.textContent = 'Levar para o pedido';
  });
  refreshMenu();
  refreshFormats();
  refreshPlan();
  hideReceipt();
  occasion.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click',async()=>{
  try {
   await navigator.clipboard.writeText(message.textContent);
   copyStatus.textContent = 'Pedido copiado.';
  } catch {
   const selection = window.getSelection();
   if (!selection) return;
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   copyStatus.textContent = 'Pedido selecionado para copiar.';
  }
 });
})();
