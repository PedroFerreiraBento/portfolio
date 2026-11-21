const translations = {
 'Dia':'Day', 'Semana':'Week', 'Hoje':'Today', 'Período anterior':'Previous period',
 'Próximo período':'Next period', 'Dia da agenda':'Calendar date', 'Visualização':'Calendar view',
 'Buscar compromisso':'Find an appointment', 'Filtros':'Filters',
 'Título, cliente ou responsável':'Title, client, or assignee', 'Responsável':'Assignee',
 'Toda a equipe':'Entire team', 'Sem responsável':'Unassigned', 'Situação':'Status',
 'Todas as situações':'All statuses', 'Agendado':'Scheduled', 'Em andamento':'In progress',
 'Precisa de resultado':'Needs an outcome', 'Concluído':'Completed', 'Ausência':'No-show',
 'Cancelado':'Cancelled', 'Reunião':'Meeting', 'Ligação':'Call', 'Revisão':'Review',
 'Manhã':'Morning', 'Tarde':'Afternoon', 'Noite':'Evening', 'Agendar neste dia':'Schedule on this day',
 'Agenda da semana':'Week schedule', 'compromisso':'appointment',
 'compromissos':'appointments', 'Próximo compromisso':'Next appointment', 'Horários sobrepostos':'Overlapping appointments',
 'Compromissos simultâneos para a mesma pessoa.':'Simultaneous appointments for the same person.',
 'Resumo do período':'Period summary', 'Concluídos':'Completed',
 'Agendados':'Scheduled', 'Cancelados':'Cancelled', 'Ausências':'No-shows',
 'Sem compromissos futuros neste período.':'No upcoming appointments in this period.',
 'Nenhum compromisso corresponde aos filtros.':'No appointments match your filters.',
 'Nenhum compromisso nesta semana.':'No appointments this week.',
 'Nenhum compromisso neste dia.':'No appointments on this day.', 'Limpar filtros':'Clear filters',
 'Sem compromissos':'No appointments', 'Carregando agenda…':'Loading calendar…',
 'Não foi possível carregar a agenda.':'The calendar could not be loaded.', 'Tentar novamente':'Try again',
 'Datas da semana':'Dates this week', 'Continuação':'Continued', 'Fuso horário de Brasília':'Brasília time',
 'Horário sobreposto':'Overlapping time',
};

const zone = 'America/Sao_Paulo';
const civil = new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});
const clock = new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const time = value => clock.format(value);
const dayOf = value => civil.format(value);
const noon = day => new Date(day+'T12:00:00Z');
const shift = (day, offset) => {
 const date = noon(day);
 date.setUTCDate(date.getUTCDate()+offset);
 return date.toISOString().slice(0,10);
};
const weekOf = day => {
 const start=shift(day,-((noon(day).getUTCDay()+6)%7));
 return Array.from({length:7},(_,index)=>shift(start,index));
};
const kinds = {meeting:'Reunião',call:'Ligação',review:'Revisão'};
const statuses = {scheduled:'Agendado',in_progress:'Em andamento',needs_outcome:'Precisa de resultado',completed:'Concluído',no_show:'Ausência',cancelled:'Cancelado'};
const folded = value => String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const locale = () => document.documentElement.lang.startsWith('en') ? 'en-GB' : 'pt-BR';
const t = value => locale()==='en-GB' ? translations[value] ?? value : value;
const capital = value => value.charAt(0).toUpperCase()+value.slice(1);
const weekday = day => capital(new Intl.DateTimeFormat(locale(),{timeZone:'UTC',weekday:'short'}).format(noon(day)).replace(/\.$/,''));
const fullDate = day => capital(new Intl.DateTimeFormat(locale(),{timeZone:'UTC',weekday:'long',day:'numeric',month:'long'}).format(noon(day)));
const formats = {
 week: () => new Intl.DateTimeFormat(locale(),{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}),
 short: () => new Intl.DateTimeFormat(locale(),{timeZone:'UTC',day:'numeric',month:'short'}),
};

function element(tag, className, text) {
 const node=document.createElement(tag);
 if (className) node.className=className;
 if (text!==undefined) node.textContent=text;
 return node;
}

function icon(name) {
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 const use=document.createElementNS('http://www.w3.org/2000/svg','use');
 svg.setAttribute('aria-hidden','true');
 use.setAttribute('href','#op-'+name);
 svg.append(use);
 return svg;
}

function button(text, className, activate) {
 const control=element('button',className,text);
 control.type='button';
 control.addEventListener('click',activate);
 return control;
}

function bounds(row) {
 const start=Date.parse(row.starts_at);
 return {start,end:start+Number(row.duration_minutes)*60000};
}

function scheduleState(record, now) {
 if (record.row.status!=='scheduled') return record.row.status;
 if (record.end<=now) return 'needs_outcome';
 return record.start<=now?'in_progress':'scheduled';
}

function overlapSet(records) {
 const byAssignee=new Map();
 for (const record of records) {
  const id=record.row.assignee_id;
  if (!id||record.row.status!=='scheduled') continue;
  if (!byAssignee.has(id)) byAssignee.set(id,[]);
  byAssignee.get(id).push(record);
 }
 const overlaps=new Set();
 for (const items of byAssignee.values()) {
  for (const [index,record] of items.entries()) {
   for (let next=index+1;next<items.length&&items[next].start<record.end;next++) {
    overlaps.add(record.row.id);
    overlaps.add(items[next].row.id);
   }
  }
 }
 return overlaps;
}

export function initAgenda({root,getActor,onDate,onMode,onAppointment,onSchedule,onRetry}) {
 root.classList.add('crm-agenda');
 root.innerHTML='<div class="agenda-toolbar"><div class="agenda-navigation">'+
  '<button type="button" class="quiet agenda-period-arrow" id="agenda-ui-previous"></button>'+
  '<button type="button" class="quiet" id="agenda-ui-today" data-agenda-copy="Hoje"></button>'+
  '<button type="button" class="quiet agenda-period-arrow" id="agenda-ui-next"></button>'+
  '<div class="agenda-week-range" id="agenda-ui-range"></div></div>'+
  '<div class="agenda-view-controls"><input id="agenda-ui-date" type="date" min="2000-01-01" max="2100-12-31">'+
  '<div class="agenda-view-switch" id="agenda-ui-modes" role="group">'+
  '<button type="button" data-view="day" data-agenda-copy="Dia"></button>'+
  '<button type="button" data-view="week" data-agenda-copy="Semana"></button></div></div></div>'+
  '<section class="agenda-date-board"><div id="agenda-ui-days" class="agenda-date-strip" role="group"></div></section>'+
  '<button type="button" class="quiet agenda-filters-toggle" id="agenda-ui-filters-toggle" aria-expanded="false" aria-controls="agenda-ui-filters"></button>'+
  '<div class="agenda-filters" id="agenda-ui-filters">'+
  '<label class="agenda-query"><span data-agenda-copy="Buscar compromisso"></span><input id="agenda-ui-search" type="search"></label>'+
  '<label id="agenda-ui-owner-field"><span data-agenda-copy="Responsável"></span><select id="agenda-ui-owner"></select></label>'+
  '<label><span data-agenda-copy="Situação"></span><select id="agenda-ui-status"></select></label></div>'+
  '<div id="agenda-ui-body"></div>';

 const $=id=>root.querySelector('#agenda-ui-'+id);
 const search=$('search');
 const owner=$('owner');
 const status=$('status');
 const body=$('body');
 const date=$('date');
 const strip=$('days');
 const modes=$('modes');
 const prev=$('previous');
 const next=$('next');
 const filterToggle=$('filters-toggle');
 const filterCopy=element('span');
 let current;
 let activeOwner='';
 let activeStatus='';
 let query='';
 let lastRenderedDay;
 let filtersOpen=false;

 prev.append(icon('chevron'));
 next.append(icon('chevron'));
 filterToggle.append(icon('funnel'),filterCopy,icon('chevron'));
 filterToggle.addEventListener('click',()=>{
  filtersOpen=!filtersOpen;
  paint();
 });
 root.querySelector('.agenda-query').insertBefore(icon('search'),search);
 function assignPrevNext(offset) {
  if (current) onDate(shift(current.day,offset*(current.mode==='week'?7:1)));
 }
 prev.addEventListener('click',()=>assignPrevNext(-1));
 next.addEventListener('click',()=>assignPrevNext(1));
 $('today').addEventListener('click',()=>onDate(dayOf(Date.now())));
 date.addEventListener('change',()=>{if (date.value&&date.checkValidity()) onDate(date.value);});
 modes.addEventListener('click',event=>{
  const mode=event.target.closest('[data-view]')?.dataset.view;
  if (mode&&mode!==current?.mode) onMode(mode);
 });
 search.addEventListener('input',()=>{
  query=folded(search.value.trim());
  paint();
 });
 owner.addEventListener('change',()=>{
  activeOwner=owner.value;
  paint();
 });
 status.addEventListener('change',()=>{
  activeStatus=status.value;
  paint();
 });

 function clearFilters() {
  search.value='';
  query=activeOwner=activeStatus='';
  paint();
  search.focus();
 }

 function schedule(day) {
  onSchedule(day,undefined,assignee());
 }

 const assignee=()=>activeOwner==='unassigned'?null:activeOwner||undefined;

 function optionList(select, entries, selected) {
  select.replaceChildren(...entries.map(([value,label])=>new Option(label,value)));
  if (entries.some(([value])=>value===selected)) select.value=selected;
 }

 function labelControls(admin, members) {
  for (const item of root.querySelectorAll('[data-agenda-copy]')) item.textContent=t(item.dataset.agendaCopy);
  prev.setAttribute('aria-label',t('Período anterior'));
  next.setAttribute('aria-label',t('Próximo período'));
  date.setAttribute('aria-label',t('Dia da agenda'));
  search.placeholder=t('Título, cliente ou responsável');
  modes.setAttribute('aria-label',t('Visualização'));
  strip.setAttribute('aria-label',t('Datas da semana'));
  $('owner-field').hidden=!admin;
  const available=[['',t('Toda a equipe')],['unassigned',t('Sem responsável')],...members.map(row=>[row.id,row.name])];
  if (!admin||!available.some(([id])=>id===activeOwner)) activeOwner='';
  optionList(owner,available,activeOwner);
  optionList(status,[['',t('Todas as situações')],...Object.entries(statuses).map(([key,label])=>[key,t(label)])],activeStatus);
  const count=[activeOwner,activeStatus,query].filter(Boolean).length;
  filterCopy.textContent=t('Filtros')+(count?' ('+count+')':'');
  filterToggle.setAttribute('aria-expanded',String(filtersOpen));
 }

 function recordOn(record, day) {
  return record.startDay<=day&&record.endDay>=day;
 }

 function recordCount(count) {
  return count+' '+t(count===1?'compromisso':'compromissos');
 }

 function paintDays(days, day, today, records, loading, error) {
  const focused=document.activeElement?.dataset.agendaDate;
  strip.replaceChildren(...days.map(value=>{
   const dayRecords=records.filter(item=>recordOn(item,value));
   const item=button(undefined,'agenda-date-cell',()=>onDate(value,'day'));
   item.dataset.agendaDate=value;
   item.disabled=value<'2000-01-01'||value>'2100-12-31';
   item.setAttribute('aria-label',fullDate(value)+(loading||error?'':' · '+recordCount(dayRecords.length)));
   item.setAttribute('aria-pressed',String(day===value));
   if (value===today) item.setAttribute('aria-current','date');
   const dayText=element('span','agenda-date-weekday',weekday(value));
   const numeral=element('time','agenda-date-number',String(noon(value).getUTCDate()));
   numeral.dateTime=value;
   item.append(dayText,numeral);
   if (value===today) item.append(element('span','agenda-date-today',t('Hoje')));
   if (!loading&&!error&&dayRecords.length) item.append(element('span','agenda-date-count',String(dayRecords.length)));
   return item;
  }));
  if (focused) (strip.querySelector('[data-agenda-date="'+focused+'"]')||
   strip.querySelector('[data-agenda-date="'+day+'"]'))?.focus({preventScroll:true});
 }

 function chip(record, day, admin) {
  const {row,end,start,startDay,state,conflict}=record;
  const contact=row.company||row.name;
  const person=row.assignee_name||t('Sem responsável');
  const control=button(undefined,'agenda-booking',()=>onAppointment(row));
  control.dataset.appointmentId=row.id;
  control.dataset.state=state;
  const interval=element('span','agenda-booking-interval');
  const startAt=element('time',null,startDay<day?'00:00':time(start));
  startAt.dateTime=row.starts_at;
  const endAt=element('time',null,time(end));
  endAt.dateTime=new Date(end).toISOString();
  interval.append(startAt,document.createTextNode('–'),endAt);

  const content=element('span','agenda-booking-main');
  const title=element('strong','agenda-booking-name',row.title||t(kinds[row.kind]||'Reunião'));
  const kind=t(kinds[row.kind]);
  const metadata=element('span','agenda-booking-meta',[contact,row.project_name,folded(row.title)===folded(kind)?'':kind,
   startDay<day?t('Continuação'):'',admin?person:''].filter(Boolean).join(' · '));
  content.append(title);
  if (metadata.textContent) content.append(metadata);
  if (conflict) content.append(element('span','agenda-booking-conflict',t('Horário sobreposto')));
  const label=element('span','agenda-booking-state',t(statuses[state]));
  control.append(interval,content,label,icon('chevron'));
  return control;
 }

 function agendaList(records, day, admin) {
  const list=element('ol','agenda-bookings');
  for (const record of records) {
   const row=element('li');
   row.append(chip(record,day,admin));
   list.append(row);
  }
  return list;
 }

 function emptyState(label, cta, run) {
  const panel=element('div','agenda-empty');
  panel.append(icon('calendar'),element('p',null,t(label)));
  if (cta) panel.append(button(t(cta),'quiet',run));
  return panel;
 }

 function nextUp(records, now, day, admin) {
  const nextRecord=records.find(record=>record.row.status==='scheduled'&&record.start>=now);
  const sidebar=element('aside','agenda-aside');
  const upcoming=element('section','agenda-aside-next');
  const heading=element('h3',null,t('Próximo compromisso'));
  heading.prepend(icon('calendar'));
  upcoming.append(heading);
  if (nextRecord) {
   const row=nextRecord.row;
   const when=(nextRecord.startDay!==day?formats.short().format(noon(nextRecord.startDay))+' · ':'')+time(nextRecord.start);
   const link=button(undefined,'agenda-up-next',()=>onAppointment(row));
   link.append(element('span','agenda-up-time',when),element('strong',null,row.title||t(kinds[row.kind]||'Reunião')),
    element('span','agenda-up-meta',[row.company||row.name,row.project_name,admin?row.assignee_name:''].filter(Boolean).join(' · ')),icon('chevron'));
   upcoming.append(link);
  } else {
   upcoming.append(element('p','agenda-up-empty',t('Sem compromissos futuros neste período.')));
  }
  const totals=element('section','agenda-summary');
  totals.append(element('h3',null,t('Resumo do período')));
  const list=element('dl','agenda-summary-list');
  const counts=[
   ['Agendados',records.filter(entry=>entry.state==='scheduled').length],
   ['Concluídos',records.filter(entry=>entry.state==='completed').length],
  ];
  const optional=[
   ['Em andamento',records.filter(entry=>entry.state==='in_progress').length],
   ['Precisa de resultado',records.filter(entry=>entry.state==='needs_outcome').length],
   ['Ausências',records.filter(entry=>entry.state==='no_show').length],
   ['Cancelados',records.filter(entry=>entry.state==='cancelled').length],
  ];
  counts.push(...optional.filter(([,count])=>count>0));
  for (const [label,count] of counts) {
   const row=element('div');
   row.append(element('dt',null,t(label)),element('dd',null,String(count)));
   list.append(row);
  }
  totals.append(list);
  const clashCount=records.filter(entry=>entry.conflict).length;
  if (clashCount) {
   const note=element('div','agenda-aside-warning');
   note.append(element('strong',null,t('Horários sobrepostos')+' · '+clashCount),
    element('p',null,t('Compromissos simultâneos para a mesma pessoa.')));
   totals.append(note);
  }
  sidebar.append(upcoming,totals);
  return sidebar;
 }

 function renderDay(records, day, now, admin, filtered) {
  const section=element('section','agenda-day');
  const left=element('div','agenda-day-main');
  const heading=element('div','agenda-list-heading');
  const labels=element('div');
  labels.append(element('h2',null,fullDate(day)),element('p',null,recordCount(records.length)));
  heading.append(labels,button(t('Agendar neste dia'),'quiet',()=>schedule(day)));
  left.append(heading);
  if (!records.length) {
   left.append(emptyState(filtered?'Nenhum compromisso corresponde aos filtros.':'Nenhum compromisso neste dia.',
    filtered?'Limpar filtros':null,clearFilters));
  }
  const groups={'Manhã':[],'Tarde':[],'Noite':[]};
  for (const record of records) {
   const hour=record.startDay<day ? 0 : Number(time(record.start).slice(0,2));
   groups[hour<12?'Manhã':hour<18?'Tarde':'Noite'].push(record);
  }
  for (const [label,items] of Object.entries(groups)) {
   if (!items.length) continue;
   const period=element('section','agenda-day-period');
   period.append(element('h3',null,t(label)),agendaList(items,day,admin));
   left.append(period);
  }
  section.append(left,nextUp(records,now,day,admin));
  body.replaceChildren(section);
 }

 function renderWeek(records, days, day, admin, filtered) {
  const panel=element('section','agenda-week');
  const heading=element('div','agenda-list-heading');
  const titles=element('div');
  titles.append(element('h2',null,t('Agenda da semana')),element('p',null,recordCount(records.length)));
  heading.append(titles);
  panel.append(heading);
  if (!records.length) {
   panel.append(emptyState(filtered?'Nenhum compromisso corresponde aos filtros.':'Nenhum compromisso nesta semana.',
    filtered?'Limpar filtros':'Agendar neste dia',filtered?clearFilters:()=>schedule(day)));
   body.replaceChildren(panel);
   return;
  }
  const grid=element('div','agenda-week-grid');
  const today=dayOf(Date.now());
  for (const date of days) {
   const list=records.filter(record=>recordOn(record,date));
   const column=element('section','agenda-week-day');
   column.dataset.date=date;
   column.dataset.empty=String(!list.length);
   if (date===today) column.dataset.today='true';
   const title=element('h3');
   const select=button(weekday(date)+' · '+String(noon(date).getUTCDate()),'agenda-week-date',()=>onDate(date,'day'));
   select.setAttribute('aria-label',fullDate(date));
   title.append(select);
   column.append(title);
   if (list.length) column.append(agendaList(list,date,admin));
   else column.append(element('p','agenda-week-empty',t('Sem compromissos')));
   grid.append(column);
  }
  panel.append(grid);
  body.replaceChildren(panel);
 }

 function paint() {
  if (!current) return;
  const {day,mode,appointments=[],members=[],loading=false,error=false}=current;
  const now=Date.now();
  const today=dayOf(now);
  const days=weekOf(day);
  const admin=getActor()?.role==='admin';
  labelControls(admin,members);
  if (lastRenderedDay!==day) {
   date.value=day;
   lastRenderedDay=day;
  }
  prev.disabled=day<shift('2000-01-01',mode==='week'?7:1);
  next.disabled=day>shift('2100-12-31',mode==='week'?-7:-1);
  for (const control of modes.querySelectorAll('[data-view]')) control.setAttribute('aria-pressed',String(control.dataset.view===mode));
  $('range').textContent=formats.week().formatRange(noon(days[0]),noon(days[6]));
  $('range').title=t('Fuso horário de Brasília');
  const records=appointments.map(row=>({row,...bounds(row)}))
   .filter(record=>Number.isFinite(record.start)&&record.end>record.start)
   .sort((a,b)=>a.start-b.start);
  const conflicts=overlapSet(records);
  for (const record of records) {
   record.startDay=dayOf(record.start);
   record.endDay=dayOf(record.end-1);
   record.state=scheduleState(record,now);
   record.conflict=conflicts.has(record.row.id);
  }
  const matching=records.filter(({row,state})=>
   (!activeOwner||(row.assignee_id||'unassigned')===activeOwner)&&(!activeStatus||state===activeStatus)&&
   (!query||[row.title,row.company,row.name,row.project_name,row.assignee_name,row.reference].some(value=>folded(value).includes(query))));
  paintDays(days,day,today,matching,loading,error);
  if (loading||error) {
   body.setAttribute('aria-busy',String(loading));
   body.replaceChildren(error ? emptyState('Não foi possível carregar a agenda.','Tentar novamente',onRetry)
    : element('p','agenda-loading',t('Carregando agenda…')));
   return;
  }
  body.removeAttribute('aria-busy');
  const filtered=Boolean(activeOwner||activeStatus||query);
  if (mode==='week') renderWeek(matching,days,day,admin,filtered);
  else renderDay(matching.filter(item=>recordOn(item,day)),day,now,admin,filtered);
 }

 document.addEventListener('caos-language-change',paint);
 return {
  assignee,
  render(state) {
   current=state;
   paint();
  },
  reset() {
   current=undefined;
   search.value='';
   activeOwner=activeStatus=query='';
   filtersOpen=false;
   lastRenderedDay=undefined;
   strip.replaceChildren();
   body.replaceChildren();
  },
 };
}
