import { initTodayPerformance } from './today-performance.js';
import { initTodayExperiments } from './today-experiments.js';

const t = text => window.caosTranslate?.(text) ?? text;
const $ = id => document.getElementById(id);
const zone = 'America/Sao_Paulo';
const dayFormat = new Intl.DateTimeFormat('sv-SE', {timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit'});
const clockFormat = new Intl.DateTimeFormat('en-GB', {timeZone: zone, hour:'2-digit', minute:'2-digit', hourCycle:'h23'});
const dayOf = value => dayFormat.format(new Date(value));
const clockOf = value => clockFormat.format(new Date(value));
const today = () => dayOf(Date.now());
const dateFromDay = value => new Date(value + 'T12:00:00Z');
const dayString = value => value.toISOString().slice(0,10);
const shiftDay = (value, delta) => {
 const date = dateFromDay(value);
 date.setUTCDate(date.getUTCDate() + delta);
 return dayString(date);
};
const locale = () => document.documentElement.lang === 'en' ? 'en-GB' : 'pt-BR';
const dateLabel = (value, options) => new Intl.DateTimeFormat(locale(), {timeZone:'UTC', ...options}).format(dateFromDay(value));
const titleCase = value => value.charAt(0).toUpperCase() + value.slice(1);
const dateFull = value => titleCase(dateLabel(value, {weekday:'long', month:'long', day:'numeric'}));
const dateShort = value => dateLabel(value, {month:'short', day:'numeric'});
const contactName = item => item.company || item.name;
const searchable = value => String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const matches = (item, query) => searchable([item.name, item.company, item.reference].join(' ')).includes(query);
const minuteOf = value => {
 const [hours, minutes] = value.split(':').map(Number);
 return hours * 60 + minutes;
};
const clockLabel = minutes => String(Math.floor(minutes / 60)).padStart(2,'0') + ':' + String(minutes % 60).padStart(2,'0');
const apptKinds = {meeting:'Reunião', call:'Ligação', review:'Revisão'};
const activityKinds = {call:'Ligação', whatsapp:'WhatsApp', email:'E-mail', meeting:'Reunião', note:'Anotação'};
const activityOutcomes = {connected:'Contato realizado', no_answer:'Sem resposta', sent:'Enviado', completed:'Realizada', no_show:'Não compareceu', recorded:'Registrada'};
const allowedOutcomes = {call:['connected','no_answer'], whatsapp:['sent','connected'], email:['sent','connected'], meeting:['completed','no_show'], note:['recorded']};
const statusNames = {scheduled:'Agendado', completed:'Concluído', cancelled:'Cancelado', no_show:'Ausência'};
const stageNames = {novo:'Novo', conversa:'Em conversa', proposta:'Proposta', ganho:'Fechado'};

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

export function initOperations(api, navigate, openContact) {
 const performance = initTodayPerformance(api);
 const experiments = initTodayExperiments(api);
 const form = $('operations-form');
 const fields = form.elements;
 const pages = {hoje:$('operations-today'),agenda:$('operations-agenda'),atendimentos:$('operations-activities')};
 const headings = {hoje:'Hoje',agenda:'Agenda',atendimentos:'Atendimentos'};
 const outcomeButtons = [...form.querySelectorAll('[data-appointment-status]')];
 const modes = [...document.querySelectorAll('[data-agenda-mode]')];
 let page = 'hoje';
 let active = false;
 let agendaDay = today();
 let agendaMode = 'day';
 let state;
 let request = 0;
 let editor;
 let lastFocus;
 let sending = false;
 let alert = '';
 let editorAlert = '';
 let editorError = false;
 let loadError = false;

 $('operations-local').hidden = !['127.0.0.1','localhost','::1'].includes(location.hostname);
 $('activity-end').value = today();
 $('activity-start').value = shiftDay(today(),-6);
 $('agenda-date').value = agendaDay;

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
  if (agendaMode === 'day') return {start:agendaDay,end:agendaDay};
  const monday = shiftDay(agendaDay,-((dateFromDay(agendaDay).getUTCDay()+6)%7));
  return {start:monday,end:shiftDay(monday,6)};
 }

 function appointmentButton(item, css, day) {
  const time = day && dayOf(item.starts_at)<day ? '00:00' : clockOf(item.starts_at);
  const summary = [item.title, contactName(item)].filter(Boolean).join(' · ');
  const button = action(css,'appointmentId',item.id,'');
  button.dataset.status = item.status;
  button.setAttribute('aria-label', [time, summary, t(statusNames[item.status])].join(' · '));
  const meta = t(apptKinds[item.kind]) + ' · ' + item.duration_minutes + ' min';
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
  $('agenda-date').value = agendaDay;
  for (const button of modes) button.setAttribute('aria-pressed',String(button.dataset.agendaMode===agendaMode));
  const root = $('agenda-content');
  const {start,end} = range();
  if (agendaMode==='day') {
   renderTimeline(root,agendaDay,state.appointments.filter(item=>overlapsDay(item,agendaDay)));
   const cancelled = state.appointments.filter(item=>overlapsDay(item,agendaDay) && item.status==='cancelled');
   if (cancelled.length) {
    const records = node('details','operations-cancelled');
    records.append(node('summary','',t('Compromissos cancelados') + ' (' + cancelled.length + ')'));
    records.append(...cancelled.map(item=>appointmentButton(item,'appointment-chip')));
    root.append(records);
   }
   return;
  }
  const week = node('div','operations-week');
  for (let day=start; day<=end; day=shiftDay(day,1)) {
   const section = node('section','operations-week-day');
   const header = action('operations-week-date','calendarDay',day,dateLabel(day,{weekday:'short',day:'numeric'}));
   if (day===today()) header.dataset.today='';
   section.append(header);
   for (const item of state.appointments.filter(item=>overlapsDay(item,day) && item.status!=='cancelled')) {
    section.append(appointmentButton(item,'appointment-chip',day));
   }
   if (section.children.length===1) section.append(node('p','operations-empty','—'));
   week.append(section);
  }
  root.replaceChildren(week);
 }

 function renderPending() {
  const currentDay = today();
  const filters = $('operations-pending-filter').value;
  const workable = state.contacts.filter(item=>!['perdido','ganho'].includes(item.stage));
  const dateOrder = (a,b) => a.due_on.localeCompare(b.due_on);
  const overdue = workable.filter(item=>item.due_on && item.due_on<currentDay).sort(dateOrder);
  const due = workable.filter(item=>item.due_on===currentDay);
  const cutoff = shiftDay(currentDay,-30);
  const inactive = state.contacts.filter(item=>{
   const last = item.last_contact_at ?? item.created_at;
   return item.stage!=='perdido' && last && dayOf(last)<=cutoff;
  }).sort((a,b)=>new Date(a.last_contact_at ?? a.created_at)-new Date(b.last_contact_at ?? b.created_at));
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
    const count = String(bucket.list.length) + ' ' + t(bucket.list.length===1?'contato':'contatos');
    button.append(node('span','operations-dot'),node('strong','',t(bucket.title)),
     node('span','operations-ellipsis',direct?(first.next_step || contactName(first)):count),
     icon('chevron'));
    rows.append(button);
   } else {
    for (const item of bucket.list) {
     const button = action('operations-pending-row','pendingReference',item.reference,'');
     button.dataset.priority=bucket.id;
     button.append(node('span','operations-dot'),node('strong','operations-ellipsis',contactName(item)),
      node('span','operations-ellipsis',bucket.id==='inactive' ?
       dateShort(dayOf(item.last_contact_at ?? item.created_at)) : item.next_step || t(bucket.title)),icon('chevron'));
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
  for (const [stage,label] of Object.entries(stageNames)) {
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
   button.append(node('strong','operations-ellipsis',contactName(lead)),
    node('span','operations-owner',t('Operação local')),
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
   const customer = action('operations-inline-link','openReference',item.reference,contactName(item));
   copy.append(heading,customer);
   if (item.notes) copy.append(node('p','operations-activity-notes',item.notes));
   row.append(timestamp,copy);
   list.append(row);
  }
  root.replaceChildren(list);
 }

 function renderHistory() {
  const query = searchable($('activity-search').value.trim());
  const kind = $('activity-filter').value;
  const {start,end} = range();
  renderActivities($('activity-content'),state.activities.filter(item=>{
   const day=dayOf(item.occurred_at);
   return day>=start && day<=end && (!kind || kind===item.kind) && matches(item,query);
  }));
 }

 function paint() {
  $('operations-title').textContent=t(headings[page]);
  $('operations-date').textContent=page==='atendimentos'?'':dateFull(page==='agenda'?agendaDay:today());
  for (const [id,layer] of Object.entries(pages)) layer.hidden=id!==page;
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
  if (page==='agenda') renderAgenda();
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
   status('Escolha um período de até 42 dias.');
   return;
  }
  const serial = ++request;
  $('operations').setAttribute('aria-busy','true');
  status('Carregando…');
  try {
   const result = await api('operations&' + new URLSearchParams(query));
   if (serial!==request) return;
   state=result;
   paint();
   if (editor?.form) fillContacts(fields.reference.value);
   status('');
  } catch (error) {
   if (serial===request) status(error.message,true);
  } finally {
   if (serial===request) $('operations').removeAttribute('aria-busy');
  }
 }

 function fillContacts(selected=fields.reference.value) {
  const query = searchable($('operations-contact-search').value.trim());
  const all = state?.contacts ?? [];
  const existing = all.find(item=>item.reference===selected);
  const filtered = all.filter(item=>matches(item,query));
  if (existing && !filtered.includes(existing)) filtered.unshift(existing);
  options(fields.reference,[['',t(filtered.length?'Selecione um contato':'Nenhum contato disponível')],
   ...filtered.map(item=>[item.reference,item.company ? item.name + ' · ' + item.company : item.name])],selected);
 }

 function fillKinds(selected=fields.kind.value) {
  const kinds = editor?.type==='activity'?activityKinds:apptKinds;
  options(fields.kind,Object.entries(kinds).map(([key,label])=>[key,t(label)]),selected);
  if (editor?.type==='activity') fillOutcomes();
 }

 function fillOutcomes(selected=fields.outcome.value) {
  options(fields.outcome,allowedOutcomes[fields.kind.value].map(key=>[key,t(activityOutcomes[key])]),selected);
 }

 function loadFollowup(lead) {
  editor.nextStep=lead?.next_step ?? '';
  editor.dueOn=lead?.due_on ?? '';
  fields.next_step.value=editor.nextStep;
  fields.due_on.value=editor.dueOn;
  fields.clear_followup.checked=false;
 }

 function renderAppointmentRecord(item) {
  const record=$('operations-appointment-record');
  const detail=node('dl','operations-record');
  const fields=[[t('Contato'),contactName(item)],[t('Situação'),t(statusNames[item.status])],
   [t('Duração (min)'),String(item.duration_minutes)],[t('Anotações'),item.notes]];
  for (const [key,value] of fields) {
   if (!value) continue;
   const row=node('div');
   row.append(node('dt','',key),node('dd','',value));
   detail.append(row);
  }
  record.replaceChildren(node('h3','',item.title),detail);
 }

 function setEditor(type, selection, day) {
  if (sending) return;
  lastFocus=document.activeElement;
  const item = type==='appointment' && selection?.id ? selection : null;
  editor={type,id:item?.id ?? crypto.randomUUID(), revision:item?.revision, form: !item || item.status==='scheduled', item};
  const isActivity=type==='activity';
  const existing=state?.contacts?.find(lead=>lead.reference===selection?.reference);
  form.reset();
  $('operations-editor').hidden=false;
  $('operations-editor-summary').textContent=item ? dateForSchedule(item) : '';
  $('operations-appointment-record').hidden=editor.form;
  form.hidden=!editor.form;
  $('operations-editor-title').textContent=t(isActivity?'Registrar atividade':item?'Compromisso':'Agendar compromisso');
  if (!editor.form) renderAppointmentRecord(item);
  if (editor.form) {
   fillContacts(selection?.reference);
   fillKinds(item?.kind || selection?.kind || (isActivity?'call':'meeting'));
   const time=item?.starts_at || Date.now();
   fields.date.value=item?dayOf(time):day || (isActivity?today():page==='agenda'?agendaDay:today());
   fields.time.value=item || isActivity ? clockOf(time) : '09:00';
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
   $('operations-next-step').hidden=!isActivity;
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
  $('operations-editor-title').focus();
  $('operations-editor').scrollIntoView({block:'nearest'});
 }

 function closeEditor(restore=true) {
  $('operations-editor').hidden=true;
  editor=null;
  form.reset();
  $('operations-appointment-record').replaceChildren();
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
  const kind = editor.type;
  const controls = [...form.querySelectorAll('button')];
  controls.forEach(button=>{button.disabled=true;});
  $('operations-close').disabled=true;
  editorStatus('Salvando…');
  try {
   await api(resource,method,data);
   closeEditor();
   if (kind==='appointment' && data.starts_at) {
    const day=dayOf(data.starts_at);
    if (day!==today() && (page==='hoje' || page==='agenda')) {
     agendaDay=day;
     navigate('agenda');
    }
   }
   await refresh();
   if (page==='hoje') {
    performance.refresh();
    experiments.refresh();
   }
   if (!loadError) status(confirmation);
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
    title:data.title,kind:data.kind,starts_at:timestamp,duration_minutes:Number(data.duration_minutes),notes:data.notes},
    editor.revision?'Compromisso atualizado.':'Compromisso agendado.');
  }
  const next = {};
  if (data.clear_followup==='on') Object.assign(next,{next_step:'',due_on:null});
  else {
   if (data.next_step.trim()!==editor.nextStep) next.next_step=data.next_step;
   if (data.due_on!==editor.dueOn) next.due_on=data.due_on || null;
  }
  return send('activity','POST',{id:editor.id,reference:data.reference,kind:data.kind,outcome:data.outcome,
   occurred_at:timestamp,notes:data.notes,...next},'Atividade registrada.');
 });

 fields.kind.addEventListener('change',()=>{
  if (editor?.type==='activity') fillOutcomes();
 });
 fields.reference.addEventListener('change',()=>{
  if (editor?.type!=='activity') return;
  const lead=state?.contacts.find(item=>item.reference===fields.reference.value);
  loadFollowup(lead);
 });
 $('operations-contact-search').addEventListener('input',()=>fillContacts());
 $('register-activity').addEventListener('click',()=>setEditor('activity'));
 $('schedule-appointment').addEventListener('click',()=>setEditor('appointment'));
 $('operations-close').addEventListener('click',()=>closeEditor());
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
  if (!button) return;
  const {appointmentId,pendingReference,openReference,scheduleDay,calendarDay,appointmentStatus}=button.dataset;
  if (appointmentId) {
   const item=state?.appointments.find(row=>row.id===appointmentId);
   if (item) setEditor('appointment',item);
  }
  if (pendingReference) setEditor('activity',{reference:pendingReference});
  if (openReference) openContact(openReference);
  if (scheduleDay) setEditor('appointment',null,scheduleDay);
  if (calendarDay) {
   agendaDay=calendarDay;
   agendaMode='day';
   paint();
   refresh();
  }
  if (appointmentStatus) saveAppointmentStatus(appointmentStatus);
 });
 function changeAgenda(day) {
  agendaDay=day;
  paint();
  refresh();
 }
 $('agenda-date').addEventListener('change',event=>{
  if (event.target.value && event.target.checkValidity()) changeAgenda(event.target.value);
 });
 $('agenda-today').addEventListener('click',()=>changeAgenda(today()));
 $('agenda-previous').addEventListener('click',()=>changeAgenda(shiftDay(agendaDay,agendaMode==='week'?-7:-1)));
 $('agenda-next').addEventListener('click',()=>changeAgenda(shiftDay(agendaDay,agendaMode==='week'?7:1)));
 for (const button of modes) button.addEventListener('click',()=>{
  agendaMode=button.dataset.agendaMode;
  paint();
  refresh();
 });
 $('activity-start').addEventListener('change',refresh);
 $('activity-end').addEventListener('change',refresh);
 for (const id of ['activity-search','activity-filter']) $(id).addEventListener('input',()=>{if (state) renderHistory();});
 const paintActivityOptions = () => options($('activity-filter'),[['',t('Todos os tipos')],...Object.entries(activityKinds).map(([key,label])=>[key,t(label)])],$('activity-filter').value);
 paintActivityOptions();

 document.addEventListener('caos-language-change',()=>{
  if (!active) return;
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
   } else renderAppointmentRecord(editor.item);
   editorStatus(editorAlert,editorError);
  }
 });

 return {
  show(next) {
   active=true;
   page=next;
   closeEditor(false);
   $('operations').hidden=false;
   for (const id of ['today-agenda','today-pending','today-opportunities','today-activities','agenda-content','activity-content']) $(id).replaceChildren();
   state=undefined;
   paint();
   if (next==='hoje') {
    performance.refresh();
    experiments.refresh();
   }
   return refresh();
  },
  hide() {
   active=false;
   request++;
   state=undefined;
   closeEditor(false);
   $('operations').hidden=true;
   performance.reset();
   experiments.reset();
  },
  selectHistory(reference) {
   $('activity-search').value=reference;
  }
 };
}
