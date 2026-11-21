import { initFunnel } from './funnel.js';

const $ = id => document.getElementById(id);
const stages = {novo: 'Novo', conversa: 'Em conversa', proposta: 'Proposta enviada', ganho: 'Fechado', perdido: 'Perdido'};
const channels = {site: 'Formulário do site', whatsapp: 'WhatsApp', email: 'E-mail', outro: 'Outro'};
const currency = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
const decimal = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2});
const leadForm = $('lead-form');
const field = name => leadForm.elements.namedItem(name);
const errorText = {
 unavailable: 'Serviço indisponível agora. Tente novamente em instantes.',
 rate: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
 session: 'Sua sessão terminou. Recarregue a página para entrar novamente.',
 duplicate: 'Essa referência já está cadastrada. Busque o contato para editar.',
 stale: 'Esse contato foi alterado em outra aba. Reabra o registro atualizado antes de salvar.',
 key: 'Chave de acesso incorreta.',
 invalid: 'Revise os campos e envie novamente.'
};
let rows = [];
let current = null;
let reference = '';
let returnFocus;
let followupFilter = '';
const followupButtons = [...document.querySelectorAll('[data-followup]')];
const localDay = new Intl.DateTimeFormat('sv-SE', {timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit'});
const dateLabel = new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC', day:'2-digit', month:'2-digit', year:'numeric'});
const funnel = initFunnel(query => api('funnel&' + query));

for (const [value, label] of Object.entries(stages)) {
 field('stage').add(new Option(label, value));
 $('filter').add(new Option(label, value));
}

async function api(action, method = 'GET', payload) {
 const init = {method, signal: AbortSignal.timeout(12000)};
 if (payload) {
  init.headers = {'Content-Type': 'application/json'};
  init.body = JSON.stringify(payload);
 }
 let response;
 try {
  response = await fetch('/api/crm?action=' + action, init);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
 } catch (error) {
  throw new Error(errorText[error.message] || errorText.unavailable);
 }
}

function status(id, message = '', error = false) {
 const item = $(id);
 item.textContent = message;
 item.dataset.error = String(error);
}

function el(tag, css, copy) {
 const node = document.createElement(tag);
 if (css) node.className = css;
 if (copy) node.textContent = copy;
 return node;
}

function currencyToCents(value) {
 const trimmed = value.trim();
 if (!trimmed) return null;
 if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(trimmed)) return NaN;
 const [units, fraction = ''] = trimmed.replaceAll('.', '').split(',');
 return Number(units) * 100 + Number(fraction.padEnd(2, '0'));
}

function campaignKey(row) {
 return row.origin + '/' + row.campaign;
}

function renderTotals() {
 let wins = 0;
 let proposals = 0;
 let revenue = 0;
 let newContacts = 0;
 for (const row of rows) {
  if (row.stage === 'novo') newContacts++;
  if (row.stage === 'proposta') proposals++;
  if (row.stage === 'ganho') {
   const cents = Number(row.value_cents);
   wins++;
   revenue += cents;
  }
 }
 $('total-new').textContent = newContacts;
 $('total-proposals').textContent = proposals;
 $('total-won').textContent = wins;
 $('total-revenue').textContent = currency.format(revenue / 100);

}

function followupState(row, today) {
 if (!row.due_on || row.stage === 'ganho' || row.stage === 'perdido') return '';
 if (row.due_on < today) return 'late';
 return row.due_on === today ? 'due' : 'future';
}

const searchable = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
function renderList() {
 const query = searchable($('search').value.trim());
 const stage = $('filter').value;
 const today = localDay.format(new Date());
 const followups = rows.map(row => ({row, due: followupState(row,today)}));
 $('due-count').textContent = followups.filter(entry => entry.due === 'due').length;
 $('late-count').textContent = followups.filter(entry => entry.due === 'late').length;
 const visible = followups.filter(({row,due}) => (!stage || stage === row.stage) &&
  (!followupFilter || followupFilter === due) &&
  searchable([row.name, row.company, row.email, row.reference, campaignKey(row)].join(' ')).includes(query));
 if (followupFilter) visible.sort((a,b) => a.row.due_on.localeCompare(b.row.due_on));
 const fragment = document.createDocumentFragment();
 for (const {row,due} of visible) {
  const item = el('li');
  const button = el('button', 'lead');
  button.type = 'button';
  button.dataset.reference = row.reference;
  button.setAttribute('aria-pressed', String(current?.reference === row.reference));
  const left = el('span');
  left.append(el('span', 'lead-title', row.name),
   el('span', 'lead-meta', [row.company, channels[row.channel], campaignKey(row)].filter(Boolean).join(' · ')));
  if (row.next_step) left.append(el('span', 'lead-next', row.next_step));
  if (row.notification_status === 'failed') left.append(el('span','lead-alert','Falha no aviso por e-mail'));
  if (row.notification_status === 'pending') left.append(el('span','lead-meta','Aviso por e-mail na fila'));
  if (due) {
   const date = dateLabel.format(new Date(row.due_on + 'T00:00:00Z'));
   const text = due === 'late' ? 'Retorno atrasado' : due === 'due' ? 'Retorno hoje' : 'Retorno em';
   const caption = el('span','lead-due', text + ' · ' + date);
   caption.dataset.due = due;
   left.append(caption);
  }
  const badge = el('span', 'lead-stage', stages[row.stage]);
  badge.dataset.stage = row.stage;
  button.append(left, badge);
  button.addEventListener('click', () => openEditor(row, row.reference));
  item.append(button);
  fragment.append(item);
 }
 $('leads').replaceChildren(fragment);
 status('list-status', visible.length ? '' : rows.length ? 'Nenhum contato corresponde à busca.' :
  'Os pedidos do site aparecem aqui. Você também pode cadastrar um contato recebido por WhatsApp ou e-mail.');
}

async function refresh() {
 $('refresh').disabled = true;
 status('list-status', 'Carregando contatos…');
 try {
  ({rows} = await api('list'));
  renderList();
  renderTotals();
  funnel.refresh();
 } catch (error) {
  status('list-status', error.message, true);
 } finally {
  $('refresh').disabled = false;
 }
}

function openEditor(row, trigger) {
 returnFocus = trigger;
 current = row;
 reference = row?.reference || '';
 leadForm.reset();
 if (row) {
  for (const key of ['name', 'company', 'email', 'channel', 'stage', 'origin', 'campaign', 'medium', 'creative', 'next_step', 'due_on', 'message']) field(key).value = row[key] ?? '';
  field('amount').value = row.value_cents ? decimal.format(row.value_cents / 100) : '';
 }
 $('paste').hidden = Boolean(row);
 $('paste').open = false;
 $('reference').textContent = reference;
 $('editor-heading').textContent = row ? 'Editar contato' : 'Novo contato';
 status('editor-status');
 $('editor').hidden = false;
 renderList();
 $('editor-heading').focus();
 $('editor').scrollIntoView({block: 'nearest'});
}

function closeEditor() {
 current = null;
 reference = '';
 leadForm.reset();
 $('editor').hidden = true;
 renderList();
 const original = [...$('leads').querySelectorAll('button')].find(button => button.dataset.reference === returnFocus);
 (original || $('new')).focus();
}

$('read-message').addEventListener('click', () => {
 const pasted = $('pasted').value;
 const read = label => pasted.match(new RegExp('^\\s*' + label + ':\\s*([^\\r\\n]+)', 'mi'))?.[1]?.trim();
 const match = read('Referência')?.toUpperCase();
 if (!match || !/^CD-[A-Z0-9]{12}$/.test(match)) return status('editor-status', 'A mensagem precisa incluir a referência da campanha.', true);
 const existing = rows.find(row => row.reference === match);
 if (existing) {
  openEditor(existing, returnFocus);
  status('editor-status', 'Este contato já foi recebido. Você pode atualizar a etapa ou a próxima ação.');
  return;
 }
 reference = match;
 $('reference').textContent = reference;
 field('origin').value = read('Origem') || 'direto';
 field('campaign').value = read('Campanha') || 'direto';
 field('medium').value = read('Meio') || '';
 field('creative').value = read('Criativo') || '';
 field('message').value = pasted.slice(0, 3000);
 status('editor-status', 'Campanha preenchida. Confira o nome e o canal antes de salvar.');
});

leadForm.addEventListener('submit', async event => {
 event.preventDefault();
 const data = Object.fromEntries(new FormData(leadForm));
 const amount = currencyToCents(data.amount);
 if ((amount !== null && (!Number.isSafeInteger(amount) || amount < 1 || amount > 2147483647)) ||
     (data.stage === 'ganho' && amount === null)) {
  status('editor-status', 'Informe o valor da venda. Use o formato 4.800,00.', true);
  return field('amount').focus();
 }
 const button = leadForm.querySelector('button[type=submit], .primary');
 button.disabled = true;
 status('editor-status', 'Salvando contato…');
 try {
  const {row} = await api('save', current ? 'PATCH' : 'POST', {
   ...data, origin: data.origin.toLowerCase(), campaign: data.campaign.toLowerCase(),
   medium: data.medium.toLowerCase(), creative: data.creative.toLowerCase(),
   reference, revision: current?.revision, value_cents: amount
  });
  rows = [row, ...rows.filter(item => item.reference !== row.reference)];
  openEditor(row, returnFocus);
  renderTotals();
  funnel.refresh();
  status('editor-status', 'Contato salvo.');
 } catch (error) {
  status('editor-status', error.message, true);
 } finally {
  button.disabled = false;
 }
});

function showWorkspace(signedIn) {
 $('initial').hidden = true;
 $('login').hidden = signedIn;
 $('workspace').hidden = !signedIn;
 $('logout').hidden = !signedIn;
 if (signedIn) return refresh();
}

$('login-form').addEventListener('submit', async event => {
 event.preventDefault();
 const form = event.currentTarget;
 const button = form.querySelector('button');
 button.disabled = true;
 status('login-status', 'Entrando…');
 try {
  await api('login', 'POST', Object.fromEntries(new FormData(form)));
  form.reset();
  status('login-status');
  await showWorkspace(true);
  $('new').focus();
 } catch (error) {
  status('login-status', error.message, true);
 } finally {
  button.disabled = false;
 }
});
$('logout').addEventListener('click', async () => {
 $('logout').disabled = true;
 try {
  await api('logout', 'POST', {});
  rows = [];
  closeEditor();
  renderTotals();
  funnel.reset();
  await showWorkspace(false);
  $('login-form').elements.namedItem('password').focus();
 } catch (error) {
  status('list-status', error.message, true);
 } finally {
  $('logout').disabled = false;
 }
});

$('new').addEventListener('click', () => openEditor(null, 'new'));
$('close').addEventListener('click', closeEditor);
$('search').addEventListener('input', renderList);
$('filter').addEventListener('change', renderList);
for (const button of followupButtons) {
 button.addEventListener('click', () => {
  followupFilter = button.dataset.followup;
  for (const option of followupButtons) option.setAttribute('aria-pressed', String(option === button));
  renderList();
 });
}
window.addEventListener('focus', () => {
 if (!$('workspace').hidden) renderList();
});
$('refresh').addEventListener('click', refresh);
api('session').then(() => showWorkspace(true)).catch(error => {
 showWorkspace(false);
 if (error.message !== errorText.session) status('login-status', error.message, true);
});
