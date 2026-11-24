(() => {
 const form = document.querySelector('.intake');
 const fields = Object.fromEntries([...form.querySelectorAll('select')].map(input => [input.id, input]));
 const receipt = document.querySelector('.receipt');
 const summary = receipt.querySelector('[data-summary]');
 const message = receipt.querySelector('[data-message]');
 const status = receipt.querySelector('.copy-status');
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const carry = document.querySelector('[data-carry]');
 const slots = [...document.querySelectorAll('[data-slot]')];
 const slotList = document.querySelector('[data-slots]');
 const empty = document.querySelector('[data-empty]');
 const answers = [...document.querySelectorAll('[data-answer]')];
 const answerFeedback = document.querySelector('[data-answer-feedback]');
 let reference = '';
 let sequence = 0;

 function selectedSlots() {
  return slots.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => button.dataset.slot);
 }
 function updateCarry() {
  const periods = selectedSlots();
  carry.textContent = [reference, periods.length ? 'Disponibilidade: ' + periods.join(', ') : ''].filter(Boolean).join(' · ');
  carry.hidden = !carry.textContent;
 }
 function clearReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function updateSlots() {
  const periods = selectedSlots();
  if (slotList) {
   slotList.replaceChildren(...periods.map(period => {
    const item = document.createElement('li');
    item.textContent = period;
    return item;
   }));
   empty.hidden = periods.length > 0;
  }
  updateCarry();
  clearReceipt();
 }

 slots.forEach(button => button.addEventListener('click', () => {
  const selected = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!selected));
  button.firstElementChild.textContent = selected ? '+' : '✓';
  updateSlots();
 }));

 const explanations = {
  a:'Em 2/6, só o denominador mudou. Para manter a fração equivalente, multiplique as duas partes pelo mesmo número.',
  b:'3/6 vale metade. Para transformar 2/3 em sextos, multiplique o 2 e o 3 por 2.',
  c:'Certo. 2 × 2 = 4 e 3 × 2 = 6. A quantidade representada continua a mesma.'
 };
 answers.forEach(button => button.addEventListener('click', () => {
  answers.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  answerFeedback.textContent = explanations[button.dataset.answer];
 }));

 const goalButtons = [...document.querySelectorAll('[data-goal-tab]')];
 const goalPanels = [...document.querySelectorAll('[data-goal-panel]')];
 goalButtons.forEach(button => button.addEventListener('click', () => {
  goalButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  goalPanels.forEach(panel => panel.hidden = panel.dataset.goalPanel !== button.dataset.goalTab);
 }));
 document.querySelectorAll('[data-use-goal]').forEach(link => link.addEventListener('click', () => {
  fields.goal.value = link.dataset.useGoal;
  reference = 'Caminho escolhido: ' + fields.goal.value;
  updateCarry();
  clearReceipt();
 }));
 document.querySelector('[data-use-lesson]')?.addEventListener('click', () => {
  fields.subject.value = 'Matemática';
  reference = 'Tema da aula: frações equivalentes';
  updateCarry();
  clearReceipt();
 });
 form.addEventListener('change', event => {
  if ((event.target === fields.goal && reference.startsWith('Caminho escolhido:')) ||
      (event.target === fields.subject && reference.startsWith('Tema da aula:') && fields.subject.value !== 'Matemática')) reference = '';
  updateCarry();
  clearReceipt();
 });

 submit.disabled = false;
 example.hidden = false;
 example.addEventListener('click', () => {
  if (!fields.subject.value) fields.subject.value = 'Matemática';
  if (!fields.goal.value) fields.goal.value = 'Reforço escolar';
  if (!fields.stage.value) fields.stage.value = 'Ensino fundamental';
  clearReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const periods = selectedSlots();
  const code = 'TA-DEMO-' + String(++sequence).padStart(3, '0');
  const items = [['Protocolo de teste',code],['Matéria',fields.subject.value],['Objetivo',fields.goal.value],['Etapa escolar',fields.stage.value]];
  if (reference) items.push(['Referência',reference]);
  if (slots.length) items.push(['Disponibilidade',periods.length ? periods.join(', ') : 'A combinar']);
  summary.replaceChildren(...items.map(([name,value]) => {
   const row = document.createElement('div');
   const term = document.createElement('dt');
   const detail = document.createElement('dd');
   term.textContent = name;
   detail.textContent = value;
   row.append(term,detail);
   return row;
  }));
  message.textContent = 'Olá! Gostaria de conversar sobre aulas particulares. ' + items.slice(1).map(([name,value]) => name + ': ' + value + '.').join(' ');
  receipt.hidden = false;
  status.textContent = '';
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  clearReceipt();
  fields.subject.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  reference = '';
  slots.forEach(button => {
   button.setAttribute('aria-pressed', 'false');
   button.firstElementChild.textContent = '+';
  });
  updateSlots();
  fields.subject.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   status.textContent = 'Resumo copiado.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Resumo selecionado para copiar.';
  }
 });
})();
