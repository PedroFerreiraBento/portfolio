const labels = {
 'Clientes':'Clients', 'Organize sua carteira e acompanhe cada retorno.':'Organize your client list and keep up with follow-ups.',
 'Novo contato':'New contact', 'Todos':'All', 'Atrasados':'Overdue', 'Para hoje':'Due today',
 'Sem contato há 30 dias':'No contact for 30 days', 'Nome, empresa ou e-mail':'Name, company or email',
 'Buscar cliente':'Search clients', 'Responsável':'Owner', 'Sem responsável':'Unassigned', 'Etapa':'Stage',
 'Cliente':'Client', 'Próxima ação':'Next action', 'Novo':'New', 'Em conversa':'In conversation', 'Negociação':'Negotiation',
 'Proposta enviada':'Proposal sent', 'Fechado':'Won', 'Perdido':'Lost', 'Atrasado':'Overdue', 'Hoje':'Today',
 'contatos':'contacts', 'contato':'contact', 'de':'of', 'Página anterior':'Previous page', 'Próxima página':'Next page',
 'Visão geral':'Overview', 'Histórico':'History', 'Oportunidades':'Opportunities', 'Editar':'Edit',
 'Voltar para clientes':'Back to clients', 'Ficha do cliente':'Client profile', 'Enviar e-mail':'Send email',
 'Registrar atendimento':'Log conversation', 'Remarcar':'Reschedule', 'Definir retorno':'Set follow-up',
 'Definir próximo passo':'Set next action', 'Últimas interações':'Recent interactions',
 'Não há interações registradas.':'No interactions have been logged.',
 'Ver histórico completo':'View full history', 'Nova oportunidade':'New opportunity', 'Oportunidade':'Opportunity',
 'Data de retorno':'Follow-up date', 'Salvar retorno':'Save follow-up', 'Cancelar':'Cancel',
 'Retorno atualizado.':'Follow-up updated.', 'Salvando…':'Saving…', 'Carregando clientes…':'Loading clients…',
 'Carregando ficha…':'Loading client profile…', 'Não foi possível carregar os clientes.':'Could not load clients.',
 'Não foi possível carregar a ficha.':'Could not load the client profile.', 'Tentar novamente':'Try again',
 'Nenhum cliente encontrado.':'No clients found.', 'Ajuste a busca ou os filtros para encontrar clientes.':'Adjust your search or filters to find clients.',
 'Limpar filtros':'Clear filters', 'Adicione um contato para começar sua carteira.':'Add a contact to start your client list.',
 'Abra um contato para ver a próxima ação.':'Open a contact to see the next action.',
 'Ligação':'Call', 'WhatsApp':'WhatsApp', 'E-mail':'Email', 'Reunião':'Meeting', 'Anotação':'Note',
 'Contato realizado':'Reached', 'Sem resposta':'No answer', 'Enviado':'Sent', 'Realizada':'Completed',
 'Não compareceu':'No-show', 'Registrada':'Logged', 'Conta inativa':'Inactive account',
 'Contato salvo.':'Contact saved.', 'Compromisso agendado.':'Appointment scheduled.', 'Atividade registrada.':'Activity logged.',
 'Oportunidade salva.':'Opportunity saved.',
 'Nenhuma oportunidade encontrada.':'No opportunities found.', 'Não foi possível atualizar o retorno.':'Could not update the follow-up.',
 'Não foi possível concluir a ação.':'Could not complete the action.',
 'Atendimento':'Client contact', 'Nenhuma oportunidade aberta.':'No open opportunities.',
 'Esta oportunidade foi encerrada.':'This opportunity has been closed.'
};
const stages = {novo:'Novo', conversa:'Em conversa', proposta:'Proposta enviada', negociacao:'Negociação', ganho:'Fechado', perdido:'Perdido'};
const kinds = {call:'Ligação', whatsapp:'WhatsApp', email:'E-mail', meeting:'Reunião', note:'Anotação'};
const outcomes = {connected:'Contato realizado', no_answer:'Sem resposta', sent:'Enviado', completed:'Realizada', no_show:'Não compareceu', recorded:'Registrada'};
const priorities = {all:'Todos', late:'Atrasados', today:'Para hoje', inactive:'Sem contato há 30 dias'};
const tabs = {overview:'Visão geral', history:'Histórico', opportunities:'Oportunidades'};
const limit = 6;
const zone = 'America/Sao_Paulo';
const civil = new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});
const locale=()=>document.documentElement.lang.startsWith('en') ? 'en-US' : 'pt-BR';
const t=key=>locale()==='pt-BR' ? key : labels[key] ?? window.caosTranslate?.(key) ?? key;
const localDay=()=>civil.format(new Date());
const oldDay=today=>new Date(Date.parse(today+'T00:00:00Z')-30*86400000).toISOString().slice(0,10);
const slim=value=>String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const shortDate=date=>new Intl.DateTimeFormat(locale(),{timeZone:'UTC',day:'numeric',month:'short'}).format(new Date(date+'T12:00:00Z'));
const stageName=stage=>t(stages[stage] ?? stages.novo);
const isOpen=record=>record.stage!=='ganho' && record.stage!=='perdido';

function el(tag, text, cls) {
 const node=document.createElement(tag);
 if (text!=null) node.textContent=text;
 if (cls) node.className=cls;
 return node;
}
function button(label, style, run) {
 const node=el('button',label,style);
 node.type='button';
 node.addEventListener('click',run);
 return node;
}
const icons = {
 plus:'<path d="M12 5v14M5 12h14"/>', search:'<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4 4"/>',
 left:'<path d="m14 6-6 6 6 6"/>', right:'<path d="m10 6 6 6-6 6"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
};
function icon(name) {
 const span=el('span',null,'clients-icon');
 span.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';
 return span;
}
function deadline(record,today) {
 if (!isOpen(record) || !record.due_on) return null;
 const due=el('time',record.due_on<today ? t('Atrasado')+' · '+shortDate(record.due_on) : record.due_on===today ? t('Hoje') : shortDate(record.due_on),'clients-due');
 due.dateTime=record.due_on;
 due.dataset.late=String(record.due_on<today);
 return due;
}
function initials(name) {
 return name.trim().split(/\s+/).slice(0,2).map(part=>[...part][0]?.toUpperCase()).join('');
}
function badge(stage) {
 const node=el('span',stageName(stage),'clients-stage');
 node.dataset.stage=stage || 'novo';
 return node;
}

export function initClients(api,getActor,callbacks) {
 const root=document.getElementById('clients-page');
 root.dataset.noTranslate='';
 root.innerHTML= '<div id="clients-list-view">'+
  '<div class="clients-heading"><div><h1 id="clients-title" tabindex="-1" data-copy="Clientes"></h1>'+
  '<p data-copy="Organize sua carteira e acompanhe cada retorno."></p></div><button type="button" class="primary" id="clients-new"><span data-copy="Novo contato"></span></button></div>'+
  '<div class="clients-priorities" role="group" aria-label="Prazo de retorno"></div></div>'+
  '<p id="clients-notice" role="status"></p>'+
  '<div class="clients-layout"><section class="clients-list" aria-label="Clientes">'+
  '<div class="clients-filters"><label class="clients-search"><span class="clients-sr" data-copy="Buscar cliente"></span><input id="clients-search" type="search"></label>'+
  '<label id="clients-owner-field"><span class="clients-sr" data-copy="Responsável"></span><select id="clients-owner"></select></label>'+
  '<label><span class="clients-sr" data-copy="Etapa"></span><select id="clients-stage"></select></label></div>'+
  '<div id="clients-ledger"></div></section><section id="clients-detail" class="clients-detail" aria-label="Ficha do cliente">'+
  '<div class="clients-mobile-back"></div><div id="clients-detail-main"></div></section></div>';
 const $=id=>root.querySelector('#'+id);
 const search=$('clients-search');
 const owner=$('clients-owner');
 const stage=$('clients-stage');
 const pane=$('clients-detail-main');
 const filters=root.querySelector('.clients-priorities');
 const mobile=matchMedia('(max-width: 51rem)');
 let active=false;
 let clients=[];
 let members=[];
 let desiredOwner;
 let priority='all';
 let page=0;
 let selected;
 let detail;
 let tab='overview';
 let mobileOpen=false;
 let returnScroll=0;
 let listLoading=false;
 let listError=false;
 let detailLoading=false;
 let detailError=false;
 let listSerial=0;
 let detailSerial=0;
 let notice='';
 let noticeError=false;
 let scheduling=false;

 $('clients-new').prepend(icon('plus'));
 $('clients-new').addEventListener('click',()=>invoke('newContact'));
 root.querySelector('.clients-search').prepend(icon('search'));

 function notify(message,error=false) {
  notice=message;
  noticeError=error;
  $('clients-notice').textContent=t(message);
  $('clients-notice').dataset.error=String(error);
 }
 async function invoke(action,...args) {
  try {
   await callbacks[action](...args);
  } catch (error) {
   if (active) notify(error.message || 'Não foi possível concluir a ação.',true);
  }
 }
 function ownerLabel(record) {
  return record.owner_name || t('Sem responsável');
 }
 function priorityMatch(client,key,today,threshold) {
  const open=isOpen(client);
  if (key==='late') return Boolean(open && client.due_on && client.due_on<today);
  if (key==='today') return open && client.due_on===today;
  if (key==='inactive') {
   const since=client.last_contact_at || client.created_at;
   return Boolean(since && civil.format(new Date(since))<=threshold);
  }
  return true;
 }
 function matching() {
  const query=slim(search.value.trim());
  const ownerId=owner.value;
  return clients.filter(client=>
   (!query || [client.name,client.company,client.email,client.reference].some(value=>slim(value).includes(query))) &&
   (!ownerId || (client.owner_id || 'unassigned')===ownerId) && (!stage.value || client.stage===stage.value));
 }
 function renderFilters() {
  const language=locale();
  root.querySelectorAll('[data-copy]').forEach(node=>node.textContent=t(node.dataset.copy));
  search.placeholder=t('Nome, empresa ou e-mail');
  $('clients-owner-field').hidden=getActor()?.role!=='admin';
  const memberOptions=members.map(member=>new Option(member.name+(member.active===false ? ' · '+t('Conta inativa') : ''),member.id));
  const previousOwner=owner.value;
  owner.replaceChildren(new Option(t('Responsável'),''),new Option(t('Sem responsável'),'unassigned'),...memberOptions);
  if ([...owner.options].some(option=>option.value===previousOwner)) owner.value=previousOwner;
  const previousStage=stage.value;
  stage.replaceChildren(new Option(t('Etapa'),''),...Object.entries(stages).map(([id,label])=>new Option(t(label),id)));
  if (previousStage) stage.value=previousStage;
  filters.setAttribute('aria-label',language==='pt-BR'?'Filtros de retorno':'Follow-up filters');
  root.querySelector('.clients-list').setAttribute('aria-label',t('Clientes'));
  $('clients-detail').setAttribute('aria-label',t('Ficha do cliente'));
  notify(notice,noticeError);
 }
 function renderPriorities(all,today,threshold) {
  filters.replaceChildren();
  for (const [key,label] of Object.entries(priorities)) {
   const chip=button(t(label),'quiet',()=>{
    if (priority===key) return;
    priority=key;
    page=0;
    renderList(true);
    filters.querySelector('[data-priority="'+key+'"]')?.focus();
   });
   chip.dataset.priority=key;
   chip.setAttribute('aria-pressed',String(priority===key));
   if (listLoading && !clients.length) chip.disabled=true;
   if (!listError && (!listLoading || clients.length)) chip.append(el('strong',all.filter(client=>priorityMatch(client,key,today,threshold)).length));
   filters.append(chip);
  }
 }
 function renderList(choose=false) {
  const ledger=$('clients-ledger');
  const all=matching();
  const today=localDay();
  const threshold=oldDay(today);
  renderPriorities(all,today,threshold);
  if (listLoading && !clients.length) {
   ledger.replaceChildren(el('p',t('Carregando clientes…'),'clients-state'));
   ledger.setAttribute('aria-busy','true');
   return;
  }
  ledger.removeAttribute('aria-busy');
  if (listError) {
   const state=el('div',null,'clients-state');
   state.append(el('p',t('Não foi possível carregar os clientes.')),button(t('Tentar novamente'),'quiet',refresh));
   ledger.replaceChildren(state);
   return;
  }
  const subset=all.filter(client=>priorityMatch(client,priority,today,threshold));
  page=Math.min(page,Math.max(0,Math.ceil(subset.length/limit)-1));
  const visible=subset.slice(page*limit,(page+1)*limit);
  if (choose && !mobileOpen && !visible.some(client=>client.reference===selected)) {
   if (!mobile.matches && visible[0]) select(visible[0].reference,{focus:false});
   else if (selected) {
    selected=undefined;
    detail=undefined;
    detailError=false;
    detailLoading=false;
    detailSerial++;
    renderDetail();
   }
  }
  if (!visible.length) {
   const state=el('div',null,'clients-state');
   const hasClients=Boolean(clients.length);
   state.append(el('h2',t('Nenhum cliente encontrado.')),el('p',t(hasClients ? 'Ajuste a busca ou os filtros para encontrar clientes.' : 'Adicione um contato para começar sua carteira.')));
   state.append(button(t(hasClients ? 'Limpar filtros' : 'Novo contato'),hasClients ? 'quiet' : 'primary',hasClients ? clearFilters : ()=>invoke('newContact')));
   ledger.replaceChildren(state);
   return;
  }
  const table=el('table',null,'clients-table');
  table.setAttribute('role','table');
  table.setAttribute('aria-label',t('Clientes'));
  const head=table.createTHead().insertRow();
  for (const [column,label] of [['client','Cliente'],['stage','Etapa'],['owner','Responsável'],['action','Próxima ação']]) {
   const cell=el('th',t(label));
   cell.scope='col';
   cell.dataset.column=column;
   head.append(cell);
  }
  const list=table.createTBody();
  for (const client of visible) {
   const row=list.insertRow();
   row.dataset.selected=String(client.reference===selected);
   const cell=row.insertCell();
   const contact=button(null,'clients-contact',()=>select(client.reference));
   contact.dataset.clientReference=client.reference;
   if (client.reference===selected) contact.setAttribute('aria-current','true');
   const mark=el('span',initials(client.name),'clients-initials');
   mark.dataset.tint=String([...mark.textContent].reduce((sum,letter)=>sum+letter.codePointAt(0),0)%5);
   mark.setAttribute('aria-hidden','true');
   const identity=el('span',null,'clients-name');
   identity.append(el('strong',client.name));
   if (client.company) identity.append(el('span',client.company));
   contact.append(mark,identity);
   cell.append(contact);
   const stageCell=row.insertCell();
   stageCell.dataset.column='stage';
   stageCell.append(badge(client.stage));
   const ownerCell=row.insertCell();
   ownerCell.dataset.column='owner';
   ownerCell.textContent=ownerLabel(client);
   const action=row.insertCell();
   action.dataset.column='action';
   action.append(el('span',(isOpen(client) && client.next_step) || '—','clients-next-copy'));
   const due=deadline(client,today);
   if (due) action.append(due);
   row.addEventListener('click',event=>{
    if (!event.target.closest('button')) select(client.reference);
   });
  }
  const footer=el('div',null,'clients-footer');
  const start=page*limit+1;
  const end=page*limit+visible.length;
  footer.append(el('p',start+'–'+end+' '+t('de')+' '+subset.length+' '+t(subset.length===1?'contato':'contatos')));
  const nav=el('div',null,'clients-pager');
  for (const [offset,label,arrow] of [[-1,'Página anterior','left'],[1,'Próxima página','right']]) {
   const control=button(null,'quiet',()=>{
    page+=offset;
    renderList(true);
    const revised=[...root.querySelectorAll('.clients-pager button')];
    (revised.find(item=>item.dataset.offset===String(offset) && !item.disabled) ?? revised.find(item=>!item.disabled))?.focus();
   });
   control.append(icon(arrow));
   control.setAttribute('aria-label',t(label));
   control.dataset.offset=String(offset);
   control.disabled=offset===-1 ? page===0 : end>=subset.length;
   nav.append(control);
  }
  footer.append(nav);
  ledger.replaceChildren(table,footer);
 }
 function clearFilters() {
  page=0;
  priority='all';
  search.value='';
  owner.value='';
  stage.value='';
  renderList(true);
  search.focus();
 }
 function history(items) {
  if (!items.length) return el('p',t('Não há interações registradas.'),'clients-empty-inline');
  const list=el('ul',null,'clients-timeline');
  for (const item of items) {
   const row=el('li');
   const entry=el('p',null,'clients-event');
   entry.append(el('strong',t(kinds[item.kind] ?? kinds.note)),document.createTextNode(' · '));
   const time=el('time',shortDate(civil.format(new Date(item.occurred_at))));
   time.dateTime=item.occurred_at;
   entry.append(time);
   row.append(entry);
   const information=[item.outcome && outcomes[item.outcome] ? t(outcomes[item.outcome]) : '',item.actor_name].filter(Boolean).join(' · ');
   if (item.notes) row.append(el('p',item.notes,'clients-event-note'));
   if (information) row.append(el('p',information,'clients-event-meta'));
   list.append(row);
  }
  return list;
 }
 function renderOpportunityList(data) {
  const content=el('section');
  const heading=el('div',null,'clients-block-heading');
  heading.append(el('h3',t('Oportunidades')),button(t('Nova oportunidade'),'quiet',()=>invoke('addOpportunity',data.client.reference)));
  content.append(heading);
  if (!data.opportunities.length) {
   content.append(el('p',t('Nenhuma oportunidade encontrada.'),'clients-empty-inline'));
   return content;
  }
  const list=el('ul',null,'clients-opportunities');
  const currency=new Intl.NumberFormat(locale(),{style:'currency',currency:'BRL'});
  for (const opportunity of data.opportunities) {
   const row=el('li');
   const title=el('div',null,'clients-opportunity-copy');
   const titleText=opportunity.project_name || t('Oportunidade')+' · '+opportunity.reference;
   const edit=button(titleText,'clients-text-button',()=>invoke('editOpportunity',opportunity.reference,true));
   edit.setAttribute('aria-label',t('Editar')+' '+titleText);
   title.append(edit);
   if (opportunity.next_step) title.append(el('p',opportunity.next_step));
   if (opportunity.value_cents!==null && opportunity.value_cents!==undefined) title.append(el('p',currency.format(Number(opportunity.value_cents)/100)));
   row.append(title,badge(opportunity.stage));
   list.append(row);
  }
  content.append(list);
  return content;
 }
 function scheduleForm(client,opportunity) {
  const form=el('form',null,'clients-schedule');
  const nextLabel=el('label',t('Próxima ação'));
  const next=el('input');
  next.name='next_step';
  next.maxLength=240;
  next.value=client.next_step || '';
  nextLabel.append(next);
  const dateLabel=el('label',t('Data de retorno'));
  const date=el('input');
  date.type='date';
  date.name='due_on';
  date.required=true;
  date.min=localDay();
  date.max='2100-12-31';
  date.value=client.due_on && client.due_on>=date.min ? client.due_on : date.min;
  dateLabel.append(date);
  const actions=el('div',null,'clients-detail-actions');
  const submit=el('button',t('Salvar retorno'),'primary');
  submit.type='submit';
  actions.append(submit,button(t('Cancelar'),'quiet',()=>{
   scheduling=false;
   renderDetail();
   $('clients-schedule-trigger')?.focus();
  }));
  const status=el('p');
  status.setAttribute('role','status');
  form.append(nextLabel,dateLabel,actions,status);
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   submit.disabled=true;
   status.textContent=t('Salvando…');
   status.dataset.error='false';
   try {
    await callbacks.scheduleFollowup({reference:opportunity.reference,revision:opportunity.revision,next_step:next.value,due_on:date.value});
    if (!active || selected!==client.reference) return;
    scheduling=false;
    await refresh();
    notify('Retorno atualizado.');
    $('clients-schedule-trigger')?.focus();
   } catch (error) {
    status.textContent=error.code==='closed_opportunity' ? t('Esta oportunidade foi encerrada.') :
     error.message || t('Não foi possível atualizar o retorno.');
    status.dataset.error='true';
   } finally {
    submit.disabled=false;
   }
  });
  return form;
 }
 function renderOverview(data) {
  const client=data.client;
  const opportunity=data.opportunities.find(item=>item.reference===client.opportunity_reference);
  const content=el('div');
  const next=el('div',null,'clients-next');
  const open=isOpen(client);
  next.append(el('h3',t(open?'Próxima ação':'Atendimento')),
   el('p',open ? client.next_step || t('Definir próximo passo') : t('Nenhuma oportunidade aberta.'),'clients-action-title'));
  const due=deadline(client,localDay());
  if (due) next.append(due);
  if (opportunity) {
   const actions=el('div',null,'clients-detail-actions');
   actions.append(button(t('Registrar atendimento'),'primary',()=>invoke('logActivity',opportunity.reference)));
   if (open) {
    const reschedule=button(t(client.due_on?'Remarcar':'Definir retorno'),'quiet',()=>{
     scheduling=!scheduling;
     renderDetail();
     if (scheduling) pane.querySelector('[name=due_on]')?.focus();
    });
    reschedule.id='clients-schedule-trigger';
    reschedule.setAttribute('aria-expanded',String(scheduling));
    actions.append(reschedule);
   }
   next.append(actions);
   if (open && scheduling) next.append(scheduleForm(client,opportunity));
  }
  content.append(next);
  const recent=el('section',null,'clients-recent');
  recent.append(el('h3',t('Últimas interações')),history(data.activities.slice(0,2)));
  if (data.activities.length) recent.append(button(t('Ver histórico completo'),'clients-text-button',()=>activateTab('history')));
  content.append(recent);
  return content;
 }
 function activateTab(key) {
  tab=key;
  scheduling=false;
  renderDetail();
  $('clients-tab-'+key)?.focus();
 }
 function renderDetail() {
  root.dataset.detailOpen=String(mobileOpen);
  const section=$('clients-detail');
  const back=button(t('Voltar para clientes'),'clients-text-button',closeMobile);
  back.prepend(icon('left'));
  root.querySelector('.clients-mobile-back').replaceChildren(back);
  if (detailLoading) {
   section.setAttribute('aria-busy','true');
   pane.replaceChildren(el('p',t('Carregando ficha…'),'clients-state'));
   return;
  }
  section.removeAttribute('aria-busy');
  if (detailError) {
   const state=el('div',null,'clients-state');
   state.append(el('p',t('Não foi possível carregar a ficha.')),button(t('Tentar novamente'),'quiet',()=>select(selected)));
   pane.replaceChildren(state);
   return;
  }
  if (!detail) {
   pane.replaceChildren(el('p',t('Abra um contato para ver a próxima ação.'),'clients-state'));
   return;
  }
  const {client}=detail;
  const intro=el('div',null,'clients-detail-heading');
  const identity=el('div');
  const heading=el('h2',client.name);
  heading.id='clients-detail-title';
  heading.tabIndex=-1;
  identity.append(heading);
  if (client.company) identity.append(el('p',client.company,'clients-detail-company'));
  identity.append(el('p',ownerLabel(client)+' · '+stageName(client.stage),'clients-detail-meta'));
  if (client.email) {
   const link=el('a',client.email,'clients-detail-email');
   link.href='mailto:'+client.email;
   link.prepend(icon('mail'));
   identity.append(link);
  }
  intro.append(identity,button(t('Editar'),'quiet',()=>invoke('editOpportunity',client.reference)));
  const tabList=el('div',null,'clients-tabs');
  tabList.setAttribute('role','tablist');
  tabList.setAttribute('aria-label',t('Ficha do cliente'));
  for (const [id,label] of Object.entries(tabs)) {
   const item=button(t(label),null,()=>activateTab(id));
   item.id='clients-tab-'+id;
   item.setAttribute('role','tab');
   item.setAttribute('aria-controls','clients-tab-panel');
   item.setAttribute('aria-selected',String(tab===id));
   item.tabIndex=tab===id?0:-1;
   item.addEventListener('keydown',event=>{
    const available=Object.keys(tabs);
    const index=available.indexOf(id);
    const next={ArrowLeft:available[(index+available.length-1)%available.length],ArrowRight:available[(index+1)%available.length],Home:available[0],End:available.at(-1)}[event.key];
    if (next) {
     event.preventDefault();
     activateTab(next);
    }
   });
   tabList.append(item);
  }
  const content=el('div',null,'clients-tab-panel');
  content.id='clients-tab-panel';
  content.setAttribute('role','tabpanel');
  content.setAttribute('aria-labelledby','clients-tab-'+tab);
  content.tabIndex=0;
  content.append(tab==='history' ? history(detail.activities) : tab==='opportunities' ? renderOpportunityList(detail) : renderOverview(detail));
  pane.replaceChildren(intro,tabList,content);
 }
 function closeMobile() {
  mobileOpen=false;
  renderDetail();
  const entry=[...root.querySelectorAll('[data-client-reference]')].find(node=>node.dataset.clientReference===selected);
  (entry || $('clients-title')).focus({preventScroll:true});
  window.scrollTo(0,returnScroll);
 }
 async function select(reference,{focus=true}={}) {
  if (!active || !reference) return;
  const request=++detailSerial;
  if (focus && mobile.matches && !mobileOpen) {
   returnScroll=window.scrollY;
   mobileOpen=true;
   window.scrollTo(0,0);
  }
  if (selected!==reference) {
   tab='overview';
   scheduling=false;
  }
  selected=reference;
  detailLoading=true;
  detailError=false;
  renderList();
  renderDetail();
  try {
   const data=await api('client&'+new URLSearchParams({reference}));
   if (detailSerial!==request || !active) return;
   detail=data;
   selected=data.client.reference;
  } catch {
   if (detailSerial!==request || !active) return;
   detail=undefined;
   detailError=true;
  } finally {
   if (detailSerial===request && active) {
    detailLoading=false;
    renderList();
    renderDetail();
    if (focus && (!mobile.matches || mobileOpen)) ($('clients-detail-title') || pane.querySelector('button'))?.focus({preventScroll:true});
   }
  }
 }
 async function refresh() {
  const request=++listSerial;
  listLoading=true;
  listError=false;
  renderList();
  try {
   const result=await api('clients');
   if (listSerial!==request || !active) return;
   clients=result.clients;
   members=result.members ?? [];
   renderFilters();
   if (desiredOwner!==undefined) {
    owner.value=[...owner.options].some(option=>option.value===desiredOwner) ? desiredOwner : '';
    desiredOwner=undefined;
   }
   listLoading=false;
   const current=clients.find(client=>client.reference===selected);
   if (current) {
    renderList();
    await select(current.reference,{focus:false});
   } else {
    if (mobileOpen) closeMobile();
    renderList(true);
   }
  } catch {
   if (listSerial!==request || !active) return;
   listLoading=false;
   listError=true;
   renderList();
  }
 }
 function show({ownerId}={}) {
  active=true;
  if (ownerId!==undefined) {
   desiredOwner=ownerId;
   search.value='';
   stage.value='';
   owner.value=ownerId;
   priority='all';
   page=0;
   selected=undefined;
   detail=undefined;
   tab='overview';
   scheduling=false;
   mobileOpen=false;
   detailSerial++;
   detailError=false;
   detailLoading=false;
  }
  renderFilters();
  renderDetail();
  return refresh();
 }
 function reset() {
  active=false;
  clients=[];
  members=[];
  desiredOwner=undefined;
  priority='all';
  page=0;
  selected=undefined;
  detail=undefined;
  tab='overview';
  mobileOpen=false;
  scheduling=false;
  listLoading=false;
  listError=false;
  detailLoading=false;
  detailError=false;
  listSerial++;
  detailSerial++;
  search.value='';
  owner.value='';
  stage.value='';
  notify('');
  renderDetail();
  $('clients-ledger').replaceChildren();
 }
 for (const control of [search,owner,stage]) control.addEventListener(control===search?'input':'change',()=>{
  if (control===owner) desiredOwner=undefined;
  page=0;
  renderList(true);
 });
 mobile.addEventListener('change',()=>{
  if (!active) return;
  if (!mobile.matches) {
   mobileOpen=false;
   renderDetail();
  }
  renderList(true);
 });
 document.addEventListener('caos-language-change',()=>{
  if (!active) return;
  renderFilters();
  renderList();
  renderDetail();
 });
 renderFilters();
 return {show,refresh,reset,select,notify};
}
