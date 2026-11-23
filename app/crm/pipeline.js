const copy={
 'Oportunidades':'Opportunities','Acompanhe cada projeto do primeiro contato ao fechamento.':'Track projects from first contact to close.',
 'Nova oportunidade':'New opportunity','Em andamento':'Open','Ganhas':'Won','Perdidas':'Lost',
 'Em propostas e negociação':'In proposals and negotiation','Retornos atrasados':'Overdue follow-ups',
 'Quadro':'Board','Lista':'List','Buscar projeto ou cliente':'Search project or client','Responsável':'Owner',
 'Sem responsável':'Unassigned','Origem':'Source','Só atrasadas':'Overdue only','Etapa':'Stage',
 'Todas as etapas':'All stages','Ordenar por':'Sort by','Próximo retorno':'Next follow-up','Mais recentes':'Most recent',
 'Maior valor':'Highest value','Nome do projeto':'Project name','Novo':'New','Em conversa':'In conversation',
 'Proposta enviada':'Proposal sent','Negociação':'Negotiation','Ganha':'Won','Perdida':'Lost',
 'Primeiro contato':'First contact','Escopo e prazo':'Scope and timing','Próxima ação':'Next action',
 'Definir próximo passo':'Set next action','Atrasado':'Overdue','Hoje':'Today','Registrar atividade':'Log activity',
 'Mover etapa':'Move stage','Reabrir':'Reopen','Ver detalhes':'View details','Voltar para oportunidades':'Back to opportunities',
 'Editar':'Edit','Ver cliente':'View client','Histórico de etapas':'Stage history','Atividades':'Activities',
 'Nenhuma mudança de etapa registrada.':'No stage changes logged.','Nenhuma atividade registrada.':'No activity logged.',
 'Nenhuma oportunidade nesta etapa.':'No opportunities in this stage.','Nenhuma oportunidade encontrada.':'No opportunities found.',
 'Limpar filtros':'Clear filters','Carregando oportunidades…':'Loading opportunities…',
 'Não foi possível carregar oportunidades.':'Could not load opportunities.','Tentar novamente':'Try again',
 'Carregando histórico…':'Loading history…','Não foi possível carregar o histórico.':'Could not load history.',
 'Visualização':'View','Situação das oportunidades':'Opportunity status','Selecionar etapa':'Select a stage',
 'Valor da proposta (R$)':'Proposal value (BRL)','Data de envio':'Date sent','Data de retorno':'Follow-up date',
 'Valor fechado (R$)':'Won value (BRL)','Data de fechamento':'Closing date','Motivo da perda':'Loss reason',
 'Motivo da mudança':'Reason for change','Motivo da reabertura':'Reason for reopening','Ponto a negociar':'Negotiation point',
 'Confirmar mudança':'Confirm change','Cancelar':'Cancel','Etapa atualizada.':'Stage updated.',
 'Registrada em':'Created on','Na etapa desde':'In this stage since','Proposta enviada em':'Proposal sent on',
 'Fechada em':'Closed on','Valor':'Value','Informe um valor em reais, como 7.200,00.':'Enter an amount in Brazilian reais, such as 7.200,00.',
 'Registre um contato confirmado ou uma reunião realizada antes de avançar.':'Log a confirmed contact or completed meeting before advancing.',
 'Informe o valor, a data de envio e um retorno que não anteceda o envio.':'Enter the value, sent date, and a follow-up on or after the sent date.',
 'Informe a próxima ação e a data de retorno.':'Enter the next action and follow-up date.',
 'Confira a data de fechamento e, se ganha, informe o valor fechado.':'Check the closing date and enter the won value when applicable.',
 'Informe o motivo para continuar.':'Enter a reason to continue.',
 'Essa mudança de etapa não está disponível.':'This stage change is not available.',
 'A oportunidade mudou em outra sessão. Atualize a página e tente novamente.':'The opportunity changed in another session. Refresh and try again.',
 'Não foi possível concluir a ação.':'Could not complete the action.','Oportunidade salva.':'Opportunity saved.',
 'Oportunidade criada.':'Opportunity created.','Atividade registrada.':'Activity logged.',
 'Ligação':'Call','WhatsApp':'WhatsApp','E-mail':'Email','Reunião':'Meeting','Anotação':'Note',
 'Contato realizado':'Reached','Sem resposta':'No answer','Enviado':'Sent','Realizada':'Completed',
 'Não compareceu':'No-show','Registrada':'Logged','Atualizar esta etapa':'Update this stage','Fechada por':'Won by',
 'Visita e campanha':'Visit and campaign','Origem e campanha informadas no cadastro.':'Source and campaign entered manually.',
 'Referência sem visita correspondente.':'No matching visit for this reference.',
 'A referência está associada a dados conflitantes.':'This reference is associated with conflicting data.',
 'Visita vinculada':'Linked visit','Página acessada':'Page opened','Demo aberta':'Demo opened',
 'Clique no WhatsApp':'WhatsApp click','Clique no e-mail':'Email click',
 'Entrada do projeto':'Project deposit','Sem entrada registrada':'No deposit recorded','Pendente':'Pending','Recebida':'Received',
 'Registrar entrada':'Record deposit','Editar entrada':'Edit deposit','Situação da entrada':'Deposit status',
 'Valor da entrada (R$)':'Deposit amount (BRL)','Data do recebimento':'Received date',
 'Salvar entrada pendente':'Save pending deposit','Confirmar entrada recebida':'Confirm deposit received','Entrada salva.':'Deposit saved.',
 'A data do recebimento precisa ser igual ou anterior a hoje.':'The receipt date must be today or earlier.',
 'Informe o valor e confira a situação e a data da entrada.':'Enter an amount and check the deposit status and date.',
 'Histórico de entradas':'Deposit history',
 'Proposta atualizada':'Proposal updated','Negociação atualizada':'Negotiation updated','Fechamento anterior':'Previous closing',
};
const trackKinds={entry:'Página acessada',demo:'Demo aberta',whatsapp:'Clique no WhatsApp',email:'Clique no e-mail'};
const depositState={pending:'Pendente',received:'Recebida'};
const stageNames={novo:'Novo',conversa:'Em conversa',proposta:'Proposta enviada',negociacao:'Negociação',ganho:'Ganha',perdido:'Perdida'};
const boardStages=['novo','conversa','proposta','negociacao'];
const states={open:'Em andamento',ganho:'Ganhas',perdido:'Perdidas'};
const moves={
 novo:['conversa','perdido'],conversa:['proposta','novo','perdido'],
 proposta:['negociacao','ganho','proposta','conversa','perdido'],
 negociacao:['ganho','negociacao','proposta','conversa','perdido'],
 ganho:['conversa','novo'],perdido:['conversa','novo']
};
const kinds={call:'Ligação',whatsapp:'WhatsApp',email:'E-mail',meeting:'Reunião',note:'Anotação'};
const outcomes={connected:'Contato realizado',no_answer:'Sem resposta',sent:'Enviado',completed:'Realizada',no_show:'Não compareceu',recorded:'Registrada'};
const zone='America/Sao_Paulo';
const lang=()=>document.documentElement.lang.startsWith('en')?'en-US':'pt-BR';
const t=value=>lang()==='pt-BR'?value:copy[value]??window.caosTranslate?.(value)??value;
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:zone}).format(new Date());
const normalize=value=>String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const titleFor=row=>row.project_name||row.company||row.name;
const customerFor=row=>row.company||row.name;
const subtitleFor=row=>{
 const customer=customerFor(row);
 if (normalize(titleFor(row))!==normalize(customer)) return customer;
 return normalize(row.name)!==normalize(customer)?row.name:'';
};
const stageName=stage=>t(stageNames[stage]);
const isOpen=row=>boardStages.includes(row.stage);
const isLate=(row,day)=>isOpen(row)&&Boolean(row.due_on&&row.due_on<day);
const money=(value,precise=false)=>new Intl.NumberFormat(lang(),{style:'currency',currency:'BRL',
 minimumFractionDigits:precise||Number(value)%100?2:0,maximumFractionDigits:2}).format(Number(value)/100);
const total=rows=>rows.reduce((sum,row)=>sum+Number(row.value_cents||0),0);
function dateLabel(value,full=false) {
 if (!value) return '';
 const civil=value.length===10;
 return new Intl.DateTimeFormat(lang(),{timeZone:civil?'UTC':zone,day:'numeric',month:'short',
  ...(full&&{year:'numeric'})}).format(new Date(civil?value+'T12:00:00Z':value));
}
function eventTimeLabel(value) {
 return new Intl.DateTimeFormat(lang(),{timeZone:zone,dateStyle:'short',timeStyle:'short'}).format(new Date(value));
}
function dueLabel(row,day) {
 return row.due_on===day?t('Hoje'):isLate(row,day)?t('Atrasado')+' · '+dateLabel(row.due_on):dateLabel(row.due_on);
}
function endDate(row) {return row.closed_on||row.won_at||row.stage_since||'';}
function el(tag,text,cls) {
 const node=document.createElement(tag);
 if (text!=null) node.textContent=text;
 if (cls) node.className=cls;
 return node;
}
function button(text,cls,run) {
 const node=el('button',text,cls);
 node.type='button';
 node.addEventListener('click',run);
 return node;
}
function options(select,entries,selected=select.value) {
 select.replaceChildren(...entries.map(([value,label])=>new Option(label,value)));
 if (entries.some(([value])=>value===selected)) select.value=selected;
}
const shapes={
 plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
 stack:'<path d="m12 3 8 4.5-8 4.5-8-4.5L12 3ZM4 11.5l8 4.5 8-4.5M4 15.5l8 4.5 8-4.5"/>',
 price:'<path d="M20 4v8l-8 8-8-8 8-8h8Z"/><circle cx="16.5" cy="7.5" r=".8"/>',
 alert:'<path d="M12 4 3 20h18L12 4ZM12 9v5m0 3v.2"/>',
 grid:'<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M12 4v16M4 12h16"/>',
 list:'<path d="M4 6h16M4 12h16M4 18h16"/>',user:'<circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2Z"/>',
 filter:'<path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"/>',
 calendar:'<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M8 3v6m8-6v6M4 11h16"/>',
 box:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5M12 12v9"/>',
 chat:'<path d="M20.5 11.5a8.5 7 0 0 1-8.5 7 10 10 0 0 1-3-.5l-4.5 2 .8-4A6.6 6.6 0 0 1 3.5 11.5a8.5 7 0 0 1 17 0Z"/>',
 folder:'<path d="M4 6h6l2 2h8v11H4V6Z"/>',monitor:'<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8m-4-4v4"/>',
 trend:'<path d="m4 15 5-5 4 3 7-8m-6 0h6v6M4 21h16"/>',check:'<path d="m5 12 4 4L19 6"/>',
 left:'<path d="m14 5-7 7 7 7"/>',down:'<path d="m6 9 6 6 6-6"/>'
};
function icon(name) {
 const span=el('span',null,'pipeline-icon');
 span.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+shapes[name]+'</svg>';
 return span;
}
const stageIcons={novo:'box',conversa:'folder',proposta:'monitor',negociacao:'trend',ganho:'check',perdido:'box'};
function amountInput(value) {
 return value?new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value)/100):'';
}
function parseAmount(text) {
 const value=text.trim();
 if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/.test(value)) return null;
 const [whole,fraction='']=value.split(',');
 const cents=Number(whole.replaceAll('.',''))*100+Number(fraction.padEnd(2,'0'));
 return Number.isSafeInteger(cents)&&cents>0&&cents<=2147483647?cents:null;
}

export function initPipeline(api,getActor,callbacks) {
 const root=document.getElementById('pipeline-page');
 root.dataset.noTranslate='';
 root.innerHTML='<div class="pipeline-heading"><div><h1 id="pipeline-title" tabindex="-1" data-pipeline-copy="Oportunidades"></h1>'+
  '<p data-pipeline-copy="Acompanhe cada projeto do primeiro contato ao fechamento."></p></div>'+
  '<button class="primary" id="pipeline-new" type="button"><span data-pipeline-copy="Nova oportunidade"></span></button></div>'+
  '<p id="pipeline-notice" role="status"></p><div id="pipeline-main"><div id="pipeline-summary" class="pipeline-summary"></div>'+
  '<div class="pipeline-toolbar"><div id="pipeline-states" class="pipeline-states" role="group"></div><div id="pipeline-views" class="pipeline-views" role="group"></div></div>'+
  '<div class="pipeline-filters"><label class="pipeline-search"><span class="pipeline-sr" data-pipeline-copy="Buscar projeto ou cliente"></span><input type="search" id="pipeline-search"></label>'+
  '<label id="pipeline-owner-field"><span class="pipeline-sr" data-pipeline-copy="Responsável"></span><select id="pipeline-owner"></select></label>'+
  '<label><span class="pipeline-sr" data-pipeline-copy="Origem"></span><select id="pipeline-origin"></select></label>'+
  '<button class="quiet" id="pipeline-overdue" type="button" aria-pressed="false"><span data-pipeline-copy="Só atrasadas"></span></button></div>'+
  '<div id="pipeline-list-tools" class="pipeline-list-tools" hidden>'+
  '<label id="pipeline-stage-filter"><span data-pipeline-copy="Etapa"></span><select id="pipeline-list-stage"></select></label>'+
  '<label><span data-pipeline-copy="Ordenar por"></span><select id="pipeline-order"></select></label></div><div id="pipeline-results"></div></div>'+
  '<div id="pipeline-selection"></div><section id="pipeline-panel" class="pipeline-panel" hidden></section>';
 const $=id=>root.querySelector('#'+id);
 const search=$('pipeline-search'),owner=$('pipeline-owner'),origin=$('pipeline-origin'),stageFilter=$('pipeline-list-stage'),orderSelect=$('pipeline-order');
 const mobile=matchMedia('(max-width: 58rem)');
 let rows=[],members=[];
 let active=false,loading=false,loadError=false,request=0,panelRequest=0;
 let selected,status='open',view='board',stage='',order='due',onlyLate=false,notice='',noticeError=false;
 let panelMode='',mobileOpen=false,returnScroll=0;

 $('pipeline-new').prepend(icon('plus'));
 $('pipeline-overdue').prepend(icon('filter'));
 root.querySelector('.pipeline-search').prepend(icon('search'));

 function notify(message,error=false) {
  notice=message;
  noticeError=error;
  $('pipeline-notice').textContent=t(message);
  $('pipeline-notice').dataset.error=String(error);
 }
 function failureMessage(error) {
  const code=error.code||error.message;
  const messages={
   first_contact_required:'Registre um contato confirmado ou uma reunião realizada antes de avançar.',
   stale:'A oportunidade mudou em outra sessão. Atualize a página e tente novamente.',
   proposal_required:'Informe o valor, a data de envio e um retorno que não anteceda o envio.',
   followup_required:'Informe a próxima ação e a data de retorno.',
   closure_required:'Confira a data de fechamento e, se ganha, informe o valor fechado.',
   reason_required:'Informe o motivo para continuar.',
   stage_transition:'Essa mudança de etapa não está disponível.'
  };
  if (messages[code]) return messages[code];
  return error.message?.includes(' ')?error.message:'Não foi possível concluir a ação.';
 }
 async function invoke(name,...args) {
  try { await callbacks[name](...args); }
  catch (error) { notify(failureMessage(error),true); }
 }
 const ownerFor=row=>row.owner_name||t('Sem responsável');
 const caption=row=>[subtitleFor(row),ownerFor(row)].filter(Boolean).join(' · ');
 const dates=(row,day)=>isOpen(row)?dueLabel(row,day):dateLabel(endDate(row),true);
 const chosen=()=>rows.find(row=>row.reference===selected);
 const cardButton=()=>[...root.querySelectorAll('[data-reference]')].find(item=>item.dataset.reference===selected);
 function renderLabels() {
  root.querySelectorAll('[data-pipeline-copy]').forEach(node=>node.textContent=t(node.dataset.pipelineCopy));
  search.placeholder=t('Buscar projeto ou cliente');
  $('pipeline-states').setAttribute('aria-label',t('Situação das oportunidades'));
  $('pipeline-views').setAttribute('aria-label',t('Visualização'));
  $('pipeline-owner-field').hidden=getActor()?.role!=='admin';
  options(owner,[['',t('Responsável')],['unassigned',t('Sem responsável')],...members.map(item=>[item.id,item.name])]);
  options(origin,[['',t('Origem')],...[...new Set(rows.map(row=>row.origin).filter(Boolean))].sort().map(value=>[value,value.replaceAll('_',' ').replaceAll('-',' ')])]);
  options(stageFilter,[['',t('Todas as etapas')],...boardStages.map(key=>[key,stageName(key)])],stage);
  options(orderSelect,[['due',t('Próximo retorno')],['updated',t('Mais recentes')],['value',t('Maior valor')],['name',t('Nome do projeto')]],order);
  notify(notice,noticeError);
 }
 function renderSummary(day) {
  const open=rows.filter(isOpen);
  const forecast=total(open.filter(row=>row.stage==='proposta'||row.stage==='negociacao'));
  const data=[
   ['stack',open.length,'Em andamento'],['price',money(forecast),'Em propostas e negociação'],
   ['alert',open.filter(row=>isLate(row,day)).length,'Retornos atrasados']
  ];
  $('pipeline-summary').replaceChildren(...data.map(([glyph,value,label])=>{
   const node=el('div',null,'pipeline-metric');
   node.dataset.metric=glyph;
   node.append(icon(glyph),el('strong',value),el('span',t(label)));
   return node;
  }));
 }
 function focusGroup(id,key) {
  $(id).querySelector('[data-key="'+key+'"]')?.focus({preventScroll:true});
 }
 function renderToolbar(listMode) {
  $('pipeline-states').replaceChildren(...Object.entries(states).map(([key,label])=>{
   const count=rows.filter(row=>key==='open'?isOpen(row):row.stage===key).length;
   const item=button(t(label),'quiet',()=>{
    status=key;
    if (status!=='open') onlyLate=false;
    stage='';
    renderFilter();
    focusGroup('pipeline-states',key);
   });
   item.dataset.key=key;
   item.append(el('strong',count));
   item.setAttribute('aria-pressed',String(status===key));
   return item;
  }));
  $('pipeline-views').hidden=mobile.matches||status!=='open';
  $('pipeline-views').replaceChildren(...[['board','Quadro','grid'],['list','Lista','list']].map(([key,label,glyph])=>{
   const item=button(t(label),'quiet',()=>{
    view=key;
    renderFilter();
    focusGroup('pipeline-views',key);
   });
   item.dataset.key=key;
   item.prepend(icon(glyph));
   item.setAttribute('aria-pressed',String(view===key));
   return item;
  }));
  $('pipeline-overdue').hidden=status!=='open';
  $('pipeline-overdue').setAttribute('aria-pressed',String(onlyLate));
  $('pipeline-list-tools').hidden=!listMode;
  $('pipeline-stage-filter').hidden=status!=='open';
 }
 function filtered(day,listMode) {
  const query=normalize(search.value.trim());
  const visible=rows.filter(row=>(status==='open'?isOpen(row):row.stage===status) &&
   (!query||normalize([titleFor(row),row.name,row.company,row.email,row.reference].join(' ')).includes(query)) &&
   (!owner.value||owner.value===(row.owner_id||'unassigned')) && (!origin.value||origin.value===row.origin) &&
   (!onlyLate||isLate(row,day)) && (!listMode||status!=='open'||!stage||row.stage===stage));
  return visible.sort((a,b)=>{
   if (listMode&&order==='updated') return (b.updated_at||'').localeCompare(a.updated_at||'');
   if (listMode&&order==='value') return Number(b.value_cents||0)-Number(a.value_cents||0);
   if (listMode&&order==='name') return titleFor(a).localeCompare(titleFor(b),lang());
   if (status!=='open') return endDate(b).localeCompare(endDate(a));
   return (a.due_on||'9999').localeCompare(b.due_on||'9999')||titleFor(a).localeCompare(titleFor(b),lang());
  });
 }
 function makeCard(row,day,listMode) {
  const item=button('',listMode?'pipeline-row':'pipeline-card',()=>select(row.reference));
  item.dataset.reference=row.reference;
  item.setAttribute('aria-pressed',String(selected===row.reference));
  const content=el('span',null,'pipeline-card-content');
  content.append(el('strong',titleFor(row)));
  if (subtitleFor(row)) content.append(el('span',subtitleFor(row),'pipeline-card-client'));
  if (Number(row.value_cents)>0) content.append(el('strong',money(row.value_cents),'pipeline-card-amount'));
  const next=isOpen(row)?row.next_step||t('Definir próximo passo'):row.loss_reason;
  if (next) content.append(el('span',next,'pipeline-card-next'));
  if (listMode) {
   const tag=el('span',stageName(row.stage),'pipeline-stage-tag');
   tag.dataset.stage=row.stage;
   content.append(tag);
  }
  const foot=el('span',null,'pipeline-card-footer');
  const date=dates(row,day);
  if (date) {
   const dateGroup=el('span',null,'pipeline-card-date');
   dateGroup.dataset.late=String(isLate(row,day));
   dateGroup.append(icon('calendar'),el('span',date));
   foot.append(dateGroup);
  }
  const assignment=el('span',null,'pipeline-card-owner');
  assignment.append(icon('user'),el('span',ownerFor(row)));
  foot.append(assignment);
  item.append(icon(stageIcons[row.stage]),content,foot);
  return item;
 }
 function cards(rows,day,listMode) {
  const list=el('ul',null,listMode?'pipeline-ledger':'pipeline-column-list');
  for (const row of rows) {
   const item=el('li');
   item.append(makeCard(row,day,listMode));
   list.append(item);
  }
  return list;
 }
 function drawResults(visible,day,listMode) {
  const target=$('pipeline-results');
  const loadingNew=loading&&!rows.length;
  if (loadError||loadingNew||(listMode&&!visible.length)) {
   target.className='pipeline-empty';
   const label=loadError?'Não foi possível carregar oportunidades.':loadingNew?'Carregando oportunidades…':'Nenhuma oportunidade encontrada.';
   target.replaceChildren(el('p',t(label)));
   if (loadError) target.append(button(t('Tentar novamente'),'quiet',refresh));
   else if (!loadingNew&&(search.value||owner.value||origin.value||onlyLate||stage)) target.append(button(t('Limpar filtros'),'quiet',clearFilters));
   return;
  }
  target.className='';
  if (listMode) { target.replaceChildren(cards(visible,day,true)); return; }
  const columns=el('div',null,'pipeline-board');
  for (const key of boardStages) {
   const group=visible.filter(row=>row.stage===key);
   const section=el('section',null,'pipeline-column');
   section.dataset.stage=key;
   const heading=el('header');
   const title=el('h2',stageName(key));
   title.id='pipeline-column-'+key;
   title.append(el('span',group.length));
   section.setAttribute('aria-labelledby',title.id);
   heading.append(title,el('p',key==='novo'?t('Primeiro contato'):key==='conversa'?t('Escopo e prazo'):money(total(group))));
   section.append(heading,group.length?cards(group,day,false):el('p',t('Nenhuma oportunidade nesta etapa.'),'pipeline-column-empty'));
   columns.append(section);
  }
  target.replaceChildren(columns);
 }
 function drawSelection(day) {
  const target=$('pipeline-selection');
  target.replaceChildren();
  const row=chosen();
  if (!row) return;
  const wrap=el('section',null,'pipeline-selected');
  const identity=button('','pipeline-detail-trigger',()=>openPanel('detail'));
  identity.setAttribute('aria-label',t('Ver detalhes')+' · '+titleFor(row));
  const title=el('span');
  title.append(el('strong',titleFor(row)),el('small',caption(row)));
  identity.append(icon(stageIcons[row.stage]),title);
  const followup=el('div',null,'pipeline-selected-next');
  followup.append(el('strong',isOpen(row)?t('Próxima ação'):stageName(row.stage)),el('span',
   [isOpen(row)?row.next_step||t('Definir próximo passo'):row.loss_reason,dates(row,day)].filter(Boolean).join(' · ')));
  const actions=el('div',null,'pipeline-selected-actions');
  if (isOpen(row)) {
   const log=button(t('Registrar atividade'),'quiet',()=>invoke('logActivity',row.reference));
   log.prepend(icon('chat'));
   actions.append(log);
  }
  const move=button(t(isOpen(row)?'Mover etapa':'Reabrir'),'primary',()=>openPanel('move'));
  move.id='pipeline-move';
  move.append(icon('down'));
  actions.append(move);
  wrap.append(identity,followup,actions);
  target.append(wrap);
 }
 function render() {
  const day=today();
  const listMode=mobile.matches||view==='list'||status!=='open';
  const visible=filtered(day,listMode);
  root.dataset.detailOpen=String(mobileOpen);
  if (!mobileOpen&&!visible.some(row=>row.reference===selected)) {
   selected=mobile.matches?undefined:(visible.find(row=>row.stage==='proposta'&&row.project_name&&Number(row.value_cents)>0)||
    visible.find(row=>row.stage==='proposta')||visible[0])?.reference;
  }
  renderLabels();
  renderSummary(day);
  renderToolbar(listMode);
  drawResults(visible,day,listMode);
  drawSelection(day);
 }
 function renderFilter() { closePanel(false); render(); }
 function clearFilters() {
  search.value='';
  owner.value='';
  origin.value='';
  stage='';
  onlyLate=false;
  renderFilter();
  search.focus();
 }
 function closePanel(focus=true) {
  const fromMobile=mobileOpen;
  const control=panelMode==='detail'?root.querySelector('.pipeline-detail-trigger'):$('pipeline-move');
  mobileOpen=false;
  panelMode='';
  panelRequest++;
  $('pipeline-panel').hidden=true;
  root.dataset.detailOpen='false';
  if (!focus) return;
  ((fromMobile?cardButton():control)||$('pipeline-title')).focus({preventScroll:true});
  if (fromMobile) window.scrollTo(0,returnScroll);
 }
 function select(reference,{focus=true}={}) {
  const row=rows.find(item=>item.reference===reference);
  if (!row) return;
  if (!filtered(today(),mobile.matches||view==='list'||status!=='open').includes(row)) {
   status=isOpen(row)?'open':row.stage;
   search.value='';
   owner.value='';
   origin.value='';
   stage='';
   onlyLate=false;
  }
  if (selected!==reference) closePanel(false);
  selected=reference;
  render();
  if (mobile.matches) { if (focus) openPanel('detail'); }
  else if (focus) cardButton()?.focus({preventScroll:true});
 }
 function openPanel(mode) {
  const row=chosen();
  if (!row) return;
  if (mobile.matches&&!mobileOpen) {returnScroll=window.scrollY;mobileOpen=true;}
  panelMode=mode;
  panelRequest++;
  root.dataset.detailOpen=String(mobileOpen);
  const panel=$('pipeline-panel');
  panel.hidden=false;
  paintPanel(row);
  panel.querySelector('h2').focus({preventScroll:true});
  if (mobileOpen) window.scrollTo(0,0);
  else panel.scrollIntoView({block:'nearest'});
 }
 function historyList(records,makeItem,empty) {
  if (!records.length) return el('p',t(empty),'pipeline-empty-history');
  const list=el('ol',null,'pipeline-history-list');
  for (const record of records) list.append(makeItem(record));
  return list;
 }
 async function loadHistory(row,history,attribution) {
  const serial=++panelRequest;
  history.replaceChildren(el('p',t('Carregando histórico…')));
  history.setAttribute('aria-busy','true');
  try {
   const result=await api('pipeline-detail&'+new URLSearchParams({reference:row.reference}));
   if (serial!==panelRequest||!active||panelMode!=='detail') return;
   const visit=result.attribution ?? {status:'manual',events:[]};
   const summary={
    linked:'Visita vinculada',unmatched:'Referência sem visita correspondente.',
    conflict:'A referência está associada a dados conflitantes.',manual:'Origem e campanha informadas no cadastro.'
   };
   attribution.replaceChildren(el('h3',t('Visita e campanha')),
    el('p',[row.origin,row.campaign,row.medium,row.creative].filter(Boolean).join(' · ')),
    el('p',[t(summary[visit.status]),row.visit_reference].filter(Boolean).join(' · '),'pipeline-section-note'));
   if (visit.events.length) attribution.append(historyList(visit.events,event=>{
    const item=el('li');
    item.append(el('strong',t(trackKinds[event.kind])),el('small',eventTimeLabel(event.recorded_at)));
    return item;
   },''));
   const changes=historyList(result.events||[],event=>{
    const item=el('li');
    const change=event.from_stage===event.to_stage?t(event.to_stage==='proposta'?'Proposta atualizada':'Negociação atualizada'):
     [event.from_stage&&stageName(event.from_stage),stageName(event.to_stage)].filter(Boolean).join(' → ');
    item.append(el('strong',change),el('small',[dateLabel(event.occurred_at,true),event.actor_name].filter(Boolean).join(' · ')));
    if (event.reason) item.append(el('p',event.reason));
    if (event.won_by_name) item.append(el('small',t('Fechada por')+' · '+event.won_by_name));
    if (event.to_stage==='proposta'||event.to_stage==='ganho'||event.to_stage==='perdido') {
     const recorded=[
      event.value_cents&&event.to_stage!=='perdido'?money(event.value_cents,true):'',
      dateLabel(event.to_stage==='proposta'?event.proposal_on:event.closed_on,true)
     ].filter(Boolean);
     if (recorded.length) item.append(el('small',recorded.join(' · ')));
    }
    if (event.previous_closed_on) {
     const prior=[dateLabel(event.previous_closed_on,true),event.previous_value_cents?money(event.previous_value_cents,true):'',
      event.previous_won_by_name].filter(Boolean);
     item.append(el('small',t('Fechamento anterior')+' · '+prior.join(' · ')));
    }
    return item;
   },'Nenhuma mudança de etapa registrada.');
   const log=historyList(result.activities||[],event=>{
    const item=el('li');
    item.append(el('strong',[kinds[event.kind],outcomes[event.outcome]].filter(Boolean).map(t).join(' · ')),
     el('small',[dateLabel(event.occurred_at,true),event.actor_name].filter(Boolean).join(' · ')));
    if (event.notes) item.append(el('p',event.notes));
    return item;
   },'Nenhuma atividade registrada.');
   history.replaceChildren(el('h3',t('Histórico de etapas')),changes,el('h3',t('Atividades')),log);
   if (result.depositEvents?.length) {
    const deposits=historyList(result.depositEvents,event=>{
     const item=el('li');
     item.append(el('strong',[t(depositState[event.status]),money(event.value_cents,true),dateLabel(event.received_on,true)].filter(Boolean).join(' · ')),
      el('small',[eventTimeLabel(event.occurred_at),event.actor_name].filter(Boolean).join(' · ')));
     return item;
    },'');
    history.append(el('h3',t('Histórico de entradas')),deposits);
   }
  } catch {
   if (serial!==panelRequest) return;
   history.replaceChildren(el('p',t('Não foi possível carregar o histórico.')),
    button(t('Tentar novamente'),'quiet',()=>loadHistory(row,history,attribution)));
  } finally { history.removeAttribute('aria-busy'); }
 }
 function paintPanel(row) {
  const panel=$('pipeline-panel');
  const heading=el('div',null,'pipeline-panel-heading');
  const titles=el('div');
  const title=el('h2',panelMode==='move'?t(isOpen(row)?'Mover etapa':'Reabrir'):titleFor(row));
  title.id='pipeline-panel-title';
  title.tabIndex=-1;
  titles.append(title,el('p',panelMode==='move'?titleFor(row)+' · '+stageName(row.stage):caption(row)));
  const back=button(t('Voltar para oportunidades'),'quiet pipeline-back',()=>closePanel());
  back.prepend(icon('left'));
  heading.append(titles,back);
  panel.setAttribute('aria-labelledby',title.id);
  panel.replaceChildren(heading);
  if (panelMode==='move') {panel.append(moveForm(row));return;}
  const meta=el('dl',null,'pipeline-profile');
  for (const [label,value] of [
   ['Etapa',stageName(row.stage)],['Valor',row.value_cents?money(row.value_cents,true):''],
   ['Próxima ação',isOpen(row)?row.next_step:''],['Data de retorno',isOpen(row)?dateLabel(row.due_on,true):''],
   ['Na etapa desde',dateLabel(row.stage_since,true)],['Registrada em',dateLabel(row.created_at,true)],
   ['Proposta enviada em',dateLabel(row.proposal_on,true)],['Fechada em',dateLabel(row.closed_on,true)],
   ['Fechada por',row.won_by_name],['Motivo da perda',row.loss_reason]
  ]) {
   if (!value) continue;
   const item=el('div');
   item.append(el('dt',t(label)),el('dd',value));
   meta.append(item);
  }
  const actions=el('div',null,'pipeline-profile-actions');
  actions.append(button(t(isOpen(row)?'Mover etapa':'Reabrir'),'primary',()=>openPanel('move')));
  if (isOpen(row)) actions.append(button(t('Registrar atividade'),'quiet',()=>invoke('logActivity',row.reference)));
  actions.append(button(t('Editar'),'quiet',()=>invoke('editOpportunity',row.reference)),
   button(t('Ver cliente'),'quiet',()=>invoke('openClient',row.client_reference||row.reference)));
  const attribution=el('section',null,'pipeline-commercial-section');
  const history=el('div',null,'pipeline-history');
  panel.append(meta,actions,attribution,depositSection(row),history);
  loadHistory(row,history,attribution);
 }
 function formField(label,name,type,value='',attributes={}) {
  const field=el('label',t(label));
  const input=el(type==='textarea'?'textarea':'input');
  input.name=name;
  if (type!=='textarea') input.type=type;
  Object.assign(input,{value,required:true,...attributes});
  field.append(input);
  return field;
 }
 function depositSection(row) {
  const section=el('section',null,'pipeline-commercial-section');
  const title=el('h3',t('Entrada do projeto'));
  const summary=row.deposit_status
   ? [t(depositState[row.deposit_status]),money(row.deposit_cents,true),dateLabel(row.deposit_received_on,true)].filter(Boolean).join(' · ')
   : t('Sem entrada registrada');
  const details=el('details',null,'pipeline-deposit-editor');
  const toggle=el('summary',t(row.deposit_status?'Editar entrada':'Registrar entrada'));
  const form=el('form',null,'pipeline-stage-form');
  const controls=el('div',null,'pipeline-stage-fields');
  const stateLabel=el('label',t('Situação da entrada'));
  const state=el('select');
  state.name='status';
  options(state,Object.entries(depositState).map(([value,label])=>[value,t(label)]),row.deposit_status||'pending');
  stateLabel.append(state);
  const amount=formField('Valor da entrada (R$)','amount','text',amountInput(row.deposit_cents),{inputMode:'decimal',maxLength:15});
  const date=formField('Data do recebimento','received_on','date',row.deposit_received_on||'',{min:'2000-01-01',max:today()});
  const dateInput=date.querySelector('input');
  const submit=el('button',null,'primary');
  submit.type='submit';
  const help=el('p',null,'pipeline-stage-help');
  help.setAttribute('role','status');
  controls.append(stateLabel,amount,date);
  form.append(controls,submit,help);
  const updateStatus=()=>{
   const received=state.value==='received';
   date.hidden=!received;
   dateInput.disabled=!received;
   dateInput.required=received;
   submit.textContent=t(received?'Confirmar entrada recebida':'Salvar entrada pendente');
  };
  updateStatus();
  state.addEventListener('change',updateStatus);
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   const cents=parseAmount(form.elements.amount.value);
   if (cents===null) {
    help.textContent=t('Informe um valor em reais, como 7.200,00.');
    form.elements.amount.focus();
    return;
   }
   help.textContent='';
   submit.disabled=true;
   try {
    await api('pipeline-deposit','PATCH',{reference:row.reference,revision:row.revision,
     status:state.value,value_cents:cents,received_on:dateInput.disabled?null:dateInput.value});
    await refresh();
    if (active&&selected===row.reference) $('pipeline-panel').querySelector('.pipeline-deposit-editor summary')?.focus();
    notify('Entrada salva.');
   } catch (error) {
    const messages={invalid_deposit_date:'A data do recebimento precisa ser igual ou anterior a hoje.',
     invalid_deposit:'Informe o valor e confira a situação e a data da entrada.'};
    help.textContent=t(messages[error.code]||failureMessage(error));
    submit.disabled=false;
   }
  });
  details.append(toggle,form);
  section.append(title,el('p',summary,'pipeline-deposit-summary'),details);
  return section;
 }
 function moveForm(row,initialStage='') {
  const form=el('form',null,'pipeline-stage-form');
  const toLabel=el('label',t('Etapa'));
  const target=el('select');
  target.id='pipeline-target-stage';
  target.name='stage';
  target.required=true;
  options(target,[['',t('Selecionar etapa')],...(moves[row.stage]||[]).map(value=>[value,
   value===row.stage?t('Atualizar esta etapa')+' · '+stageName(value):stageName(value)])],initialStage);
  toLabel.append(target);
  const fields=el('div',null,'pipeline-stage-fields');
  const help=el('p',null,'pipeline-stage-help');
  help.setAttribute('role','alert');
  const submit=el('button',t('Confirmar mudança'),'primary');
  submit.type='submit';
  const actions=el('div',null,'pipeline-profile-actions');
  actions.append(submit,button(t('Cancelar'),'quiet',()=>closePanel()));
  form.append(toLabel,fields,help,actions);
  function renderFields() {
   const to=target.value;
   const day=today();
   const inputs=[];
   const fromIndex=boardStages.indexOf(row.stage),toIndex=boardStages.indexOf(to);
   const quote=to==='proposta',negotiate=to==='negociacao';
   if (quote||negotiate||to==='ganho') inputs.push(formField(to==='ganho'?'Valor fechado (R$)':'Valor da proposta (R$)',
    'amount','text',amountInput(row.value_cents),{inputMode:'decimal',required:!negotiate}));
   if (quote) inputs.push(formField('Data de envio','proposal_on','date',row.proposal_on||day,{max:day}));
   if (to==='ganho'||to==='perdido') inputs.push(formField('Data de fechamento','closed_on','date',day,{max:day}));
   if (quote||negotiate||(row.stage==='novo'&&to==='conversa')) {
    inputs.push(formField(negotiate?'Ponto a negociar':'Próxima ação','next_step','text',row.next_step||'',{maxLength:240,required:quote||negotiate}),
     formField('Data de retorno','due_on','date',row.due_on||'',{required:quote||negotiate}));
   }
   if (to==='perdido'||(to&&!isOpen(row))||(toIndex>=0&&toIndex<fromIndex)) {
    inputs.push(formField(to==='perdido'?'Motivo da perda':!isOpen(row)?'Motivo da reabertura':'Motivo da mudança',
     'reason','textarea','',{maxLength:500,rows:3}));
   }
   const needsContact=row.stage==='novo'&&to==='conversa'&&row.has_confirmed_contact===false;
   help.textContent=needsContact?t('Registre um contato confirmado ou uma reunião realizada antes de avançar.'):'';
   if (needsContact) inputs.push(button(t('Registrar atividade'),'quiet',()=>invoke('logActivity',row.reference)));
   fields.replaceChildren(...inputs);
   submit.disabled=!to||needsContact;
  }
  target.addEventListener('change',renderFields);
  renderFields();
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   const values=Object.fromEntries(new FormData(form));
   if (values.amount?.trim()) {
    const cents=parseAmount(values.amount);
    if (cents===null) {
     help.textContent=t('Informe um valor em reais, como 7.200,00.');
     form.elements.namedItem('amount').focus();
     return;
    }
    values.value_cents=cents;
   }
   delete values.amount;
   for (const key of Object.keys(values)) if (values[key]==='') delete values[key];
   submit.disabled=true;
   help.textContent='';
   try {
    await api('pipeline-stage','PATCH',{reference:row.reference,revision:row.revision,...values});
    closePanel(false);
    status=boardStages.includes(values.stage)?'open':values.stage;
    stage='';
    onlyLate=false;
    await refresh();
    select(row.reference,{focus:false});
    notify('Etapa atualizada.');
    $('pipeline-title').focus({preventScroll:true});
   } catch (error) {
    help.textContent=t(failureMessage(error));
    submit.disabled=false;
   }
  });
  return form;
 }
 async function refresh() {
  active=true;
  const serial=++request;
  loading=true;
  loadError=false;
  render();
  try {
   const result=await api('pipeline');
   if (serial!==request) return;
   rows=result.rows;
   members=result.members||[];
  } catch {if (serial===request) loadError=true;}
  finally {
   if (serial!==request) return;
   loading=false;
   const target=$('pipeline-target-stage')?.value;
   render();
   const row=chosen();
   if (row&&panelMode==='move') {
    const old=$('pipeline-panel').querySelector('form');
    const values=new FormData(old);
    const updated=moveForm(row,target);
    for (const [key,value] of values) {
     const input=updated.elements.namedItem(key);
     if (input) input.value=value;
    }
    old.replaceWith(updated);
   } else if (row&&panelMode==='detail') paintPanel(row);
   else if (!row&&panelMode) closePanel(false);
  }
 }
 function reset() {
  request++;
  closePanel(false);
  rows=[];
  members=[];
  active=false;
  loading=false;
  loadError=false;
  selected=undefined;
  status='open';
  view='board';
  stage='';
  order='due';
  onlyLate=false;
  search.value='';
  owner.value='';
  origin.value='';
  notify('');
  render();
 }
 search.addEventListener('input',renderFilter);
 for (const filter of [owner,origin]) filter.addEventListener('change',renderFilter);
 stageFilter.addEventListener('change',()=>{stage=stageFilter.value;render();});
 orderSelect.addEventListener('change',()=>{order=orderSelect.value;render();});
 $('pipeline-overdue').addEventListener('click',()=>{onlyLate=!onlyLate;renderFilter();});
 $('pipeline-new').addEventListener('click',()=>invoke('newOpportunity'));
 mobile.addEventListener('change',()=>{if (!mobile.matches&&mobileOpen) closePanel(false);render();});
 document.addEventListener('caos-language-change',()=>{
  render();
  const row=chosen();
  if (row&&panelMode==='detail') paintPanel(row);
 });
 render();
 return {show:refresh,refresh,reset,select,notify};
}
