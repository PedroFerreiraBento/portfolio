(() => {
 const find = selector => document.querySelector(selector);
 const review = find('#approval-review');
 const waiting = find('#approval-waiting');
 const receipt = find('#approval-receipt');
 const status = find('#delivery-state');
 const form = find('#review-note');
 const openAdjust = find('#open-adjust');
 const approve = find('#approve');
 const canv = find('#approval-canvas');
 const action = find('#preview-action');
 const versionControls = [...document.querySelectorAll('[data-version]')];
 const previewControls = [...document.querySelectorAll('[data-preview]')];
 const choices = [...form.querySelectorAll('[name=change]')];
 const reset = find('#reset-demo');
 const descriptions = {contrast:'Dar mais destaque ao botão',label:'Usar “Ver fragrâncias” no botão'};
 const storageKey = 'caos-aprovar-publicacao';
 const initial = {stage:'review',version:1,adjustments:[],previous:[],request:null,approvedAt:null};
 let state = structuredClone(initial);
 let shown = 'latest';
 const narrowScreen = matchMedia('(max-width: 700px)');
 let view = narrowScreen.matches ? 'mobile' : 'desktop';
 let previewChosen = false;
 try {
  const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
  if (saved && ['review','waiting','approved'].includes(saved.stage)) state = saved;
 } catch { /* The demonstration still works without storage. */ }

 function render() {
  const previous = shown === 'previous';
  const displayedVersion = previous ? state.version - 1 : state.version;
  const adjustments = previous ? state.previous : state.adjustments;
  canv.dataset.view = view;
  action.dataset.emphasis = String(adjustments.includes('contrast'));
  action.textContent = adjustments.includes('label') ? 'Ver fragrâncias' : 'Conhecer a coleção';
  find('#version-label').textContent = 'Versão ' + displayedVersion + (previous ? ' · Anterior' : ' · Atual');
  find('#version-tools').hidden = state.version < 2;
  versionControls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.version === shown)));
  previewControls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.preview === view)));
  const versionNote = find('#version-note');
  versionNote.hidden = state.version < 2;
  versionNote.textContent = previous
   ? 'Você está conferindo a versão anterior. Volte à atual para aprovar.'
   : 'A equipe aplicou os ajustes pedidos. Compare com a versão anterior antes de aprovar.';
  review.hidden = state.stage !== 'review';
  waiting.hidden = state.stage !== 'waiting';
  receipt.hidden = state.stage !== 'approved';
  approve.disabled = previous;
  choices.forEach(choice => { choice.disabled = state.adjustments.includes(choice.value); });
  openAdjust.hidden = previous || choices.every(choice => choice.disabled);
  status.textContent = {review:'Aguardando sua aprovação',waiting:'Ajustes solicitados',approved:'Liberado para publicação'}[state.stage];
  status.dataset.tone = state.stage === 'approved' ? 'ok' : '';
  reset.hidden = state.stage === 'review' && state.version === 1;
  if (state.request) {
   const entries = state.request.choices.map(id => descriptions[id]);
   if (state.request.note) entries.push(state.request.note);
   find('#requested-changes').replaceChildren(...entries.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
   }));
  }
  find('#approved-version').textContent = 'Versão ' + state.version;
  try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* The in-memory state remains available. */ }
 }

 function toggleAdjust(open) {
  form.hidden = !open;
  openAdjust.setAttribute('aria-expanded', String(open));
  find('#adjust-error').hidden = true;
  if (open) choices.find(choice => !choice.disabled)?.focus();
 }

 previewControls.forEach(button => button.addEventListener('click', () => {
  previewChosen = true;
  view = button.dataset.preview;
  render();
 }));
 narrowScreen.addEventListener('change', () => {
  if (previewChosen) return;
  view = narrowScreen.matches ? 'mobile' : 'desktop';
  render();
 });
 versionControls.forEach(button => button.addEventListener('click', () => {
  shown = button.dataset.version;
  toggleAdjust(false);
  render();
 }));
 openAdjust.addEventListener('click', () => toggleAdjust(form.hidden));
 form.addEventListener('input', () => { find('#adjust-error').hidden = true; });
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (state.stage !== 'review' || shown !== 'latest') return;
  const data = new FormData(form);
  const selected = data.getAll('change');
  if (!selected.length) {
   find('#adjust-error').hidden = false;
   return;
  }
  state.request = {choices:selected,note:data.get('note').trim()};
  state.stage = 'waiting';
  form.reset();
  toggleAdjust(false);
  render();
  find('#receive').focus();
 });
 find('#receive').addEventListener('click', () => {
  if (!state.request || state.stage !== 'waiting') return;
  state.previous = state.adjustments;
  state.adjustments = [...state.adjustments,...state.request.choices];
  state.version += 1;
  state.stage = 'review';
  shown = 'latest';
  render();
  find('[data-version=latest]').focus();
 });
 approve.addEventListener('click', () => {
  if (state.stage !== 'review' || shown !== 'latest') return;
  state.stage = 'approved';
  state.approvedAt = new Date().toISOString();
  toggleAdjust(false);
  render();
  find('#download-review').focus();
 });
 find('#download-review').addEventListener('click', () => {
  const moment = new Date(state.approvedAt).toLocaleString('pt-BR');
  const content = [
   'Comprovante demonstrativo de aprovação',
   'Projeto: Casa Âmbar · Nova coleção',
   'Entrega: Página da campanha',
   'Versão aprovada: ' + state.version,
   'Aprovado em: ' + moment,
   'Próximo passo: publicação pela equipe',
   ...(state.adjustments.length ? ['','Ajustes aplicados:',...state.adjustments.map(id => '- ' + descriptions[id])] : []),
   '',
   'Demonstração com dados fictícios.'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'casa-ambar-aprovacao-v' + state.version + '.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
 });
 reset.addEventListener('click', () => {
  state = structuredClone(initial);
  shown = 'latest';
  previewChosen = false;
  view = narrowScreen.matches ? 'mobile' : 'desktop';
  form.reset();
  toggleAdjust(false);
  render();
  approve.focus();
 });
 render();
})();
