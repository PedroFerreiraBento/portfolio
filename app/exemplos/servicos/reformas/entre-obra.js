(() => {
 const form = document.querySelector('.intake');
 const receipt = document.querySelector('.receipt');
 const fields = Object.fromEntries([...form.querySelectorAll('select')].map(input => [input.id,input]));
 const context = form.querySelector('[data-context]');
 const summary = receipt.querySelector('[data-summary]');
 const message = receipt.querySelector('[data-message]');
 const status = receipt.querySelector('.copy-status');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const tabs = [...document.querySelectorAll('[data-phase]')];
 const occupancyButtons = [...document.querySelectorAll('[data-occupancy]')];
 const scopeFields = [...document.querySelectorAll('[data-scope-room]')];
 const scopeSummary = document.querySelector('[data-scope-summary]');
 const scopeCount = document.querySelector('[data-scope-count]');
 const scopeOpen = document.querySelector('[data-scope-open]');
 const clearScope = document.querySelector('[data-clear-scope]');
 const phaseNames = {preparo:'Preparar',execucao:'Executar',entrega:'Entregar'};
 let phase = 'preparo';
 let mode = 'ocupado';
 let reference = '';
 let scope = [];
 let scopeCountValue = 0;
 let sequence = 0;

 function hideReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function updateContext() {
  const selection = scope.map(room => room.name + ': ' + room.items.join(', ')).join(' · ');
  context.textContent = [reference,selection].filter(Boolean).join(' | ');
  context.hidden = !context.textContent;
 }
 function setMode(value) {
  mode = value;
  occupancyButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.occupancy === value)));
  document.querySelectorAll('[data-mode]').forEach(copy => copy.hidden = copy.dataset.mode !== value);
 }
 function choosePhase(value, focus = false) {
  phase = value;
  for (const tab of tabs) {
   const active = tab.dataset.phase === value;
   tab.setAttribute('aria-selected',String(active));
   tab.tabIndex = active ? 0 : -1;
   document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
   if (active && focus) tab.focus();
  }
 }
 function buildRows(rows) {
  return rows.map(([key,value]) => {
   const row = document.createElement('div');
   const name = document.createElement('dt');
   const data = document.createElement('dd');
   name.textContent = key;
   data.textContent = value;
   row.append(name,data);
   return row;
  });
 }
 function updateScope(syncForm = false) {
  if (!scopeSummary) return;
  scope = scopeFields.flatMap(group => {
   const items = [...group.querySelectorAll('[data-task]:checked')].map(input => input.nextElementSibling.textContent);
   return items.length ? [{key:group.dataset.scopeRoom,name:group.querySelector('legend').textContent,items}] : [];
  });
  scopeCountValue = scope.reduce((total,room) => total + room.items.length,0);
  scopeCount.textContent = scopeCountValue ? scopeCountValue + (scopeCountValue === 1 ? ' item selecionado' : ' itens selecionados') : 'Nenhum item selecionado';
  clearScope.disabled = !scopeCountValue;
  if (scopeCountValue) {
   const details = document.createElement('dl');
   details.append(...buildRows(scope.map(room => [room.name,room.items.join(', ')])));
   scopeSummary.replaceChildren(details);
   scopeOpen.textContent = 'A definir na visita: medidas, materiais e condições do imóvel.';
   if (syncForm) fields.project.value = scope.length === 1 ? scope[0].key : 'varios';
  } else {
   const empty = document.createElement('p');
   empty.textContent = 'Marque os pontos que quer conversar na visita.';
   scopeSummary.replaceChildren(empty);
   scopeOpen.textContent = 'A definir: prioridades e detalhes de cada ambiente.';
   if (syncForm) fields.project.value = '';
  }
  updateContext();
  hideReceipt();
 }

 tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => choosePhase(tab.dataset.phase));
  tab.addEventListener('keydown', event => {
   const directions = {ArrowLeft:(index + tabs.length - 1) % tabs.length,ArrowRight:(index + 1) % tabs.length,Home:0,End:tabs.length - 1};
   if (!Object.hasOwn(directions,event.key)) return;
   event.preventDefault();
   choosePhase(tabs[directions[event.key]].dataset.phase,true);
  });
 });
 occupancyButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.occupancy)));
 document.querySelector('[data-use-route]')?.addEventListener('click', () => {
  fields.occupancy.value = mode;
  reference = 'Etapa em pauta: ' + phaseNames[phase];
  updateContext();
  hideReceipt();
 });
 document.querySelectorAll('[data-room]').forEach(link => {
  link.addEventListener('click', () => {
   fields.project.value = link.dataset.room;
   reference = 'Referência do diário: ' + fields.project.selectedOptions[0].textContent;
   updateContext();
   hideReceipt();
  });
 });
 scopeFields.forEach(group => group.addEventListener('change', () => updateScope(true)));
 clearScope?.addEventListener('click', () => {
  document.querySelectorAll('[data-task]').forEach(input => input.checked = false);
  updateScope(true);
  scopeFields[0].querySelector('input').focus();
 });
 form.addEventListener('change', event => {
  if (event.target === fields.project && reference.startsWith('Referência do diário:')) {
   reference = '';
   updateContext();
  }
  hideReceipt();
 });
 example.hidden = false;
 submit.disabled = false;
 example.addEventListener('click', () => {
  if (!fields.project.value) fields.project.value = 'cozinha';
  if (!fields.area.value) fields.area.value = 'Até 20 m²';
  if (!fields.occupancy.value) fields.occupancy.value = 'ocupado';
  hideReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const code = 'EO-DEMO-' + String(++sequence).padStart(3,'0');
  const project = fields.project.selectedOptions[0].textContent;
  const occupancy = fields.occupancy.selectedOptions[0].textContent;
  const rows = [['Protocolo de teste',code],['Frente da reforma',project],['Área aproximada',fields.area.value],['Durante a reforma',occupancy]];
  if (reference) rows.push(['Escolha da versão',reference]);
  if (scope.length) rows.push(...scope.map(room => [room.name,room.items.join(', ')]),['A definir','Medidas, materiais e condições do imóvel']);
  summary.replaceChildren(...buildRows(rows));
  message.textContent = 'Olá! Gostaria de conversar sobre uma reforma. Frente: ' + project + '. Área: ' + fields.area.value + '. Situação: ' + occupancy + '.' +
   (reference ? ' ' + reference + '.' : '') + (scope.length ? ' Pauta: ' + scope.map(room => room.name + ' (' + room.items.join(', ') + ')').join('; ') + '.' : '');
  status.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  hideReceipt();
  fields.project.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  reference = '';
  document.querySelectorAll('[data-task]').forEach(input => input.checked = false);
  updateScope();
  updateContext();
  hideReceipt();
  fields.project.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   status.textContent = 'Pedido copiado.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Pedido selecionado para copiar.';
  }
 });
 updateScope();
})();
