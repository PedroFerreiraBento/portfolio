const english = {
 'Equipe':'Team','Minha conta':'My account','Administrador':'Administrator','Atendente':'Team member',
 'Responsável':'Owner','Sem responsável':'Unassigned','Senha':'Password','Inativa':'Inactive','Ativa':'Active',
 'Gerencie quem atende os clientes e acompanha a operação.':'Manage who serves clients and oversees the workspace.',
 'Gerencie a senha usada para entrar no CRM.':'Manage the password you use to sign in to the CRM.',
 'Pessoas':'People','Criar conta':'Create account','Nome':'Name','E-mail':'Email','Senha inicial':'Initial password',
 'Defina uma senha inicial para a pessoa alterar no primeiro acesso.':'Set an initial password for this person to change when they first sign in.',
 'A senha deve ter pelo menos 12 caracteres.':'Use at least 12 characters.',
 'Alterar minha senha':'Change my password','Senha atual':'Current password','Nova senha':'New password',
 'Ao salvar, você precisará entrar novamente.':'After saving, sign in again with your new password.',
 'Salvar nova senha':'Save new password','Conta criada.':'Account created.',
 'Conta ativada.':'Account activated.','Conta desativada.':'Account deactivated.',
 'Senha redefinida.':'Password reset.','Ativar':'Activate','Desativar':'Deactivate',
 'Redefinir senha':'Reset password','Cancelar':'Cancel','Salvando…':'Saving…',
 'Carregando equipe…':'Loading team…','Tentar novamente':'Try again',
 'Já existe uma conta com este e-mail.':'An account with this email already exists.',
 'Sua conta não tem acesso a esta ação.':'Your account does not have access to this action.',
 'A conta selecionada não está disponível.':'This account is unavailable.',
 'E-mail ou senha incorretos.':'Incorrect email or password.',
 'Senha alterada. Entre com a nova senha.':'Password changed. Sign in with your new password.',
 'Senha atual incorreta.':'Current password is incorrect.',
 'Registrado por':'Recorded by',
 'Atendimentos da equipe':'Team conversations'
};

export function teamText(label) {
 return document.documentElement.lang.startsWith('en') ? (english[label] ?? window.caosTranslate?.(label) ?? label) : label;
}

const workspaceText = {
 'Acompanhe carteiras, resultados e acessos da equipe.':'Track the team’s clients, performance, and access.',
 'Acompanhe sua carteira, seus resultados e seu acesso.':'Track your clients, performance, and access.',
 'Contas ativas':'Active accounts','Contas inativas':'Inactive accounts',
 'Buscar pessoa':'Find a person','Nome ou e-mail':'Name or email',
 'Situação da conta':'Account status','Todas as contas':'All accounts',
 'Nenhuma pessoa encontrada.':'No matching people.',
 'Minhas informações':'My information','Minha carteira':'My clients',
 'Retornos atrasados':'Overdue follow-ups','Clientes na carteira':'Assigned clients',
 'Retorno atrasado':'Overdue follow-up','Cliente na carteira':'Assigned client',
 'Carteira':'Clients','Desempenho':'Performance','Acesso':'Access','Voltar para equipe':'Back to team',
 'Ver carteira em Clientes':'Open in Clients','Ver relatório completo':'Open full report',
 'Buscar cliente':'Find a client','Nome, empresa ou referência':'Name, company, or reference',
 'Cliente':'Client','Etapa':'Stage','Próximo retorno':'Next follow-up','Sem ação definida':'No next step',
 'Novo':'New','Em conversa':'In conversation','Proposta enviada':'Proposal sent',
 'Negociação':'Negotiation','Fechado':'Won','Perdido':'Lost',
 'Nenhum cliente vinculado a esta pessoa.':'No clients are assigned to this person.',
 'Nenhum cliente corresponde à busca.':'No clients match your search.',
 'Carteira indisponível nesta configuração.':'Client portfolios are unavailable in this configuration.',
 'Não foi possível carregar a carteira.':'Could not load clients.',
 'Carregando carteira…':'Loading clients…','Mostrar mais':'Show more',
 'Ligações':'Calls','Atendimentos':'Conversations','Vendas':'Sales',
 'Valor fechado':'Won value','No prazo':'On time','Período':'Period',
 'Últimos 7 dias':'Last 7 days','Últimos 30 dias':'Last 30 days','Últimos 90 dias':'Last 90 days',
 'Carregando desempenho…':'Loading performance…',
 'Não foi possível carregar o desempenho.':'Could not load performance.',
 'Atividades por semana':'Weekly activity','Atividades registradas':'Logged activities',
 'Acesso ao CRM':'CRM access','Sessões ativas':'Active sessions','Sessão ativa':'Active session',
 'Controla a entrada da pessoa no CRM.':'Controls whether this person can sign in to the CRM.',
 'Bloqueia a entrada e encerra as sessões atuais.':'Blocks sign-in and ends existing sessions.',
 'Permite que a pessoa volte a entrar no CRM.':'Allows this person to sign in again.',
 'Encerra as sessões atuais e exige um novo login.':'Ends existing sessions and requires a new sign-in.',
 'Defina uma nova senha e encerre as sessões atuais.':'Set a new password and end existing sessions.',
 'Encerrar sessões':'End sessions','Sessões encerradas.':'Sessions ended.',
 'Confirmar desativação':'Confirm deactivation','Confirmar encerramento':'Confirm ending sessions',
 'Acesso de administrador':'Administrator access',
 'Alteração de senha':'Password change','Atualize a senha da sua conta.':'Update your account password.',
 'Selecione uma pessoa para ver a carteira, o desempenho e o acesso.':'Select a person to view their clients, performance, and access.',
 'Novo acesso':'New account','A conta será criada com o perfil de atendente.':'The account will be created with the team member role.',
 'Registro de clientes':'Client list','Sem compromissos avaliáveis':'No eligible appointments',
 'Informações da pessoa':'Team member information','Atualizar sessões':'Refresh sessions',
};

const stages = {novo:'Novo',conversa:'Em conversa',proposta:'Proposta enviada',negociacao:'Negociação',ganho:'Fechado',perdido:'Perdido'};
const localDay = new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo'});
const searchText = value => String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const roleLabel = role => role==='admin' ? 'Administrador' : 'Atendente';

function element(tag, text='', className='') {
 const node=document.createElement(tag);
 if (text) node.textContent=text;
 if (className) node.className=className;
 return node;
}

function icon(name) {
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 const use=document.createElementNS(svg.namespaceURI,'use');
 svg.setAttribute('aria-hidden','true');
 use.setAttribute('href','#op-'+name);
 svg.append(use);
 return svg;
}

function shortDate(day, locale) {
 return new Intl.DateTimeFormat(locale,{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z'));
}

function isOverdue(client,today) {
 return Boolean(client.due_on && client.due_on<today && client.stage!=='ganho' && client.stage!=='perdido');
}

export function initTeam(api,getActor,onSignOut,callbacks={}) {
 const root=document.getElementById('team-panel');
 const t=label=>document.documentElement.lang.startsWith('en') ? workspaceText[label] ?? teamText(label) : label;
 const locale=()=>document.documentElement.lang.startsWith('en') ? 'en-GB' : 'pt-BR';
 const numeric=value=>new Intl.NumberFormat(locale()).format(value);
 const money=value=>new Intl.NumberFormat(locale(),{style:'currency',currency:'BRL'}).format(Number(value)/100);
 const oneColumn=window.matchMedia('(max-width: 720px)');
 const hasClients=()=>callbacks.hasClients?.()!==false;
 const admin=()=>getActor()?.role==='admin';
 const tabs=[['clients','Carteira'],['performance','Desempenho'],['access','Acesso']];
 const firstTab=()=>hasClients()?'clients':'performance';

 root.innerHTML = [
  '<div class="team-heading"><div><h1 id="team-heading" tabindex="-1"></h1><p id="team-intro"></p></div><button id="team-create-trigger" class="primary" type="button" hidden><span data-team-copy="Novo acesso"></span></button></div>',
  '<div id="team-overview" class="team-overview" hidden></div>',
  '<p id="team-notice" role="status"></p>',
  '<div id="team-directory" class="team-directory">',
  '<section id="team-roster" class="team-roster" aria-labelledby="team-roster-title" hidden>',
  '<div class="team-roster-head"><h2 id="team-roster-title" data-team-copy="Pessoas"></h2>',
  '<label><span data-team-copy="Buscar pessoa"></span><input id="team-search" type="search" maxlength="120"></label>',
  '<label><span data-team-copy="Situação da conta"></span><select id="team-account-filter"><option value="" data-team-copy="Todas as contas"></option><option value="active" data-team-copy="Contas ativas"></option><option value="inactive" data-team-copy="Contas inativas"></option></select></label>',
  '</div><p id="team-status" role="status"></p><button id="team-retry" type="button" class="quiet" data-team-copy="Tentar novamente" hidden></button>',
  '<ul id="team-member-list" class="team-member-list"></ul></section>',
  '<section id="team-profile" class="team-detail" aria-labelledby="team-person-title" hidden>',
  '<button id="team-back" class="quiet team-back" type="button" data-team-copy="Voltar para equipe" hidden></button>',
  '<div class="team-profile-heading" id="team-profile-heading"></div>',
  '<div id="team-tabs" class="team-tabs" role="tablist" aria-label="Informações da pessoa"></div>',
  '<section id="team-tab-panel" class="team-tab-panel" role="tabpanel">',
  '<div id="team-clients-view" hidden><div class="team-section-heading"><div><h3 id="team-client-heading"></h3><p id="team-client-count" class="team-note team-client-count"></p></div>',
  '<button id="team-clients-link" type="button" class="quiet" data-team-copy="Ver carteira em Clientes"></button></div>',
  '<label id="team-client-query"><span class="team-sr" data-team-copy="Buscar cliente"></span><input id="team-client-search" type="search" maxlength="120"></label>',
  '<div id="team-clients-content"></div></div>',
  '<div id="team-performance-view" hidden><div class="team-section-heading"><h3 data-team-copy="Desempenho"></h3>',
  '<label class="team-period"><span data-team-copy="Período"></span><select id="team-report-days"><option value="7" data-team-copy="Últimos 7 dias"></option><option value="30" selected data-team-copy="Últimos 30 dias"></option><option value="90" data-team-copy="Últimos 90 dias"></option></select></label></div><div id="team-performance-content"></div></div>',
  '<div id="team-access-view" hidden></div></section></section></div>',
  '<dialog id="team-dialog" class="client-form-dialog team-dialog" aria-labelledby="team-dialog-title">',
  '<div class="team-dialog-heading"><h2 id="team-dialog-title"></h2><button type="button" class="quiet" id="team-dialog-close" data-team-copy="Cancelar"></button></div>',
  '<form id="team-create" hidden><p class="team-note" data-team-copy="A conta será criada com o perfil de atendente."></p>',
  '<label><span data-team-copy="Nome"></span><input name="name" required minlength="2" maxlength="120" autocomplete="off"></label>',
  '<label><span data-team-copy="E-mail"></span><input name="email" type="email" required maxlength="254" autocomplete="off"></label>',
  '<label><span data-team-copy="Senha inicial"></span><input name="password" type="password" autocomplete="new-password" required minlength="12" maxlength="160"></label>',
  '<p class="team-note" data-team-copy="Defina uma senha inicial para a pessoa alterar no primeiro acesso."></p>',
  '<button type="submit" class="primary" data-team-copy="Criar conta"></button></form>',
  '<form id="team-reset-password" hidden><p class="team-note" data-team-copy="Defina uma nova senha e encerre as sessões atuais."></p>',
  '<label><span data-team-copy="Nova senha"></span><input name="password" type="password" autocomplete="new-password" required minlength="12" maxlength="160"></label>',
  '<button type="submit" class="primary" data-team-copy="Salvar nova senha"></button></form>',
  '<form id="team-change-password" hidden><p class="team-note" data-team-copy="Ao salvar, você precisará entrar novamente."></p>',
  '<label><span data-team-copy="Senha atual"></span><input name="currentPassword" type="password" autocomplete="current-password" required maxlength="160"></label>',
  '<label><span data-team-copy="Nova senha"></span><input name="password" type="password" autocomplete="new-password" required minlength="12" maxlength="160"></label>',
  '<button type="submit" class="primary" data-team-copy="Salvar nova senha"></button></form>',
  '<form id="team-confirm" hidden><p id="team-confirm-copy" class="team-note"></p><button type="submit" class="primary" id="team-confirm-action"></button></form>',
  '<p id="team-dialog-status" role="status"></p></dialog>'
 ].join('');

 const $=id=>root.querySelector('#'+id);
 const roster=$('team-member-list');
 const dialog=$('team-dialog');
 const search=$('team-search');
 const accountFilter=$('team-account-filter');
 const clientSearch=$('team-client-search');
 const period=$('team-report-days');
 const modals={
  create: {form:'team-create',title:'Criar conta'},
  reset: {form:'team-reset-password',title:'Redefinir senha'},
  change: {form:'team-change-password',title:'Alterar minha senha'},
  deactivate: {form:'team-confirm',title:'Desativar',confirm:'Confirmar desativação',description:'Bloqueia a entrada e encerra as sessões atuais.'},
  revoke: {form:'team-confirm',title:'Encerrar sessões',confirm:'Confirmar encerramento',description:'Encerra as sessões atuais e exige um novo login.'},
 };
 let directory;
 let loading;
 let clients;
 let loadingClients;
 let clientsFailed=false;
 let reports=new Map();
 let selected;
 let tab;
 let mobileDetail=false;
 let visibleClients=6;
 let version=0;
 let editing;
 let busy=false;

 function button(label,callback,style='quiet',glyph) {
  const control=element('button',t(label),style);
  control.type='button';
  if (glyph) control.prepend(icon(glyph));
  control.addEventListener('click',callback);
  return control;
 }

 function setStatus(id,message='',error=false) {
  const target=$(id);
  target.dataset.teamStatus=message;
  target.dataset.error=String(error);
  target.textContent=t(message);
 }

 function initials(person) {
  return person.name.split(/\s+/).filter(Boolean).slice(0,2).map(word=>Array.from(word)[0]).join('').toUpperCase();
 }

 function badge(person) {
  const control=element('span',t(person.active?'Ativa':'Inativa'),'team-state');
  control.dataset.active=String(person.active);
  return control;
 }

 function avatar(person,large=false) {
  const control=element('span',initials(person),'team-avatar'+(large?' team-avatar-large':''));
  control.setAttribute('aria-hidden','true');
  return control;
 }

 function translate() {
  for (const item of root.querySelectorAll('[data-team-copy]')) item.textContent=t(item.dataset.teamCopy);
  for (const item of root.querySelectorAll('[data-team-status]')) item.textContent=t(item.dataset.teamStatus);
  search.placeholder=t('Nome ou e-mail');
  clientSearch.placeholder=t('Nome, empresa ou referência');
  $('team-tabs').setAttribute('aria-label',t('Informações da pessoa'));
  if (editing) paintDialog();
 }

 function paintOverview() {
  const panel=$('team-overview');
  panel.hidden=!admin()||!directory;
  if (panel.hidden) return;
  const active=directory.filter(person=>person.active).length;
  const counters=[['Pessoas',directory.length],['Contas ativas',active],['Contas inativas',directory.length-active]];
  panel.replaceChildren(...counters.map(([label,value])=>{
   const item=element('div','', 'team-overview-stat');
   item.append(element('strong',numeric(value)),element('span',t(label)));
   return item;
  }));
 }

 function paintRoster() {
  if (!admin()) return;
  const query=searchText(search.value.trim());
  const filtered=(directory??[]).filter(person=>
   (!accountFilter.value||(person.active?'active':'inactive')===accountFilter.value) &&
   searchText(person.name+' '+person.email).includes(query));
  roster.replaceChildren(...filtered.map(person=>{
   const item=element('li');
   const control=button('',()=>select(person.id,true),'team-roster-option');
   control.dataset.teamPerson=person.id;
   control.setAttribute('aria-pressed',String(person.id===selected));
   const identity=element('span','','team-roster-identity');
   identity.append(element('strong',person.name),element('small',t(roleLabel(person.role))),element('small',person.email,'team-roster-email'));
   control.append(avatar(person),identity,badge(person),icon('chevron'));
   item.append(control);
   return item;
  }));
  if (directory && !filtered.length) roster.append(element('li',t('Nenhuma pessoa encontrada.'),'team-empty'));
 }

 function chosen() {
  const actor=getActor();
  if (!actor) return;
  return directory?.find(person=>person.id===selected) || (admin()?null:directory?.[0] || {...actor,active:true});
 }

 function paintProfile() {
  const person=chosen();
  const panel=$('team-profile');
  panel.hidden=!person;
  root.dataset.teamDetail=String(mobileDetail);
  root.dataset.teamAdmin=String(admin());
  $('team-back').hidden=!admin();
  if (!person) {
   $('team-profile-heading').replaceChildren();
   for (const id of ['clients','performance','access']) $('team-'+id+'-view').hidden=true;
   return;
  }
  const title=element('h2',person.name);
  title.id='team-person-title';
  title.tabIndex=-1;
  const identity=element('div','','team-person-identity');
  identity.append(title,element('p',person.email,'team-note'));
  const labels=element('div','','team-person-labels');
  labels.append(element('span',t(roleLabel(person.role)),'team-role'),badge(person));
  $('team-profile-heading').replaceChildren(avatar(person,true),identity,labels);
  const available=tabs.filter(([id])=>id!=='clients'||hasClients());
  if (!available.some(([id])=>id===tab)) tab=firstTab();
  $('team-tabs').replaceChildren(...available.map(([id,label],index)=>{
   const control=button(label,()=>selectTab(id,true),'team-tab');
   control.id='team-tab-'+id;
   control.setAttribute('role','tab');
   control.setAttribute('aria-controls','team-tab-panel');
   control.setAttribute('aria-selected',String(tab===id));
   control.tabIndex=tab===id?0:-1;
   control.addEventListener('keydown',event=>{
    const next={ArrowLeft:(index+available.length-1)%available.length,ArrowRight:(index+1)%available.length,Home:0,End:available.length-1}[event.key];
    if (next===undefined) return;
    event.preventDefault();
    selectTab(available[next][0],true);
   });
   return control;
  }));
  $('team-tab-panel').setAttribute('aria-labelledby','team-tab-'+tab);
  for (const id of ['clients','performance','access']) $('team-'+id+'-view').hidden=id!==tab;
  if (tab==='clients') paintClients(person);
  if (tab==='performance') paintPerformance(person);
  if (tab==='access') paintAccess(person);
 }

 function select(id,open=false) {
  if (selected!==id) {
   tab=firstTab();
   clientSearch.value='';
   visibleClients=6;
  }
  selected=id;
  if (open) mobileDetail=true;
  paintRoster();
  paintProfile();
  loadTab();
  if (open) {
   if (oneColumn.matches) $('team-person-title')?.focus();
   else roster.querySelector('[data-team-person="'+id+'"]')?.focus({preventScroll:true});
  }
 }

 function selectTab(id,focus=false) {
  tab=id;
  paintProfile();
  if (tab==='access') {
   load().then(()=>{
    if (!root.hidden && tab==='access' && document.activeElement===document.body) {
     $('team-tab-access')?.focus({preventScroll:true});
    }
   });
  } else loadTab();
  if (focus) $('team-tab-'+id)?.focus({preventScroll:true});
 }

 function paint() {
  if (!getActor() || root.hidden) return;
  $('team-heading').textContent=t(admin()?'Equipe':'Minha conta');
  $('team-intro').textContent=t(admin()?'Acompanhe carteiras, resultados e acessos da equipe.':'Acompanhe sua carteira, seus resultados e seu acesso.');
  $('team-create-trigger').hidden=!admin();
  $('team-roster').hidden=!admin();
  translate();
  paintOverview();
  paintRoster();
  paintProfile();
 }

 function load() {
  if (!getActor()) return Promise.resolve();
  if (loading) return loading;
  const generation=version;
  setStatus('team-status','Carregando equipe…');
  $('team-retry').hidden=true;
  loading=api('team').then(result=>{
   if (generation!==version) return;
   directory=result.members;
   if (!directory.some(person=>person.id===selected)) selected=directory[0]?.id ?? getActor()?.id;
   setStatus('team-status');
   paint();
  }).catch(error=>{
   if (generation!==version) return;
   setStatus('team-status',error.message,true);
   if (!admin() && !root.hidden) setStatus('team-notice',error.message,true);
   $('team-retry').hidden=false;
  }).finally(()=>{
   if (generation===version) loading=undefined;
  });
  return loading;
 }

 function displayMessage(panel,message,retry) {
  const box=element('div','','team-empty');
  box.append(element('p',t(message)));
  if (retry) box.append(button('Tentar novamente',retry));
  panel.replaceChildren(box);
 }

 function loadClients(force=false) {
  if (!hasClients()||loadingClients||(!force&&clients)) return loadingClients;
  const generation=version;
  clientsFailed=false;
  loadingClients=api('clients').then(result=>{
   if (generation===version) clients=result.clients;
  }).catch(()=>{
   if (generation===version) clientsFailed=true;
  }).finally(()=>{
   if (generation!==version) return;
   loadingClients=undefined;
   if (!root.hidden && tab==='clients' && chosen()) paintClients(chosen());
  });
  if (!root.hidden && chosen() && tab==='clients') paintClients(chosen());
  return loadingClients;
 }

 function invoke(callback,...args) {
  const generation=version;
  Promise.resolve().then(()=>callbacks[callback]?.(...args)).catch(error=>{
   if (generation===version) setStatus('team-notice',error.message,true);
  });
 }

 function paintClients(person) {
  const panel=$('team-clients-content');
  $('team-client-heading').textContent=t(admin()?'Carteira':'Minha carteira');
  $('team-clients-link').hidden=!callbacks.openClients;
  $('team-client-count').textContent='';
  $('team-client-query').hidden=!clients;
  panel.setAttribute('aria-busy',String(Boolean(loadingClients)));
  if (clientsFailed) {
   displayMessage(panel,'Não foi possível carregar a carteira.',()=>loadClients(true));
   return;
  }
  if (!clients) {
   displayMessage(panel,hasClients()?'Carregando carteira…':'Carteira indisponível nesta configuração.');
   return;
  }
  const day=localDay.format(Date.now());
  const owned=clients.filter(client=>client.owner_id===person.id);
  const late=owned.filter(client=>isOverdue(client,day));
  const separator=element('span','·','team-count-separator');
  separator.setAttribute('aria-hidden','true');
  $('team-client-count').replaceChildren(element('span',numeric(owned.length)+' '+t(owned.length===1?'Cliente na carteira':'Clientes na carteira').toLocaleLowerCase(locale())),
   separator,element('span',numeric(late.length)+' '+t(late.length===1?'Retorno atrasado':'Retornos atrasados').toLocaleLowerCase(locale()),late.length?'team-count-overdue':''));
  const query=searchText(clientSearch.value.trim());
  const ordered=owned.filter(client=>!query || searchText([client.name,client.company,client.reference].join(' ')).includes(query));
  ordered.sort((a,b)=>Number(isOverdue(b,day))-Number(isOverdue(a,day)) ||
   (a.due_on||'9999').localeCompare(b.due_on||'9999') || a.name.localeCompare(b.name,locale()));
  if (!ordered.length) {
   displayMessage(panel,owned.length?'Nenhum cliente corresponde à busca.':'Nenhum cliente vinculado a esta pessoa.');
   return;
  }
  const list=element('ul','','team-client-items');
  list.setAttribute('aria-label',t('Registro de clientes'));
  for (const client of ordered.slice(0,visibleClients)) {
   const row=element('li');
   const identity=element('span','','team-client-person');
   identity.append(element('strong',client.company||client.name));
   if (client.company && client.company!==client.name) identity.append(element('small',client.name));
   const stage=element('span',t(stages[client.stage]||client.stage),'team-client-stage');
   stage.dataset.stage=client.stage;
   const action=element('span','','team-client-next');
   const closed=client.stage==='ganho'||client.stage==='perdido';
   action.append(element('span',closed?'—':client.next_step||t('Sem ação definida')));
   if (!closed && client.due_on) {
    const overdue=isOverdue(client,day);
    const label=client.due_on===day?t('Hoje'):shortDate(client.due_on,locale());
    const date=element('time',overdue?t('Atrasado')+' · '+label:label);
    date.dateTime=client.due_on;
    date.dataset.overdue=String(overdue);
    action.append(date);
   }
   if (callbacks.openClient) {
    const control=button('',()=>invoke('openClient',client.reference),'team-client-row');
    control.append(identity,stage,action,icon('chevron'));
    row.append(control);
   } else {
    const container=element('div','','team-client-row');
    container.append(identity,stage,action);
    row.append(container);
   }
   list.append(row);
  }
  panel.replaceChildren(list);
  if (ordered.length>visibleClients) {
   const more=button('Mostrar mais',()=>{
    const boundary=list.children.length;
    visibleClients+=6;
    paintClients(person);
    panel.querySelectorAll('.team-client-items li')[boundary]?.querySelector('button')?.focus();
   });
   more.classList.add('team-more');
   panel.append(more);
  }
 }

 function reportKey(person) {
  return person.id+':'+period.value;
 }

 function loadReport(person,force=false) {
  if (!person) return;
  const key=reportKey(person);
  const existing=reports.get(key);
  if (existing?.loading || (existing?.data&&!force)) return existing?.loading;
  const generation=version;
  const params=new URLSearchParams({days:period.value});
  if (admin()) params.set('member',person.id);
  const target={};
  reports.set(key,target);
  target.loading=api('performance&'+params).then(result=>{
   target.data=result;
  }).catch(()=>{
   target.failed=true;
  }).finally(()=>{
   target.loading=undefined;
   if (version===generation && !root.hidden && tab==='performance' && chosen()?.id===person.id && key===reportKey(person)) paintPerformance(person);
  });
  paintPerformance(person);
  return target.loading;
 }

 function paintPerformance(person) {
  const panel=$('team-performance-content');
  const report=reports.get(reportKey(person));
  panel.setAttribute('aria-busy',String(Boolean(report?.loading)));
  if (report?.failed) {
   displayMessage(panel,'Não foi possível carregar o desempenho.',()=>loadReport(person,true));
   return;
  }
  const data=report?.data;
  if (!data) {
   displayMessage(panel,'Carregando desempenho…');
   return;
  }
  const dateRange=element('p','','team-note team-period-range');
  const first=data.weeks?.[0];
  const last=data.weeks?.at(-1);
  if (first && last) dateRange.textContent=shortDate(first.start,locale())+' – '+shortDate(last.end,locale());
  const metrics=element('dl','','team-metrics');
  const onTime=data.due?new Intl.NumberFormat(locale(),{style:'percent'}).format(data.on_time/data.due):'—';
  for (const [label,value,detail] of [
   ['Ligações',numeric(data.calls)],['Atendimentos',numeric(data.encounters)],['Vendas',numeric(data.won)],
   ['Valor fechado',money(data.cents)],['No prazo',onTime,data.due?numeric(data.on_time)+' / '+numeric(data.due):t('Sem compromissos avaliáveis')]
  ]) {
   const metric=element('div');
   const reading=element('dd',value);
   if (detail) reading.append(element('small',detail));
   metric.append(element('dt',t(label)),reading);
   metrics.append(metric);
  }
  const graph=element('section','','team-activity');
  const graphHeading=element('h4',t('Atividades por semana'));
  graphHeading.id='team-weekly-heading';
  graph.setAttribute('aria-labelledby',graphHeading.id);
  const chart=element('ol','','team-weekly');
  const weeks=data.weeks??[];
  const largest=Math.max(1,...weeks.map(week=>Number(week.count)));
  for (const week of weeks) {
   const row=element('li');
   const label=shortDate(week.start,locale())+(week.start===week.end?'':' – '+shortDate(week.end,locale()));
   const track=element('span','','team-weekly-track');
   track.setAttribute('aria-hidden','true');
   const bar=element('span');
   bar.style.width=(100*Number(week.count)/largest)+'%';
   track.append(bar);
   row.append(element('span',label),track,element('strong',numeric(week.count)));
   chart.append(row);
  }
  graph.append(graphHeading,chart);
  panel.replaceChildren(dateRange,metrics,graph);
  if (callbacks.openPerformance) {
   panel.append(button('Ver relatório completo',()=>invoke('openPerformance',person.id,period.value),'quiet','chevron'));
  }
 }

 function paintAccess(person) {
  const content=$('team-access-view');
  const actor=getActor();
  const own=actor.id===person.id;
  const header=element('div','','team-section-heading');
  header.append(element('h3',t('Acesso ao CRM')));
  if (Number.isInteger(person.active_sessions)) header.append(button('Atualizar sessões',async event=>{
   const control=event.currentTarget;
   control.disabled=true;
   await load();
   control.disabled=false;
   if (!root.hidden && tab==='access') $('team-tab-access')?.focus({preventScroll:true});
  }));
  content.replaceChildren(header);
  const facts=element('dl','','team-access-facts');
  const state=element('div');
  const current=element('dd');
  current.append(badge(person));
  state.append(element('dt',t('Situação da conta')),current);
  facts.append(state);
  if (Number.isInteger(person.active_sessions)) {
   const sessions=element('div');
   sessions.append(element('dt',t('Sessões ativas')),element('dd',numeric(person.active_sessions)));
   facts.append(sessions);
  }
  content.append(facts);
  const controls=element('div','','team-access-controls');
  function add(label,description,callback,style='quiet') {
   const row=element('div','','team-access-row');
   const copy=element('div');
   copy.append(element('strong',t(label)),element('p',t(description),'team-note'));
   row.append(copy,button(label,callback,style));
   controls.append(row);
  }
  if (own) add('Alterar minha senha','Atualize a senha da sua conta.',()=>openDialog('change',person));
  if (admin()&&person.role==='member') {
   if (person.active) {
    add('Desativar','Bloqueia a entrada e encerra as sessões atuais.',()=>openDialog('deactivate',person),'quiet team-destructive');
    if (Number.isInteger(person.active_sessions)) add('Encerrar sessões','Encerra as sessões atuais e exige um novo login.',
     ()=>openDialog('revoke',person));
   } else add('Ativar','Permite que a pessoa volte a entrar no CRM.',event=>activate(person,event.currentTarget));
   add('Redefinir senha','Defina uma nova senha e encerre as sessões atuais.',()=>openDialog('reset',person));
  }
  if (controls.children.length) content.append(controls);
 }

 function loadTab(force=false) {
  if (tab==='clients') return loadClients(force);
  if (tab==='performance') return loadReport(chosen(),force);
 }

 function paintDialog() {
  if (!editing) return;
  const config=modals[editing.mode];
  $('team-dialog-title').textContent=t(config.title)+(editing.person&&editing.mode!=='change'?' · '+editing.person.name:'');
  $('team-confirm-copy').textContent=config.description?t(config.description):'';
  $('team-confirm-action').textContent=config.confirm?t(config.confirm):'';
 }

 function openDialog(mode,person) {
  if (dialog.open) return;
  editing={mode,person};
  const target=modals[mode].form;
  for (const form of dialog.querySelectorAll('form')) {
   form.reset();
   form.hidden=form.id!==target;
  }
  setStatus('team-dialog-status');
  paintDialog();
  dialog.showModal();
  const form=$(target);
  (form.querySelector('input')||$('team-dialog-close')).focus({preventScroll:true});
 }

 function closeDialog(force=false) {
  if (busy && !force) return;
  if (dialog.open) dialog.close();
  editing=undefined;
  for (const form of dialog.querySelectorAll('form')) form.reset();
 }

 function changeMember(person) {
  directory=(directory??[]).some(item=>item.id===person.id) ?
   directory.map(item=>item.id===person.id?{...item,...person}:item) : [...(directory??[]),person];
  directory.sort((a,b)=>Number(b.active)-Number(a.active)||a.name.localeCompare(b.name,locale()));
 }

 async function activate(person,control) {
  control.disabled=true;
  const generation=version;
  try {
   const result=await api('team','PATCH',{id:person.id,active:true});
   if (generation!==version) return;
   changeMember(result.member);
   paint();
   $('team-tab-access')?.focus({preventScroll:true});
   setStatus('team-notice','Conta ativada.');
  } catch (error) {
   if (generation===version) setStatus('team-notice',error.message,true);
  } finally {
   control.disabled=false;
  }
 }

 dialog.addEventListener('submit',async event=>{
  event.preventDefault();
  if (busy||!editing) return;
  const form=event.target;
  const data=Object.fromEntries(new FormData(form));
  const {mode,person}=editing;
  const generation=version;
  const submit=form.querySelector('button[type="submit"]');
  busy=true;
  submit.disabled=true;
  $('team-dialog-close').disabled=true;
  setStatus('team-dialog-status','Salvando…');
  try {
   if (mode==='change') {
    await api('password','POST',data);
    if (generation===version) {
     closeDialog(true);
     await onSignOut('Senha alterada. Entre com a nova senha.');
    }
    return;
   }
   const payload=mode==='create'?data:mode==='reset'?{id:person.id,password:data.password}:
    mode==='revoke'?{id:person.id,revokeSessions:true}:{id:person.id,active:false};
   const result=await api('team',mode==='create'?'POST':'PATCH',payload);
   if (generation!==version) return;
   closeDialog(true);
   changeMember(result.member);
   if (mode==='create') {
    select(result.member.id,true);
    selectTab('access',true);
   } else {
    paint();
    $('team-tab-access')?.focus({preventScroll:true});
   }
   setStatus('team-notice',{create:'Conta criada.',reset:'Senha redefinida.',deactivate:'Conta desativada.',revoke:'Sessões encerradas.'}[mode]);
  } catch (error) {
   if (generation===version) setStatus('team-dialog-status',error.message,true);
  } finally {
   if (generation===version) {
    busy=false;
    submit.disabled=false;
    $('team-dialog-close').disabled=false;
   }
  }
 });

 $('team-create-trigger').prepend(icon('plus'));
 $('team-create-trigger').addEventListener('click',()=>openDialog('create'));
 $('team-clients-link').addEventListener('click',()=>{const person=chosen(); if (person) invoke('openClients',person.id);});
 $('team-dialog-close').addEventListener('click',()=>closeDialog());
 dialog.addEventListener('cancel',event=>{event.preventDefault(); closeDialog();});
 $('team-retry').addEventListener('click',()=>load().then(loadTab));
 search.addEventListener('input',paintRoster);
 accountFilter.addEventListener('change',paintRoster);
 clientSearch.addEventListener('input',()=>{
  visibleClients=6;
  if (chosen()) paintClients(chosen());
 });
 period.addEventListener('change',()=>{
  if (chosen()) {paintPerformance(chosen());loadReport(chosen());}
 });
 $('team-back').addEventListener('click',()=>{
  mobileDetail=false;
  root.dataset.teamDetail='false';
  (roster.querySelector('[aria-pressed="true"]')||search).focus({preventScroll:true});
 });
 document.addEventListener('caos-language-change',paint);

 return {
  load,
  members:()=>directory,
  async show() {
   tab=tab||firstTab();
   paint();
   await load();
   if (!root.hidden) await loadTab(true);
  },
  hide() {
   closeDialog(true);
  },
  reset() {
   version++;
   directory=clients=loading=loadingClients=selected=tab=undefined;
   clientsFailed=mobileDetail=false;
   reports=new Map();
   visibleClients=6;
   search.value=accountFilter.value=clientSearch.value='';
   period.value='30';
   closeDialog(true);
   busy=false;
   for (const control of dialog.querySelectorAll('button')) control.disabled=false;
   roster.replaceChildren();
   for (const id of ['team-profile-heading','team-clients-content','team-performance-content','team-access-view','team-overview']) $(id).replaceChildren();
   for (const id of ['team-notice','team-status','team-dialog-status']) setStatus(id);
  },
 };
}
