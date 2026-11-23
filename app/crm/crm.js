import { initFunnel } from './funnel.js';
import { initOperations } from './operations.js';
import { initTeam, teamText } from './team.js';
import { initPerformancePage } from './performance.js';
import { initClients } from './clients.js';
import { initPipeline } from './pipeline.js';

const t = text => window.caosTranslate?.(text) ?? text;
const $ = id => document.getElementById(id);
const stages = {novo: 'Novo', conversa: 'Em conversa', proposta: 'Proposta enviada', negociacao: 'Negociação', ganho: 'Fechado', perdido: 'Perdido'};
const channels = {site: 'Formulário do site', whatsapp: 'WhatsApp', email: 'E-mail', outro: 'Outro'};
const currency = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
const decimal = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2});
const leadForm = $('lead-form');
const field = name => leadForm.elements.namedItem(name);
const editorPanel = $('editor');
const legacyEditorParent = editorPanel.parentElement;
const clientDialog = $('client-editor-dialog');
const errorText = {
 unavailable: 'Serviço indisponível agora. Tente novamente em instantes.',
 rate: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
 session: 'Sua sessão terminou. Recarregue a página para entrar novamente.',
 duplicate: 'Essa referência já está cadastrada. Busque o contato para editar.',
 stale: 'Esse contato foi alterado em outra aba. Reabra o registro atualizado antes de salvar.',
 key: 'Chave de acesso incorreta.',
 invalid_visit_reference: 'Use a referência CD- seguida de 12 letras maiúsculas ou números.',
 invalid: 'Revise os campos e envie novamente.',
 missing_contact: 'Não encontrei este contato. Atualize a lista e tente novamente.',
 missing_client: 'Não encontrei este contato. Atualize a lista e tente novamente.',
 missing_appointment: 'Não encontrei este compromisso. Atualize a agenda.',
 conflict: 'Já existe um registro com esta referência. Atualize antes de tentar novamente.',
 state: 'Este compromisso já foi encerrado. Atualize a agenda.',
 forbidden: 'Sua conta não tem acesso a esta ação.',
 missing_member: 'A conta selecionada não está disponível.',
 invalid_owner: 'Selecione uma pessoa ativa como responsável.',
 invalid_assignee: 'Selecione uma pessoa ativa para o compromisso.',
 first_contact_required: 'Registre um contato confirmado antes de avançar.',
 stage_transition: 'Use Mover etapa no funil para atualizar a etapa.',
 closed_opportunity: 'Reabra a oportunidade no funil para definir um novo retorno.',
 proposal_required: 'Informe o valor, a data de envio e o próximo retorno da proposta.',
 followup_required: 'Informe a próxima ação e a data de retorno.',
 closure_required: 'Informe a data e os dados do fechamento.',
 reason_required: 'Informe o motivo para continuar.'
};
let rows = [];
let current = null;
let reference = '';
let returnFocus;
let relatedClient;
let projectEditor = false;
let clientChoices = [];
let newClientDraft = {};
let followupFilter = '';
const followupButtons = [...document.querySelectorAll('[data-followup]')];
const localDay = new Intl.DateTimeFormat('sv-SE', {timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit'});
const dateLabel = new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC', day:'2-digit', month:'2-digit', year:'numeric'});
const funnel = initFunnel(query => api('funnel&' + query));
let actor = null;
let teamEnabled = false;
let clientsEnabled = false;
let pipelineEnabled = false;
let sessionGeneration = 0;
const team = initTeam(api, () => actor, signOutLocally, {
 hasClients: () => clientsEnabled,
 openClient: openContact,
 openClients: memberId=>navigate('clientes',{ownerId:actor?.role==='admin' ? memberId : ''}),
 openPerformance: (memberId,days)=>navigate('desempenho',{memberId,days})
});
const operations = initOperations(api, navigate, openContact, () => actor);
const performancePage = initPerformancePage(api, () => actor);
const clients = initClients(api, () => actor, {
 newContact: () => openClientEditor(),
 editOpportunity: editClientOpportunity,
 addOpportunity: addClientOpportunity,
 logActivity: ref => logClientActivity(ref),
 scheduleFollowup: data => api('client-followup', 'PATCH', data)
});
const pipeline = initPipeline(api, () => actor, {
 newOpportunity: newPipelineOpportunity,
 editOpportunity: ref=>editClientOpportunity(ref,true),
 logActivity: logClientActivity,
 openClient: openContact
});
const operationalRoutes = new Set(['hoje','agenda','atendimentos']);
const navigation = [...document.querySelectorAll('[data-op-nav]')];
let currentRoute;

for (const [value, label] of Object.entries(stages)) {
 field('stage').add(new Option(t(label), value));
 if (value!=='negociacao') $('filter').add(new Option(t(label), value));
}

async function api(action, method = 'GET', payload) {
 const generation=sessionGeneration;
 const init = {method, signal: AbortSignal.timeout(12000)};
 if (payload) {
  init.headers = {'Content-Type': 'application/json'};
  init.body = JSON.stringify(payload);
 }
 let data;
 try {
  const response = await fetch('/api/crm?action=' + action, init);
  data = await response.json();
  if (response.status===401 && data.error==='session' && generation===sessionGeneration && !$('workspace').hidden) {
   await signOutLocally('Sua sessão terminou. Entre novamente.');
  }
  if (!response.ok) throw new Error(data.error);
  return data;
 } catch (error) {
  const copy = action==='appointment' && error.message==='stale'
   ? 'Este compromisso mudou em outra aba. Atualize a agenda antes de salvar.'
   : error.message==='key' && action==='password' ? 'Senha atual incorreta.'
   : error.message==='key' && teamEnabled ? 'E-mail ou senha incorretos.'
   : error.message==='duplicate' && action==='team' ? 'Já existe uma conta com este e-mail.'
   : errorText[error.message] || errorText.unavailable;
  const failure = new Error(copy);
  failure.code = error.message;
  failure.data = data;
  throw failure;
 }
}

function status(id, message = '', error = false) {
 const item = $(id);
 item.dataset.crmMessage = message;
 item.textContent = teamText(message);
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
  if (row.stage === 'proposta' || row.stage === 'negociacao') proposals++;
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
   el('span', 'lead-meta', [row.company, t(channels[row.channel]), campaignKey(row)].filter(Boolean).join(' · ')));
  if (actor) left.append(el('span','lead-meta',teamText('Responsável') + ' · ' + (row.owner_name || teamText('Sem responsável'))));
  if (row.next_step) left.append(el('span', 'lead-next', row.next_step));
  if (row.notification_status === 'failed') left.append(el('span','lead-alert',t('Falha no aviso por e-mail')));
  if (row.notification_status === 'pending') left.append(el('span','lead-meta',t('Aviso por e-mail na fila')));
  if (due) {
   const date = dateLabel.format(new Date(row.due_on + 'T00:00:00Z'));
   const text = due === 'late' ? 'Retorno atrasado' : due === 'due' ? 'Retorno hoje' : 'Retorno em';
   const caption = el('span','lead-due', t(text) + ' · ' + date);
   caption.dataset.due = due;
   left.append(caption);
  }
  const badge = el('span', 'lead-stage', t(stages[row.stage]));
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
 const generation = sessionGeneration;
 $('refresh').disabled = true;
 status('list-status', 'Carregando contatos…');
 try {
  const result = await api('list');
  if (generation !== sessionGeneration) return;
  rows = result.rows;
  renderList();
  renderTotals();
 } catch (error) {
  if (generation === sessionGeneration) status('list-status', error.message, true);
 } finally {
  $('refresh').disabled = false;
 }
}

function renderOwner(selected = current ? current.owner_id : actor?.id) {
 const select = field('owner_id');
 const caption = $('lead-owner-caption');
 const directory = team.members();
 const editable = actor?.role==='admin' && Boolean(directory) && !relatedClient && !(current?.client_reference && current.client_reference!==current.reference);
 $('lead-owner-field').hidden = !editable;
 select.disabled = !editable;
 caption.hidden = !actor || editable;
 caption.textContent = actor ? teamText('Responsável') + ' · ' +
  (relatedClient || current ? (relatedClient ?? current).owner_name || teamText('Sem responsável') : actor.name) : '';
 if (!editable) return;
 select.replaceChildren(new Option(teamText('Sem responsável'),''), ...directory
  .filter(member => member.active || member.id === selected)
  .map(member => new Option(member.name + (member.active ? '' : ' · ' + teamText('Inativa')), member.id)));
 select.value = selected || '';
}

function openEditor(row, trigger, options = {}) {
 returnFocus = trigger;
 current = row;
 reference = row?.reference || '';
 relatedClient = options.relatedClient;
 const linkedProject=Boolean(row?.client_reference && row.client_reference!==row.reference);
 projectEditor = Boolean(options.project || relatedClient || linkedProject);
 leadForm.reset();
 if (row) {
  for (const key of ['name', 'company', 'email', 'channel', 'stage', 'origin', 'campaign', 'medium', 'creative', 'visit_reference', 'next_step', 'due_on', 'message']) field(key).value = row[key] ?? '';
  field('amount').value = row.value_cents ? decimal.format(row.value_cents / 100) : '';
  field('project_name').value = row.project_name ?? '';
 }
 field('visit_reference').readOnly = Boolean(row?.attributed_visit_id);
 for (const key of ['origin', 'campaign', 'medium', 'creative']) field(key).readOnly = Boolean(row?.attributed_visit_id);
 if (relatedClient) for (const key of ['name','company','email','channel']) field(key).value=relatedClient[key] ?? '';
 renderContactFields(Boolean(relatedClient || linkedProject));
 $('lead-client-field').hidden=true;
 $('lead-project').hidden=!clientsEnabled || !projectEditor;
 field('project_name').disabled=$('lead-project').hidden;
 field('project_name').required=pipelineEnabled && projectEditor && !row;
 if (field('project_name').required) field('next_step').value=t('Fazer primeiro contato');
 $('lead-stage').hidden=pipelineEnabled;
 $('lead-amount').hidden=pipelineEnabled;
 const closed=pipelineEnabled && ['ganho','perdido'].includes(row?.stage);
 $('lead-followup').hidden=closed;
 field('next_step').disabled=closed;
 field('due_on').disabled=closed;
 $('lead-open-pipeline').hidden=!pipelineEnabled || !row || currentRoute!=='clientes';
 renderOwner();
 if (actor?.role === 'admin' && !team.members()) {
  team.load().then(() => { if (!$('editor').hidden && current === row) renderOwner(); });
 }
 $('paste').hidden = Boolean(row || relatedClient);
 $('history-contact').hidden = !row || clientDialog.open;
 $('paste').open = false;
 $('reference').textContent = reference;
 paintEditorHeading();
 status('editor-status');
 $('editor').hidden = false;
 renderList();
 $('editor-heading').focus();
 $('editor').scrollIntoView({block: 'nearest'});
}

function renderContactFields(hidden) {
 for (const id of ['lead-name','lead-company','lead-email']) $(id).hidden=hidden;
}

function renderClientChoices() {
 const select=$('lead-client');
 const remembered=relatedClient?.reference || '';
 select.replaceChildren(new Option(t('Cadastrar novo cliente'),''),
  ...clientChoices.map(client=>new Option(client.company ? client.name+' · '+client.company : client.name,client.reference)));
 select.value=remembered;
}

async function newPipelineOpportunity() {
 const {clients}=await api('clients');
 if (currentRoute!=='oportunidades' || clientDialog.open) return;
 clientChoices=clients;
 openClientEditor(null,{project:true});
 renderClientChoices();
 $('lead-client-field').hidden=false;
}

$('lead-client').addEventListener('change',event=>{
 const keys=['name','company','email'];
 if (!relatedClient) newClientDraft=Object.fromEntries(keys.map(key=>[key,field(key).value]));
 relatedClient=clientChoices.find(client=>client.reference===event.target.value);
 for (const key of keys) field(key).value=(relatedClient ?? newClientDraft)[key] || '';
 renderContactFields(Boolean(relatedClient));
 renderOwner();
});

function paintEditorHeading() {
 $('editor-heading').textContent=t(projectEditor ? (current ? 'Editar oportunidade' : 'Nova oportunidade') :
  (current ? 'Editar contato' : 'Novo contato'));
 leadForm.querySelector('.primary').textContent=t(projectEditor ? 'Salvar oportunidade' : 'Salvar contato');
}

function closeEditor(restore = true) {
 const modal=clientDialog.open;
 current = null;
 reference = '';
 relatedClient = undefined;
 projectEditor = false;
 clientChoices = [];
 newClientDraft = {};
 $('lead-client').replaceChildren();
 leadForm.reset();
 editorPanel.hidden = true;
 if (modal) {
  clientDialog.close();
  legacyEditorParent.append(editorPanel);
 }
 renderList();
 if (modal || !restore) return;
 const original = [...$('leads').querySelectorAll('button')].find(button => button.dataset.reference === returnFocus);
 (original || $('new')).focus();
}

function openClientEditor(row, options) {
 if (clientDialog.open) return;
 clientDialog.append(editorPanel);
 clientDialog.showModal();
 openEditor(row, row?.reference, options);
}

async function editClientOpportunity(ref, project = false) {
 const from=currentRoute;
 const result=await api('client&' + new URLSearchParams({reference:ref}));
 const row=result.opportunities.find(item=>item.reference===ref);
 if (!row) throw new Error(t('Não encontrei este contato. Atualize a lista e tente novamente.'));
 if (currentRoute===from) openClientEditor(row,{project:project || row.reference!==result.client.reference});
}

async function addClientOpportunity(ref) {
 const {client,opportunities}=await api('client&' + new URLSearchParams({reference:ref}));
 const root=opportunities.find(item=>item.reference===client.reference);
 if (currentRoute==='clientes' && root) openClientEditor(null,{relatedClient:root,project:true});
}

async function logClientActivity(ref) {
 const from=currentRoute;
 const {opportunities}=await api('client&'+new URLSearchParams({reference:ref}));
 const item=opportunities.find(row=>row.reference===ref);
 if (!item) throw new Error(t('Não encontrei este contato. Atualize a lista e tente novamente.'));
 if (currentRoute===from) operations.openClientActivity(item,async ()=>{
  if (currentRoute!==from) return;
  const destination=from==='oportunidades' ? pipeline : clients;
  await destination.refresh();
  destination.notify('Atividade registrada.');
 });
}

$('read-message').addEventListener('click', async () => {
 const pasted = $('pasted').value;
 const read = label => pasted.match(new RegExp('^\\s*' + label + ':\\s*([^\\r\\n]+)', 'mi'))?.[1]?.trim();
 const match = read('Referência')?.toUpperCase();
 if (!match || !/^CD-[A-Z0-9]{12}$/.test(match)) return status('editor-status', 'A mensagem precisa incluir a referência da campanha.', true);
 let existing = rows.find(row => row.reference === match);
 if (clientDialog.open && !existing) {
  try {
   const result=await api('client&' + new URLSearchParams({reference:match}));
   existing=result.opportunities.find(item=>item.reference===match);
  } catch (error) {
   if (!['missing_client','missing_contact'].includes(error.code)) {
    return status('editor-status',error.message,true);
   }
  }
  if (!clientDialog.open || $('pasted').value!==pasted) return;
 }
 if (existing) {
  openEditor(existing, returnFocus);
  status('editor-status', 'Este contato já foi recebido. Você pode atualizar a etapa ou a próxima ação.');
  return;
 }
 reference = match;
 field('visit_reference').value = match;
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
 $('close').disabled = true;
 status('editor-status', 'Salvando contato…');
 try {
  const generation = sessionGeneration;
  const modal=clientDialog.open;
  const isProject=projectEditor;
  const originRoute=currentRoute;
  const {row} = await api('save', current ? 'PATCH' : 'POST', {
   ...data, origin: data.origin.toLowerCase(), campaign: data.campaign.toLowerCase(),
   medium: data.medium.toLowerCase(), creative: data.creative.toLowerCase(),
   reference, revision: current?.revision, value_cents: amount,
   visit_reference: data.visit_reference.trim().toUpperCase(),
   ...(relatedClient ? {client_reference:relatedClient.reference} : {}),
   ...(data.owner_id === undefined || (current && (data.owner_id || null) === current.owner_id) ? {} :
    {owner_id:data.owner_id || null})
  });
  if (generation !== sessionGeneration) return;
  rows = [row, ...rows.filter(item => item.reference !== row.reference)];
  if (modal) {
   if (currentRoute===originRoute) {
    if (clientDialog.open) closeEditor(false);
    const inPipeline=originRoute==='oportunidades';
    const destination=inPipeline ? pipeline : clients;
    await destination.refresh();
    await destination.select(inPipeline ? row.reference : row.client_reference || row.reference,{focus:true});
    destination.notify(isProject ? 'Oportunidade salva.' : 'Contato salvo.');
   }
   return;
  }
  openEditor(row, returnFocus);
  renderTotals();
  status('editor-status', 'Contato salvo.');
 } catch (error) {
  status('editor-status', error.message, true);
 } finally {
  button.disabled = false;
  $('close').disabled = false;
 }
});

async function showRoute(route, focus = false, options) {
 if ($('workspace').hidden) return;
 const destination = navigation.find(link=>link.dataset.opNav===route && !link.hidden);
 if (!destination) route='hoje';
 currentRoute=route;
 const accountLink = $('crm-identity').querySelector('a');
 if (route==='equipe') accountLink?.setAttribute('aria-current','page');
 else accountLink?.removeAttribute('aria-current');
 for (const link of navigation) {
  if (link.dataset.opNav===route) link.setAttribute('aria-current','page');
  else link.removeAttribute('aria-current');
 }
 const operational = operationalRoutes.has(route);
 const reports = route==='desempenho';
 const isTeamPage = route==='equipe';
 const clientsPage = route==='clientes' && clientsEnabled;
 const pipelinePage = route==='oportunidades' && pipelineEnabled;
 const canSeeCampaigns = reports && (!actor || actor.role==='admin');
 const contacts = !operational && !reports && !isTeamPage && !clientsPage && !pipelinePage;
 if (clientDialog.open) closeEditor(false);
 $('clients-page').hidden=!clientsPage;
 $('pipeline-page').hidden=!pipelinePage;
 $('team-panel').hidden=!isTeamPage;
 if (!isTeamPage) team.hide?.();
 $('performance-page').hidden=!reports;
 if (!reports) performancePage.reset();
 $('legacy-workspace').hidden=!contacts && !canSeeCampaigns;
 $('legacy-workspace').querySelector('.page-heading').hidden=!contacts;
 $('legacy-workspace').querySelector('.workspace-grid').hidden=!contacts;
 $('legacy-workspace').querySelector('.totals').hidden=!contacts || route==='clientes';
 $('campaign-report').hidden=!canSeeCampaigns;
 $('heading').textContent=t(route==='clientes'?'Clientes':'Oportunidades');
 if (focus) {
  window.scrollTo(0,0);
 }
 let ready;
 if (operational) ready=operations.show(route);
 else {
  operations.hide();
  if (reports) {
   ready=performancePage.show(options);
   if (canSeeCampaigns) funnel.refresh();
  } else if (isTeamPage) ready=team.show();
  else if (clientsPage) ready=clients.show(options);
  else if (pipelinePage) ready=pipeline.show();
  else ready=refresh();
 }
 if (focus) {
  const heading = routeHeading();
  heading.setAttribute('tabindex','-1');
  heading.focus({preventScroll:true});
 }
 return ready;
}

function routeHeading() {
 if (operationalRoutes.has(currentRoute)) return $('operations-title');
 if (currentRoute==='desempenho') return $('performance-title');
 if (currentRoute==='clientes' && clientsEnabled) return $('clients-title');
 if (currentRoute==='oportunidades' && pipelineEnabled) return $('pipeline-title');
 return currentRoute==='equipe' ? $('team-heading') : $('heading');
}

function navigate(route, options) {
 if (route!==location.hash.slice(1)) history.pushState(options ?? null,'','#'+route);
 return showRoute(route,true,options);
}

async function openContact(ref) {
 if (clientsEnabled) {
  await navigate('clientes');
  return clients.select(ref,{focus:true});
 }
 $('search').value='';
 $('filter').value='';
 followupFilter='';
 for (const button of followupButtons) button.setAttribute('aria-pressed',String(button.dataset.followup===''));
 await navigate('clientes');
 const lead=rows.find(row=>row.reference===ref);
 if (lead) openEditor(lead,ref);
}

function showWorkspace(signedIn) {
 $('initial').hidden = true;
 $('login').hidden = signedIn;
 $('workspace').hidden = !signedIn;
 $('logout').hidden = !signedIn;
 renderIdentity();
 if (signedIn) return showRoute(location.hash.slice(1) || 'hoje',false,history.state ?? undefined);
 operations.hide();
 operations.resetAgenda();
 performancePage.reset();
 clients.reset();
 pipeline.reset();
}

function renderIdentity() {
 const loginEmail = $('login-email');
 const email = loginEmail.querySelector('input');
 loginEmail.hidden = !teamEnabled;
 email.disabled = !teamEnabled;
 email.required = teamEnabled;
 $('login-password-label').textContent = teamEnabled ? teamText('Senha') : t('Chave de acesso');
 const teamLink = navigation.find(link => link.dataset.opNav === 'equipe');
 teamLink.hidden = !actor;
 teamLink.textContent = teamText(actor?.role==='admin' ? 'Equipe' : 'Minha conta');
 const identity = $('crm-identity');
 identity.hidden = !actor;
 identity.replaceChildren();
 if (actor) {
  const link = el('a','crm-identity-account',teamLink.textContent);
  link.href = '#equipe';
  if (currentRoute === 'equipe') link.setAttribute('aria-current','page');
  link.addEventListener('click',event=>{
   if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
   event.preventDefault();
   navigate('equipe');
  });
  identity.append(el('strong','',actor.name),
   el('span','',teamText(actor.role==='admin'?'Administrador':'Atendente')),link);
 }
}

async function signOutLocally(message='') {
 sessionGeneration++;
 status('session-status');
 actor = null;
 rows = [];
 closeEditor();
 renderTotals();
 funnel.reset();
 team.reset();
 await showWorkspace(false);
 status('login-status',message);
 $('login-form').elements.namedItem(teamEnabled ? 'email' : 'password').focus();
}

$('login-form').addEventListener('submit', async event => {
 event.preventDefault();
 const form = event.currentTarget;
 const button = form.querySelector('button');
 button.disabled = true;
 status('login-status', 'Entrando…');
 try {
  const session = await api('login', 'POST', Object.fromEntries(new FormData(form)));
  actor = session.actor ?? null;
  teamEnabled = Boolean(session.team);
  clientsEnabled = Boolean(session.clients);
  pipelineEnabled = Boolean(session.pipeline);
  form.reset();
  status('login-status');
  await showWorkspace(true);
  const title = routeHeading();
  title.setAttribute('tabindex','-1');
  title.focus();
 } catch (error) {
  status('login-status', error.message, true);
 } finally {
  button.disabled = false;
 }
});
$('logout').addEventListener('click', async () => {
 $('logout').disabled = true;
 status('session-status');
 try {
  await api('logout', 'POST', {});
  await signOutLocally();
 } catch (error) {
  status('session-status', error.message, true);
 } finally {
  $('logout').disabled = false;
 }
});

$('new').addEventListener('click', () => openEditor(null, 'new'));
$('close').addEventListener('click',()=>closeEditor());
clientDialog.addEventListener('cancel',event=>{
 event.preventDefault();
 if (!leadForm.querySelector('.primary').disabled) closeEditor();
});
$('search').addEventListener('input', renderList);
$('filter').addEventListener('change', renderList);
for (const button of followupButtons) {
 button.addEventListener('click', () => {
  followupFilter = button.dataset.followup;
  for (const option of followupButtons) option.setAttribute('aria-pressed', String(option === button));
  renderList();
 });
}
document.addEventListener('caos-language-change', () => {
 for (const select of [field('stage'), $('filter')]) {
  for (const option of select.options) {
   if (option.value) option.textContent = t(stages[option.value]);
  }
 }
 for (const item of document.querySelectorAll('[data-crm-message]')) item.textContent = teamText(item.dataset.crmMessage);
 paintEditorHeading();
 $('heading').textContent = t(currentRoute==='clientes'?'Clientes':'Oportunidades');
 renderIdentity();
 if (!$('editor').hidden) renderOwner(field('owner_id').value);
 if (!$('lead-client-field').hidden) renderClientChoices();
 if (!$('workspace').hidden) renderList();
});
window.addEventListener('focus', () => {
 if (!$('workspace').hidden) renderList();
});
$('refresh').addEventListener('click', refresh);
$('history-contact').addEventListener('click',()=>{
 if (!current) return;
 operations.selectHistory(current.reference);
 navigate('atendimentos');
});
$('lead-open-pipeline').addEventListener('click',async ()=>{
 const ref=current?.reference;
 if (!ref) return;
 await navigate('oportunidades');
 await pipeline.select(ref,{focus:true});
});
for (const link of document.querySelectorAll('[data-op-nav], .operations-link')) {
 link.addEventListener('click',event=>{
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(link.hash.slice(1));
 });
}
window.addEventListener('hashchange',()=>{
 const route=location.hash.slice(1) || 'hoje';
 if (route!==currentRoute) showRoute(route,true,history.state ?? undefined);
});
api('session').then(session => {
 actor = session.actor ?? null;
 teamEnabled = Boolean(session.team);
 clientsEnabled = Boolean(session.clients);
 pipelineEnabled = Boolean(session.pipeline);
 return showWorkspace(true);
}).catch(error => {
 teamEnabled = Boolean(error.data?.team);
 showWorkspace(false);
 if (error.code !== 'session') status('login-status', error.message, true);
});
