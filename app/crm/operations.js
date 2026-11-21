import { initTodayPerformance } from './today-performance.js';
import { initTodayExperiments } from './today-experiments.js';
import { teamText } from './team.js';
import { initAgenda } from './agenda.js';

const t = text => window.caosTranslate?.(text) ?? text;
const $ = id => document.getElementById(id);
const zone = 'America/Sao_Paulo';
const dayFormat = new Intl.DateTimeFormat('sv-SE', {timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit'});
const clockFormat = new Intl.DateTimeFormat('en-GB', {timeZone: zone, hour:'2-digit', minute:'2-digit', hourCycle:'h23'});
const dayOf = value => dayFormat.format(new Date(value));
const clockOf = value => clockFormat.format(new Date(value));
const today = () => dayOf(Date.now());
const firstCalendarDay = '2000-01-01';
const lastCalendarDay = '2100-12-31';
const dateFromDay = value => new Date(value + 'T12:00:00Z');
const dayString = value => value.toISOString().slice(0,10);
const shiftDay = (value, delta) => {
 const date = dateFromDay(value);
 date.setUTCDate(date.getUTCDate() + delta);
 return dayString(date);
};
const clampDay = (day) => day<firstCalendarDay ? firstCalendarDay : day>lastCalendarDay ? lastCalendarDay : day;
const weekOf = (day) => {
 const monday=shiftDay(day,-((dateFromDay(day).getUTCDay()+6)%7));
 return {start:clampDay(monday),end:clampDay(shiftDay(monday,6))};
};
const locale = () => document.documentElement.lang === 'en' ? 'en-GB' : 'pt-BR';
const dateLabel = (value, options) => new Intl.DateTimeFormat(locale(), {timeZone:'UTC', ...options}).format(dateFromDay(value));
const titleCase = value => value.charAt(0).toUpperCase() + value.slice(1);
const dateFull = value => titleCase(dateLabel(value, {weekday:'long', month:'long', day:'numeric'}));
const dateShort = value => dateLabel(value, {month:'short', day:'numeric'});
const contactName = item => item.company || item.name;
const projectContact = item => [contactName(item),item.project_name].filter(Boolean).join(' · ');
const searchable = value => String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const matches = (item, query) => searchable([item.name, item.company, item.project_name, item.reference].join(' ')).includes(query);
const minuteOf = value => {
 const [hours, minutes] = value.split(':').map(Number);
 return hours * 60 + minutes;
};
const clockLabel = minutes => String(Math.floor(minutes / 60)).padStart(2,'0') + ':' + String(minutes % 60).padStart(2,'0');
const apptKinds = {meeting:'Reunião', call:'Ligação', review:'Revisão'};
const activityKinds = {call:'Ligação', whatsapp:'WhatsApp', email:'E-mail', meeting:'Reunião', note:'Anotação'};
const activityOutcomes = {connected:'Contato realizado', no_answer:'Sem resposta', sent:'Enviado', completed:'Realizada', no_show:'Não compareceu', recorded:'Registrada'};
const activityIcons = {call:'call', whatsapp:'message', email:'mail', meeting:'calendar', note:'note'};
const allowedOutcomes = {call:['connected','no_answer'], whatsapp:['sent','connected'], email:['sent','connected'], meeting:['completed','no_show'], note:['recorded']};
const statusNames = {scheduled:'Agendado', completed:'Concluído', cancelled:'Cancelado', no_show:'Ausência'};
const stageNames = {novo:'Novo', conversa:'Em conversa', proposta:'Proposta', negociacao:'Negociação', ganho:'Fechado'};

function localToIso(day, clock) {
 const target = Date.parse(day + 'T' + clock + ':00Z');
 if (!Number.isFinite(target)) return null;
 let candidate = target;
 for (let i=0; i<3; i++) {
  const rendered = Date.parse(dayOf(candidate) + 'T' + clockOf(candidate) + ':00Z');
  if (rendered === target) return new Date(candidate).toISOString();
  candidate += target - rendered;
 }
 return null;
}

function node(tag, css, copy) {
 const el = document.createElement(tag);
 if (css) el.className = css;
 if (copy) el.textContent = copy;
 return el;
}

function icon(name) {
 const namespace = 'http://www.w3.org/2000/svg';
 const svg = document.createElementNS(namespace,'svg');
 const use = document.createElementNS(namespace,'use');
 svg.setAttribute('aria-hidden','true');
 use.setAttribute('href','#op-' + name);
 svg.append(use);
 return svg;
}

function empty(text) {
 return node('p','operations-empty',t(text));
}

function action(css, name, value, copy) {
 const button = node('button',css,copy);
 button.type = 'button';
 button.dataset[name] = value;
 return button;
}

function options(select, items, selected) {
 select.replaceChildren(...items.map(([value,label]) => new Option(label,value)));
 if (items.some(([value]) => value === selected)) select.value=selected;
}

function dateForSchedule(row) {
 return dateFull(dayOf(row.starts_at)) + ' · ' + clockOf(row.starts_at);
}

function overlapsDay(item, day) {
 const from = new Date(item.starts_at).getTime();
 const until = from + Number(item.duration_minutes) * 60000 - 1;
 return dayOf(from)<=day && dayOf(until)>=day;
}

export function initOperations(api, navigate, openContact, getActor) {
 const performance = initTodayPerformance(api, getActor);
 const experiments = initTodayExperiments(api);
 const availableExperiments = () => !getActor() || getActor().role==='admin';
 const form = $('operations-form');
 const fields = form.elements;
 const pages = {hoje:$('operations-today'),agenda:$('operations-agenda'),atendimentos:$('operations-activities')};
 const headings = {hoje:'Hoje',agenda:'Agenda',atendimentos:'Atendimentos'};
 const outcomeButtons = [...form.querySelectorAll('[data-appointment-status]')];
 let page = 'hoje';
 let active = false;
 let agendaDay = today();
 let agendaMode = 'day';
 let agendaLoading = false;
 let agendaError = false;
 let agendaMembers = [];
 let state;
 let request = 0;
 let editor;
 let lastFocus;
 let sending = false;
 let alert = '';
 let editorAlert = '';
 let editorError = false;
 let loadError = false;
 let historyTimer;
 const activityDialog=$('client-activity-dialog');
 const agendaDialog=$('agenda-editor-dialog');
 const editorPanel=$('operations-editor');
 const editorParent=editorPanel.parentElement;
 const afterEditor=editorPanel.nextElementSibling;
 let onClientActivitySaved;
 let conflictTimer;
 let conflictRequest=0;
 const conflictNotice=$('appointment-conflicts');
 const agenda=initAgenda({
  root:$('agenda-content'),getActor,onDate:changeAgenda,
  onMode(mode) { agendaMode=mode; renderAgenda(); },
  onAppointment(item) { setEditor('appointment',item); },
  onSchedule(day,time,assignee) { setEditor('appointment',{time,assignee},day); },
  onRetry:refresh
 });

 $('operations-local').hidden = !['127.0.0.1','localhost','::1'].includes(location.hostname);
 $('activity-end').value = today();
 $('activity-start').value = shiftDay(today(),-6);

 function status(message, error = false) {
  alert = message;
  loadError = error;
  $('operations-status').textContent = t(message);
  $('operations-status').dataset.error = String(error);
  $('operations-retry').hidden = !error;
 }

 function editorStatus(message, error = false) {
  editorAlert = message;
  editorError = error;
  $('operations-editor-status').textContent = t(message);
  $('operations-editor-status').dataset.error = String(error);
 }

 function range() {
  if (page === 'hoje') return {start:shiftDay(today(),-6),end:today()};
  if (page === 'atendimentos') return {start:$('activity-start').value,end:$('activity-end').value};
  return weekOf(agendaDay);
 }

 function appointmentButton(item, css, day) {
  const time = day && dayOf(item.starts_at)<day ? '00:00' : clockOf(item.starts_at);
  const summary = [item.title, projectContact(item)].filter(Boolean).join(' · ');
  const button = action(css,'appointmentId',item.id,'');
  button.dataset.status = item.status;
  button.setAttribute('aria-label', [time, summary, t(statusNames[item.status]),item.assignee_name].filter(Boolean).join(' · '));
  const meta = getActor() ? item.assignee_name || teamText('Sem responsável') :
   t(apptKinds[item.kind]) + ' · ' + item.duration_minutes + ' min';
  button.append(
   node('time','appointment-time',time),
   node('strong','appointment-title',summary),
   node('span','appointment-meta',meta +
    (item.status !== 'scheduled' ? ' · ' + t(statusNames[item.status]) : ''))
  );
  return button;
 }

 function renderTimeline(root, day, dayItems) {
  const items = dayItems.filter(item => item.status !== 'cancelled');
  if (!items.length) {
   root.replaceChildren(empty('Nenhum compromisso neste dia.'),action('quiet','scheduleDay',day,t('Agendar compromisso')));
   return;
  }
  const jobs = items.map(item=>{
   const localMinute=minuteOf(clockOf(item.starts_at));
   const startsEarlier=dayOf(item.starts_at)<day;
   return {item,start:startsEarlier ? 0 : localMinute,
    end:Math.min((startsEarlier ? localMinute - 1440 : localMinute) + Number(item.duration_minutes),1440)};
  }).sort((a,b)=>a.start-b.start || a.end-b.end);
  const firstHour = Math.floor(Math.min(540,jobs[0].start)/60)*60;
  const lastHour = Math.ceil(Math.max(960,...jobs.map(job=>job.end))/60)*60;
  const timeline = node('div','operations-timeline');
  const ticks = node('div','operations-clock');
  ticks.setAttribute('aria-hidden','true');
  const track = node('div','operations-track');
  const duration = lastHour - firstHour;
  timeline.style.setProperty('--hours', duration / 60);
  for (let minute=firstHour; minute<=lastHour; minute+=30) {
   const tick = node('span','operations-tick',clockLabel(minute));
   tick.style.setProperty('--tick',((minute-firstHour) / duration * 100) + '%');
   ticks.append(tick);
  }
  let activeEnd = 0;
  let group = [];
  let lanes = [];
  function renderGroup() {
   for (const job of group) {
    const button = appointmentButton(job.item,'appointment-chip',day);
    if (job.end-job.start>=45) button.dataset.long='';
    button.style.setProperty('--start',(job.start-firstHour) / duration * 100 + '%');
    button.style.setProperty('--length',(job.end-job.start) / duration * 100 + '%');
    button.style.setProperty('--lane',job.lane);
    button.style.setProperty('--lanes',lanes.length);
    track.append(button);
   }
  }
  for (const job of jobs) {
   if (job.start >= activeEnd) {
    renderGroup();
    group=[];
    lanes=[];
   }
   let lane = lanes.findIndex(end=>end<=job.start);
   if (lane===-1) lane=lanes.length;
   lanes[lane]=job.end;
   activeEnd=Math.max(activeEnd,job.end);
   group.push({...job,lane});
  }
  renderGroup();
  timeline.append(ticks,track);
  const list = node('div','operations-timeline-mobile');
  for (const {item} of jobs) list.append(appointmentButton(item,'appointment-chip',day));
  root.replaceChildren(timeline,list);
 }

 function renderAgenda() {
  const {start,end}=weekOf(agendaDay);
  const current=state?.start===start && state?.end===end;
  agenda.render({day:agendaDay,mode:agendaMode,appointments:current ? state.appointments : [],
   members:agendaMembers,loading:agendaLoading,error:agendaError});
 }

 function renderPending() {
  const currentDay = today();
  const filters = $('operations-pending-filter').value;
  const workable = state.contacts.filter(item=>!['perdido','ganho'].includes(item.stage));
  const dateOrder = (a,b) => a.due_on.localeCompare(b.due_on);
  const overdue = workable.filter(item=>item.due_on && item.due_on<currentDay).sort(dateOrder);
  const due = workable.filter(item=>item.due_on===currentDay);
  const cutoff = shiftDay(currentDay,-30);
  const latestContact = item => item.last_contact_at ?? item.client_created_at ?? item.created_at;
  const inactiveByClient=new Map();
  for (const item of state.contacts) {
   const last=latestContact(item);
   const key=item.client_reference ?? item.reference;
   if (item.stage==='perdido' || !last || dayOf(last)>cutoff) continue;
   const existing=inactiveByClient.get(key);
   if (!existing || (existing.stage==='ganho' && item.stage!=='ganho')) inactiveByClient.set(key,item);
  }
  const inactive=[...inactiveByClient.values()].sort((a,b)=>new Date(latestContact(a))-new Date(latestContact(b)));
  const buckets = [
   {id:'late',title:'Atrasado',list:overdue},
   {id:'due',title:'Hoje',list:due},
   {id:'inactive',title:'Sem contato há 30 dias',list:inactive}
  ];
  const rows = node('div','operations-pending-list');
  for (const bucket of buckets) {
   if (filters!=='all' && filters!==bucket.id || !bucket.list.length) continue;
   if (filters==='all') {
    const first = bucket.list[0];
    const direct = bucket.id!=='inactive' && bucket.list.length===1;
    const button = action('operations-pending-row',direct?'pendingReference':'pendingGroup',direct?first.reference:bucket.id,'');
    button.dataset.priority=bucket.id;
    const countLabel=bucket.id==='inactive' ? ['contato','contatos'] : ['retorno','retornos'];
    const count = String(bucket.list.length) + ' ' + t(countLabel[Number(bucket.list.length!==1)]);
    button.append(node('span','operations-dot'),node('strong','',t(bucket.title)),
     node('span','operations-ellipsis',direct?(first.next_step || projectContact(first)):count),
     icon('chevron'));
    rows.append(button);
   } else {
    for (const item of bucket.list) {
     const button = action('operations-pending-row','pendingReference',item.reference,'');
     button.dataset.priority=bucket.id;
     button.append(node('span','operations-dot'),node('strong','operations-ellipsis',bucket.id==='inactive'?contactName(item):projectContact(item)),
      node('span','operations-ellipsis',bucket.id==='inactive' ?
       dateShort(dayOf(latestContact(item))) : item.next_step || t(bucket.title)),icon('chevron'));
     rows.append(button);
    }
   }
  }
  $('today-pending').replaceChildren(rows.children.length ? rows : empty('Nenhuma pendência nesta lista.'));
 }

 function renderPipeline() {
  const root = $('today-opportunities');
  if (!state.contacts.length) {
   root.replaceChildren(empty('As oportunidades aparecem quando você cadastra um contato.'));
   return;
  }
  const summary = node('dl','operations-counts');
  const strip = node('div','operations-stage-strip');
  strip.setAttribute('aria-hidden','true');
  const hasNegotiation=state.contacts.some(item=>item.stage==='negociacao');
  if (hasNegotiation) summary.style.setProperty('--operation-stages','5');
  for (const [stage,label] of Object.entries(stageNames)) {
   if (stage==='negociacao' && !hasNegotiation) continue;
   const count = state.contacts.filter(item=>item.stage===stage).length;
   const metric = node('div');
   metric.append(node('dt','',t(label)),node('dd','',String(count)));
   summary.append(metric);
   if (count) {
    const part = node('span','operations-stage-part');
    part.dataset.stage=stage;
    part.style.flexGrow=String(count);
    strip.append(part);
   }
  }
  const queue = state.contacts.filter(item=>!['ganho','perdido'].includes(item.stage)).slice(0,5);
  const columns = node('div','operations-opportunities-head');
  columns.append(node('span','',t('Cliente')),node('span','operations-owner',t('Responsável')),node('span','',t('Próximo passo')));
  const links = node('ul','operations-opportunities-list');
  for (const lead of queue) {
   const item = node('li');
   const button = action('operations-summary-row','openReference',lead.reference,'');
   button.append(node('strong','operations-ellipsis',projectContact(lead)),
    node('span','operations-owner',getActor() ? lead.owner_name || teamText('Sem responsável') : t('Operação local')),
    node('span','operations-ellipsis',lead.next_step || t(stageNames[lead.stage])),icon('chevron'));
   item.append(button);
   links.append(item);
  }
  root.replaceChildren(summary,strip,columns,links);
 }

 function renderActivities(root, items) {
  if (!items.length) {
   root.replaceChildren(empty('Nenhuma atividade encontrada neste período.'));
   return;
  }
  const list = node('ol','operations-activity-list');
  for (const item of items) {
   const row = node('li','operations-activity-row');
   const label = dateShort(dayOf(item.occurred_at)) + ' · ' + clockOf(item.occurred_at);
   const timestamp = node('time','operations-activity-time',label);
   timestamp.dateTime = item.occurred_at;
   const copy = node('div','operations-activity-copy');
   const heading = node('p','operations-activity-title',t(activityKinds[item.kind]) + ' · ' + t(activityOutcomes[item.outcome]));
   const customer = action('operations-inline-link','openReference',item.reference,projectContact(item));
   copy.append(heading,customer);
   if (item.actor_name) copy.append(node('p','operations-actor',teamText('Registrado por') + ' · ' + item.actor_name));
   if (item.notes) copy.append(node('p','operations-activity-notes',item.notes));
   row.append(timestamp,copy);
   list.append(row);
  }
  root.replaceChildren(list);
 }

 function renderHistory() {
  const people = $('activity-author');
  $('activity-author-field').hidden=getActor()?.role!=='admin';
  if (!$('activity-author-field').hidden) {
   options(people,[['',t('Toda a equipe')],...(state.members ?? []).map(person=>[person.id,person.name])],people.value);
  }
  const items=state.activities;
  $('activity-summary').textContent=items.length===1 ? t('1 registro') : items.length+' '+t('registros');
  const groups=node('div','activity-days');
  let date;
  let list;
  for (const item of items) {
   const day=dayOf(item.occurred_at);
   if (day!==date) {
    date=day;
    const group=node('section','activity-day');
    const heading=node('h3','activity-day-title',day===today() ? t('Hoje')+' · '+dateShort(day) : dateFull(day));
    list=node('ol','activity-day-list');
    group.append(heading,list);
    groups.append(group);
   }
   const row=node('li','activity-entry');
   const time=node('time','activity-entry-time',clockOf(item.occurred_at));
   time.dateTime=item.occurred_at;
   const glyph=node('span','activity-entry-icon');
   glyph.append(icon(activityIcons[item.kind] ?? 'history'));
   const copy=node('div','activity-entry-copy');
   const customer=action('activity-contact','openReference',item.reference,projectContact(item));
   customer.append(icon('chevron'));
   const meta=node('p','activity-entry-meta');
   meta.append(node('span','activity-entry-kind',t(activityKinds[item.kind])));
   const outcome=node('span','activity-outcome',t(activityOutcomes[item.outcome]));
   outcome.dataset.outcome=item.outcome;
   meta.append(outcome);
   if (item.actor_name) meta.append(node('span','activity-entry-author',item.actor_name));
   copy.append(customer,meta);
   if (item.notes) copy.append(node('p','activity-entry-notes',item.notes));
   row.append(time,glyph,copy);
   list.append(row);
  }
  const root=$('activity-content');
  if (items.length) root.replaceChildren(groups);
  else {
   const message=node('div','activity-empty');
   message.append(icon('history'),node('h3','',t('Nenhum registro encontrado')),
    node('p','',t('Tente outro período ou ajuste os filtros.')));
   root.replaceChildren(message);
  }
  if (state.history_limited) root.append(node('p','activity-limit',t('Exibindo os 75 registros mais recentes. Refine os filtros para encontrar registros anteriores.')));
  renderFollowups();
 }

 function renderFollowups() {
  const current=today();
  const upcoming=state.contacts.filter(contact=>contact.due_on && !['ganho','perdido'].includes(contact.stage))
   .sort((left,right)=>left.due_on.localeCompare(right.due_on));
  const root=$('activity-followup-list');
  if (!upcoming.length) {
   root.replaceChildren(node('p','activity-followup-empty',t('Nenhum retorno programado. Você pode agendar o próximo ao registrar uma atividade.')));
   return;
  }
  const list=node('ul','activity-followup-list');
  const remaining=node('ul','activity-followup-list');
  for (const [index,contact] of upcoming.entries()) {
   const row=node('li','activity-followup');
   const late=contact.due_on<current;
   const time=node('time','activity-followup-date',
    late ? t('Atrasado')+' · '+dateShort(contact.due_on) : contact.due_on===current ? t('Hoje') : dateFull(contact.due_on));
   time.dateTime=contact.due_on;
   time.dataset.late=String(late);
   const button=action('activity-followup-action','pendingReference',contact.reference,t('Registrar retorno'));
   button.setAttribute('aria-label',[t('Registrar retorno'),projectContact(contact),contact.next_step].filter(Boolean).join(' · '));
   button.append(icon('chevron'));
   row.append(time,node('strong','',contactName(contact)));
   if (contact.project_name) row.append(node('p','activity-followup-project',contact.project_name));
   if (contact.next_step) row.append(node('p','',contact.next_step));
   row.append(button);
   (index<5 ? list : remaining).append(row);
  }
  root.replaceChildren(list);
  if (upcoming.length>5) {
   const details=node('details','activity-followup-more');
   details.append(node('summary','',t('Ver mais retornos')),remaining);
   root.append(details);
  }
 }

 function paint() {
  $('operations-title').textContent=t(headings[page]);
  $('operations-date').textContent=page==='atendimentos'?t('Acompanhe as conversas e organize os próximos retornos.'):dateFull(page==='agenda'?agendaDay:today());
  $('operations').dataset.page=page;
  $('schedule-appointment').classList.toggle('primary',page==='agenda');
  $('schedule-appointment').classList.toggle('quiet',page!=='agenda');
  $('register-activity').classList.toggle('primary',page!=='agenda');
  $('register-activity').classList.toggle('quiet',page==='agenda');
  for (const [id,layer] of Object.entries(pages)) layer.hidden=id!==page;
  const label=$('operations-pending-filter').options[0];
  const labelText = getActor()?.role==='admin' ? 'Atendimentos da equipe' : 'Meus atendimentos';
  label.textContent=teamText(labelText);
  if (page==='agenda') renderAgenda();
  if (!state) return;
  if (page==='hoje') {
   renderTimeline($('today-agenda'),today(),state.appointments.filter(item=>overlapsDay(item,today())));
   renderPending();
   renderPipeline();
   const {start,end}=range();
   renderActivities($('today-activities'),state.activities.filter(item=>{
    const day=dayOf(item.occurred_at);
    return day>=start && day<=end;
   }).slice(0,4));
  }
  if (page==='atendimentos') renderHistory();
 }

 async function refresh() {
  if (!active) return;
  const query = range();
  if (!query.start || !query.end || query.start>query.end || dateFromDay(query.end)-dateFromDay(query.start)>41*86400000) {
   ++request;
   $('operations-retry').hidden=true;
   $('operations').removeAttribute('aria-busy');
   $('activity-content').replaceChildren();
   $('activity-summary').textContent='';
   status('Escolha um período de até 42 dias.');
   return;
  }
  const serial = ++request;
  $('operations').setAttribute('aria-busy','true');
  if (page==='agenda') {
   agendaLoading=true;
   agendaError=false;
   status('');
   renderAgenda();
  } else status('Carregando…');
  try {
   if (page==='atendimentos') {
    query.history='1';
    query.search=$('activity-search').value;
    query.kind=$('activity-filter').value;
    if (getActor()?.role==='admin') query.author=$('activity-author').value;
   }
   const result = await api('operations&' + new URLSearchParams(query));
   if (serial!==request) return;
   state=result;
   if (page==='agenda') agendaMembers=result.members ?? [];
   agendaLoading=false;
   paint();
   if (editor?.form) {
    fillContacts(fields.reference.value);
    fillAssignees(fields.assignee_id.disabled ? undefined : fields.assignee_id.value);
    checkAgendaTime();
   }
   status('');
  } catch (error) {
   if (serial===request) {
    if (page==='agenda') {
     agendaLoading=false;
     agendaError=true;
     renderAgenda();
     return;
    }
    if (page==='atendimentos') {
     $('activity-content').replaceChildren();
     $('activity-summary').textContent='';
    }
    status(error.message,true);
   }
  } finally {
   if (serial===request) $('operations').removeAttribute('aria-busy');
  }
 }

 function fillContacts(selected=fields.reference.value) {
  const query = searchable($('operations-contact-search').value.trim());
  const all = state?.contacts ?? [];
  const existing = all.find(item=>item.reference===selected) ??
   (editor?.item?.reference===selected ? editor.item : undefined);
  const filtered = all.filter(item=>matches(item,query));
  if (existing && !filtered.includes(existing)) filtered.unshift(existing);
  options(fields.reference,[['',t(filtered.length?'Selecione um contato':'Nenhum contato disponível')],
   ...filtered.map(item=>[item.reference,[item.name,item.company,item.project_name].filter(Boolean).join(' · ')])],selected);
 }

 function fillKinds(selected=fields.kind.value) {
  const kinds = editor?.type==='activity'?activityKinds:apptKinds;
  options(fields.kind,Object.entries(kinds).map(([key,label])=>[key,t(label)]),selected);
  if (editor?.type==='activity') fillOutcomes();
 }

 function fillAssignees(selected = editor?.item ? editor.item.assignee_id : editor?.assignee===undefined ? getActor()?.id : editor.assignee) {
  const actor = getActor();
  const members = state?.members;
  const canAssign = editor?.type==='appointment' && actor?.role==='admin';
  $('operations-assignee-field').hidden = !canAssign || !members;
  fields.assignee_id.disabled = !canAssign || !members;
  const info = $('operations-actor');
  info.hidden = !actor || (canAssign && Boolean(members));
  info.textContent = !actor ? '' : editor?.type==='activity' ?
   teamText('Registrado por') + ' · ' + actor.name : teamText('Responsável') + ' · ' +
   (editor?.item ? editor.item.assignee_name || teamText('Sem responsável') : actor.name);
  if (fields.assignee_id.disabled) return;
  options(fields.assignee_id,[['',teamText('Sem responsável')],...members
   .filter(member=>member.active || member.id===selected)
   .map(member=>[member.id,member.name + (member.active ? '' : ' · ' + teamText('Inativa'))])],selected || '');
 }

 function fillOutcomes(selected=fields.outcome.value) {
  options(fields.outcome,allowedOutcomes[fields.kind.value].map(key=>[key,t(activityOutcomes[key])]),selected);
 }

 function loadFollowup(lead) {
  editor.followupEditable=Boolean(lead && !['ganho','perdido'].includes(lead.stage));
  $('operations-next-step').hidden=!editor.followupEditable;
  editor.nextStep=lead?.next_step ?? '';
  editor.dueOn=lead?.due_on ?? '';
  fields.next_step.value=editor.nextStep;
  fields.due_on.value=editor.dueOn;
  fields.clear_followup.checked=false;
 }

 function renderAppointmentRecord(item) {
  const record=$('operations-appointment-record');
  const detail=node('dl','operations-record');
  const fields=[[t('Contato'),projectContact(item)],[t('Situação'),t(statusNames[item.status])],
   [t('Responsável'),getActor() ? item.assignee_name || teamText('Sem responsável') : ''],
   [t('Duração (min)'),String(item.duration_minutes)],[t('Anotações'),item.notes]];
  for (const [key,value] of fields) {
   if (!value) continue;
   const row=node('div');
   row.append(node('dt','',key),node('dd','',value));
   detail.append(row);
  }
  record.replaceChildren(node('h3','',item.title),detail);
 }

 function checkAgendaTime() {
  clearTimeout(conflictTimer);
  const serial=++conflictRequest;
  conflictNotice.hidden=true;
  conflictNotice.replaceChildren();
  if (!active || editor?.type!=='appointment' || !editor.form ||
      !fields.date.validity.valid || !fields.time.validity.valid) return;
  const owner=fields.assignee_id.disabled ? getActor()?.id : fields.assignee_id.value;
  const duration=Number(fields.duration_minutes.value);
  const scheduledAt=localToIso(fields.date.value,fields.time.value);
  if (!owner || !scheduledAt || !Number.isInteger(duration) || duration<5 || duration>480) return;
  const starts=Date.parse(scheduledAt);
  const ends=starts+duration*60000;
  const start=dayOf(starts);
  const end=clampDay(dayOf(ends-1));
  const editing=editor;
  const cached=state?.start<=start && state?.end>=end;
  function show(matches) {
   const overlaps=matches.filter(item=>{
    const other=Date.parse(item.starts_at);
    return item.id!==editing.id && item.status==='scheduled' && item.assignee_id===owner &&
     starts<other+item.duration_minutes*60000 && other<ends;
   });
   if (!overlaps.length) return;
   const list=node('ul');
   for (const item of overlaps) {
    const contact=projectContact(item);
    const label=[dateForSchedule(item),item.title,contact!==item.title && contact].filter(Boolean).join(' · ');
    list.append(node('li','',label));
   }
   conflictNotice.append(node('strong','',t('Sobreposição de horários.')),
    node('p','',t('Esta pessoa já tem compromissos nesse intervalo.')),list);
   conflictNotice.hidden=false;
  }
  if (cached) {
   show(state.appointments);
   return;
  }
  conflictTimer=setTimeout(async ()=>{
   try {
    const result=await api('operations&'+new URLSearchParams({start,end}));
    if (serial===conflictRequest) show(result.appointments);
   } catch {
    if (serial!==conflictRequest) return;
    conflictNotice.append(node('p','',t('Não foi possível conferir sobreposições.')));
    conflictNotice.hidden=false;
   }
  },180);
 }

 function setEditor(type, selection, day) {
  if (sending || agendaDialog.open) return;
  lastFocus=document.activeElement;
  const item = type==='appointment' && selection?.id ? selection : null;
  const assignee=selection?.assignee;
  editor={type,id:item?.id ?? crypto.randomUUID(), revision:item?.revision, form: !item || item.status==='scheduled', item,assignee};
  const isActivity=type==='activity';
  const existing=state?.contacts?.find(lead=>lead.reference===selection?.reference);
  form.reset();
  if (active && page==='agenda' && !activityDialog.open) {
   agendaDialog.append(editorPanel);
   agendaDialog.showModal();
  }
  $('operations-editor').hidden=false;
  $('operations-editor-summary').textContent=item ? dateForSchedule(item) : '';
  $('operations-appointment-record').hidden=editor.form;
  form.hidden=!editor.form;
  $('operations-editor-title').textContent=t(isActivity?'Registrar atividade':item?'Compromisso':'Agendar compromisso');
  if (!editor.form) renderAppointmentRecord(item);
  if (editor.form) {
   fillContacts(selection?.reference);
   fillAssignees(assignee);
   fillKinds(item?.kind || selection?.kind || (isActivity?'call':'meeting'));
   const time=item?.starts_at || Date.now();
   fields.date.value=item?dayOf(time):day || (isActivity?today():page==='agenda'?agendaDay:today());
   fields.time.value=item || isActivity ? clockOf(time) : selection?.time || '09:00';
   fields.title.value=item?.title ?? '';
   fields.notes.value=item?.notes ?? '';
   fields.duration_minutes.value=item?.duration_minutes ?? 30;
   if (isActivity) loadFollowup(existing);
   $('operations-title-field').hidden=isActivity;
   $('operations-duration-field').hidden=isActivity;
   fields.title.required=!isActivity;
   fields.duration_minutes.required=!isActivity;
   $('operations-outcome-field').hidden=!isActivity;
   fields.outcome.required=isActivity;
   if (!isActivity) $('operations-next-step').hidden=true;
   $('operations-save').textContent=t(isActivity?'Salvar atividade':item?'Salvar alterações':'Salvar compromisso');
   for (const button of outcomeButtons) {
    button.hidden=!item;
    if (button.dataset.appointmentStatus==='cancelled') button.textContent=t('Cancelar compromisso');
   }
   editor.buttonText=isActivity?'Salvar atividade':item?'Salvar alterações':'Salvar compromisso';
   editor.heading=isActivity?'Registrar atividade':item?'Compromisso':'Agendar compromisso';
  }
  editor.heading=isActivity?'Registrar atividade':item?'Compromisso':'Agendar compromisso';
  editorStatus('');
  checkAgendaTime();
  $('operations-editor-title').focus();
  $('operations-editor').scrollIntoView({block:'nearest'});
 }

 function closeEditor(restore=true) {
  const clientModal=activityDialog.open;
  const modal=clientModal ? activityDialog : agendaDialog.open ? agendaDialog : null;
  editorPanel.hidden=true;
  editor=null;
  form.reset();
  checkAgendaTime();
  $('operations-appointment-record').replaceChildren();
  if (modal) {
   onClientActivitySaved=undefined;
   modal.close();
   editorParent.insertBefore(editorPanel,afterEditor);
   if (clientModal) state=undefined;
   return;
  }
  if (restore) {
   if (lastFocus?.isConnected) lastFocus.focus();
   else $('operations-title').focus();
  }
 }

 async function saveAppointmentStatus(statusValue) {
  if (!editor || sending) return;
  const appointment = state?.appointments.find(item=>item.id===editor.id);
  if (!appointment) return;
  if (statusValue==='cancelled' && editor.confirmCancel!==true) {
   editor.confirmCancel=true;
   outcomeButtons.find(button=>button.dataset.appointmentStatus==='cancelled').textContent=t('Confirmar cancelamento');
   editorStatus('Confirme para retirar este compromisso da agenda.');
   return;
  }
  return send('appointment','PATCH',{id:editor.id,revision:editor.revision,status:statusValue,notes:fields.notes.value},
   statusValue==='completed'?'Compromisso concluído.':statusValue==='cancelled'?'Compromisso cancelado.':'Ausência registrada.');
 }

 async function send(resource, method, data, confirmation) {
  if (sending) return;
  sending=true;
  const savedEditor=editor;
  const controls = [...form.querySelectorAll('button')];
  controls.forEach(button=>{button.disabled=true;});
  $('operations-close').disabled=true;
  editorStatus('Salvando…');
  try {
   await api(resource,method,data);
   if (editor!==savedEditor) return;
   const onSaved=onClientActivitySaved;
   closeEditor();
   if (onSaved) {
    await onSaved();
    return;
   }
   if (savedEditor.type==='appointment' && data.starts_at) {
    const day=dayOf(data.starts_at);
    if (page==='agenda') agendaDay=day;
    else if (day!==today() && page==='hoje') {
     agendaDay=day;
     await navigate('agenda');
     if (!loadError && !agendaError) status(confirmation);
     return;
    }
   }
   await refresh();
   if (page==='hoje') {
    performance.refresh();
    if (availableExperiments()) experiments.refresh();
   }
   if (!loadError && !(page==='agenda' && agendaError)) status(confirmation);
  } catch (error) {
   editorStatus(error.message,true);
  } finally {
   sending=false;
   controls.forEach(button=>{button.disabled=false;});
   $('operations-close').disabled=false;
  }
 }

 form.addEventListener('submit',event=>{
  event.preventDefault();
  if (!editor || sending) return;
  const data=Object.fromEntries(new FormData(form));
  const timestamp=localToIso(data.date,data.time);
  if (!timestamp) return editorStatus('Confira o dia e o horário de São Paulo.',true);
  if (editor.type==='appointment') {
   return send('appointment',editor.revision?'PATCH':'POST',{id:editor.id,revision:editor.revision,reference:data.reference,
    title:data.title,kind:data.kind,starts_at:timestamp,duration_minutes:Number(data.duration_minutes),notes:data.notes,
    ...(data.assignee_id===undefined || (editor.item && (data.assignee_id || null)===editor.item.assignee_id) ? {} :
     {assignee_id:data.assignee_id || null})},
    editor.revision?'Compromisso atualizado.':'Compromisso agendado.');
  }
  const next = {};
  if (editor.followupEditable) {
   if (data.clear_followup==='on') Object.assign(next,{next_step:'',due_on:null});
   else {
    if (data.next_step.trim()!==editor.nextStep) next.next_step=data.next_step;
    if (data.due_on!==editor.dueOn) next.due_on=data.due_on || null;
   }
  }
  return send('activity','POST',{id:editor.id,reference:data.reference,kind:data.kind,outcome:data.outcome,
   occurred_at:timestamp,notes:data.notes,...next},'Atividade registrada.');
 });

 fields.kind.addEventListener('change',()=>{
  if (editor?.type==='activity') fillOutcomes();
 });
 for (const field of [fields.date,fields.time,fields.duration_minutes,fields.assignee_id]) {
  field.addEventListener('input',checkAgendaTime);
 }
 fields.reference.addEventListener('change',()=>{
  if (editor?.type!=='activity') return;
  const lead=state?.contacts.find(item=>item.reference===fields.reference.value);
  loadFollowup(lead);
 });
 $('operations-contact-search').addEventListener('input',()=>fillContacts());
 $('register-activity').addEventListener('click',()=>setEditor('activity'));
 $('schedule-appointment').addEventListener('click',()=>setEditor('appointment',
  page==='agenda' ? {assignee:agenda.assignee()} : undefined));
 $('operations-close').addEventListener('click',()=>closeEditor());
 for (const button of outcomeButtons) button.addEventListener('click',()=>saveAppointmentStatus(button.dataset.appointmentStatus));
 $('operations-retry').addEventListener('click',refresh);
 $('today-pending').addEventListener('click',event=>{
  const group=event.target.closest('[data-pending-group]')?.dataset.pendingGroup;
  if (group) {
   $('operations-pending-filter').value=group;
   renderPending();
   $('operations-pending-filter').focus();
  }
 });
 $('operations-pending-filter').addEventListener('change',renderPending);
 $('operations').addEventListener('click',event=>{
  const button=event.target.closest('button');
  if (!button || button.closest('#agenda-content')) return;
  const {appointmentId,pendingReference,openReference,scheduleDay}=button.dataset;
  if (appointmentId) {
   const item=state?.appointments.find(row=>row.id===appointmentId);
   if (item) setEditor('appointment',item);
  }
  if (pendingReference) setEditor('activity',{reference:pendingReference});
  if (openReference) openContact(openReference);
  if (scheduleDay) setEditor('appointment',null,scheduleDay);
 });
 function changeAgenda(day,mode) {
  agendaDay=clampDay(day);
  if (mode) agendaMode=mode;
  $('operations-date').textContent=dateFull(agendaDay);
  const {start,end}=weekOf(agendaDay);
  if (state?.start===start && state?.end===end && !agendaError && !agendaLoading) paint();
  else refresh();
 }
 function refreshHistory() {
  clearTimeout(historyTimer);
  const count=Number(Boolean($('activity-filter').value))+Number(Boolean($('activity-author').value))+
   Number($('activity-period').value!=='7');
  $('activity-filter-count').textContent=count;
  $('activity-filter-count').hidden=count===0;
  if (active && page==='atendimentos') return refresh();
 }
 $('activity-toggle').addEventListener('click',event=>{
  const button=event.currentTarget;
  button.setAttribute('aria-expanded',String(button.getAttribute('aria-expanded')==='false'));
 });
 $('activity-period').addEventListener('change',event=>{
  const custom=event.target.value==='custom';
  $('activity-dates').hidden=!custom;
  if (custom) {
   $('activity-start').focus();
   refreshHistory();
   return;
  }
  const end=today();
  $('activity-end').value=end;
  $('activity-start').value=shiftDay(end,1-Number(event.target.value));
  refreshHistory();
 });
 for (const id of ['activity-start','activity-end','activity-filter','activity-author']) $(id).addEventListener('change',refreshHistory);
 $('activity-search').addEventListener('input',()=>{
  clearTimeout(historyTimer);
  historyTimer=setTimeout(refreshHistory,180);
 });
 $('activity-jump').addEventListener('click',()=>$('activity-followups-title').focus());
 const paintActivityOptions = () => options($('activity-filter'),[['',t('Todos os tipos')],...Object.entries(activityKinds).map(([key,label])=>[key,t(label)])],$('activity-filter').value);
 paintActivityOptions();

 for (const dialog of [activityDialog,agendaDialog]) {
  dialog.addEventListener('cancel',event=>{
   event.preventDefault();
   if (!sending) closeEditor();
  });
 }
 document.addEventListener('caos-language-change',()=>{
  if (!active && !activityDialog.open) return;
  paintActivityOptions();
  paint();
  status(alert,loadError);
  if (editor) {
   $('operations-editor-title').textContent=t(editor.heading);
   $('operations-editor-summary').textContent=editor.item ? dateForSchedule(editor.item) : '';
   if (editor.form) {
    $('operations-save').textContent=t(editor.buttonText);
    fillKinds();
    fillContacts();
    fillAssignees(fields.assignee_id.disabled ? undefined : fields.assignee_id.value);
   } else renderAppointmentRecord(editor.item);
   editorStatus(editorAlert,editorError);
   checkAgendaTime();
  }
 });

 return {
  show(next) {
   clearTimeout(historyTimer);
   active=true;
   page=next;
   closeEditor(false);
   $('operations').hidden=false;
   $('operations-today').insertBefore($('today-performance'),$('today-experiments'));
   for (const id of ['today-agenda','today-pending','today-opportunities','today-activities','activity-content']) $(id).replaceChildren();
   state=undefined;
   agendaError=false;
   agendaLoading=next==='agenda';
   $('activity-summary').textContent='';
   $('activity-followup-list').replaceChildren();
   $('activity-author-field').hidden=getActor()?.role!=='admin';
   paint();
   if (next==='hoje') {
    $('today-experiments').hidden=!availableExperiments();
    performance.refresh();
    if (availableExperiments()) experiments.refresh();
   }
   return refresh();
  },
  hide() {
   clearTimeout(historyTimer);
   active=false;
   request++;
   state=undefined;
   closeEditor(false);
   $('operations').hidden=true;
   $('operations-today').insertBefore($('today-performance'),$('today-experiments'));
   $('activity-search').value='';
   $('activity-author').value='';
   performance.reset();
   experiments.reset();
  },
  resetAgenda() {
   agendaDay=today();
   agendaMode='day';
   agendaMembers=[];
   agenda.reset();
  },
  openClientActivity(item,onSaved) {
   if (sending || activityDialog.open) return;
   state={contacts:[item]};
   onClientActivitySaved=onSaved;
   activityDialog.append(editorPanel);
   activityDialog.showModal();
   setEditor('activity',{reference:item.reference});
  },
  selectHistory(reference) {
   $('activity-search').value=reference;
  }
 };
}
