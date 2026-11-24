(() => {
 const menu = document.querySelector('.menu');
 const nav = document.querySelector('#studio-nav');
 const setMenu = open => menu.setAttribute('aria-expanded', String(open));
 menu.hidden = false;
 menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
 nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
 });
 menu.parentElement.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
   setMenu(false);
   menu.focus();
  }
 });

 const phases = {
  interiores:{label:'O que você tem do imóvel?', values:['Tenho a planta do apartamento','Tenho fotos e medidas iniciais','Vou levantar as medidas']},
  reforma:{label:'O que já foi levantado?', values:['Tenho fotos da situação atual','Tenho planta ou levantamento','Estou definindo o que quero mudar']},
  casa:{label:'Em que etapa está o terreno?', values:['Já escolhi o terreno','Tenho levantamento do terreno','Ainda estou escolhendo o terreno']}
 };
 const form = document.querySelector('.brief-form');
 const {project,area,stage} = form.elements;
 const submit = form.querySelector('[type=submit]');
 const example = document.querySelector('[data-example]');
 const stageLabel = form.querySelector('[data-stage-label]');
 const receipt = document.querySelector('.receipt');
 const message = receipt.querySelector('[data-message]');
 const status = receipt.querySelector('.status');
 let sequence = 0;

 function updateStage() {
  const {label,values} = phases[project.value];
  stageLabel.textContent = label;
  stage.replaceChildren(new Option('Selecione a etapa',''), ...values.map(value => new Option(value,value)));
 }
 function closeReceipt() {
  receipt.hidden = true;
  status.textContent = '';
 }
 function selectProject(value) {
  if (project.value !== value) {
   project.value = value;
   updateStage();
  }
  closeReceipt();
 }

 updateStage();
 submit.disabled = false;
 example.hidden = false;
 form.addEventListener('change', event => {
  if (event.target === project) updateStage();
  closeReceipt();
 });
 document.querySelectorAll('[data-type]').forEach(link => {
  link.addEventListener('click', () => selectProject(link.dataset.type));
 });
 example.addEventListener('click', () => {
  if (!area.value) area.value = 'De 41 a 100 m²';
  if (!stage.value) stage.selectedIndex = 1;
  closeReceipt();
  submit.focus();
 });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = project.selectedOptions[0].textContent;
  receipt.querySelector('[data-code]').textContent = 'EN-DEMO-' + String(++sequence).padStart(3,'0');
  receipt.querySelector('[data-project]').textContent = name;
  receipt.querySelector('[data-area]').textContent = area.value;
  receipt.querySelector('[data-stage]').textContent = stage.value;
  message.textContent = 'Olá! Gostaria de conversar com a Entrelinhas Arquitetura. Projeto: ' + name
   + '. Área aproximada: ' + area.value + '. Etapa: ' + stage.value + '.';
  status.textContent = '';
  receipt.hidden = false;
  receipt.querySelector('h3').focus();
 });
 receipt.querySelector('[data-edit]').addEventListener('click', () => {
  closeReceipt();
  project.focus();
 });
 receipt.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  updateStage();
  closeReceipt();
  project.focus();
 });
 receipt.querySelector('[data-copy]').addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent);
   status.textContent = 'Briefing copiado.';
  } catch {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Briefing selecionado para copiar.';
  }
 });
})();
