import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {once} from 'node:events';
import {createServer} from 'node:net';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import {setTimeout as wait} from 'node:timers/promises';
import {PGlite} from '../app/node_modules/@electric-sql/pglite/dist/index.js';

const today = new Intl.DateTimeFormat('sv-SE', {timeZone:'America/Sao_Paulo'}).format(new Date());
const tomorrow = new Date(Date.parse(today) + 86_400_000).toISOString().slice(0,10);
const campaign = 'qa-cat-funnel-test';
const source = {origin:'verificacao',campaign,medium:'social',creative:'demonstracao'};
const migration = 'crm-attribution-deposits.sql';
const readMigration = name => readFile(new URL('../docs/'+name,import.meta.url),'utf8');

test('migration preserves legacy deals and runtime isolation on repeated application', async t => {
  const db = await PGlite.create();
  t.after(() => db.close());
  await db.exec(await readMigration('crm-schema.sql'));
  await db.exec('CREATE ROLE crm_runtime; CREATE ROLE crm_preview_runtime');
  for (const file of ['crm-runtime-role.sql','crm-intake-followup.sql','crm-funnel.sql','crm-team.sql']) {
    await db.exec(await readMigration(file));
  }
  await db.exec(`
    INSERT INTO crm.opportunities (reference,name,email,company,message,origin,campaign,channel,stage,value_cents,won_at)
    VALUES ('CD-000000000011','Legacy','','','','direto','direto','whatsapp','ganho',169000,now());
    INSERT INTO crm.funnel_events (visit_id,kind,placement,origin,campaign)
    VALUES ('legacy-visit-986','demo','catalogo','direto','direto')
  `);
  for(let i=0;i<2;i++) await db.exec(await readMigration(migration));
  const {rows:[deal]} = await db.query('SELECT value_cents,deposit_status,deposit_cents,attributed_visit_id FROM crm.opportunities');
  assert.deepEqual(deal,{value_cents:169000,deposit_status:null,deposit_cents:null,attributed_visit_id:null});
  const {rows:[event]} = await db.query('SELECT contact_reference FROM crm.funnel_events');
  assert.equal(event.contact_reference,null);
  await db.exec('SET ROLE crm_preview_runtime');
  await assert.rejects(db.query('SELECT reference FROM crm.deposit_events'), {code:'42501'});
  await db.query('SELECT reference FROM crm_preview.deposit_events');
});

async function harness(t) {
  const socket = createServer();
  socket.listen(0,'127.0.0.1');
  await once(socket,'listening');
  const {port} = socket.address();
  await new Promise(resolve => socket.close(resolve));
  const run = spawn(process.execPath,['tools/crm-local.mjs'],{
    env:{...process.env,CRM_LOCAL_DATA_DIR:'memory://',CRM_LOCAL_PORT:String(port),
      CRM_LOCAL_ADMIN_EMAIL:'admin@qa.local',CRM_LOCAL_ADMIN_PASSWORD:'crm-local-test-only',
      CRM_PIPELINE_ENABLED:'1',CRM_LOCAL_NO_SEED:'0',CRM_QA_TRACKING_ENABLED:'1'},
    stdio:['ignore','ignore','pipe'],windowsHide:true
  });
  let errors='';
  run.stderr.setEncoding('utf8').on('data',data=>{errors+=data;});
  t.after(() => run.kill());
  const host = 'http://127.0.0.1:'+port;
  const limit = Date.now()+12_000;
  while(Date.now()<limit) {
    if(run.exitCode!==null) throw Error(errors);
    if(await fetch(host+'/crm',{signal:AbortSignal.timeout(400)}).then(r=>r.ok,()=>false)) break;
    await wait(100);
  }
  return function client() {
    let cookie='';
    return async (action,method='GET',payload,status=200)=>{
      const r=await fetch(host+'/api/crm?action='+action,{
        method,headers:{origin:host,cookie,'content-type':'application/json'},
        body:payload&&JSON.stringify(payload),signal:AbortSignal.timeout(4000)
      });
      const issued=r.headers.get('set-cookie');
      if(issued) cookie=issued.split(';')[0];
      const body=await r.json();
      assert.equal(r.status,status,action+' '+JSON.stringify(body)+' '+errors);
      return body;
    };
  };
}

test('public journey, manual conversation, proposal and deposit through the normal API',async t=>{
  const client = await harness(t);
  const api=client(), member=client(), publicApi=client();
  await api('login','POST',{email:'admin@qa.local',password:'crm-local-test-only'});
  await member('login','POST',{email:'marina@crm.local',password:'crm-local-marina'});
  const reference='CD-000000000021', visit=randomUUID();
  const track=(kind,ref=reference,id=visit,attrs=source)=>publicApi('track','POST',{
    kind,placement:'catalogo-'+kind,visit_id:id,contact_reference:ref,landing_path:'/guias',...attrs
  });
  for(const kind of ['entry','demo','whatsapp','whatsapp']) assert.equal((await track(kind)).tracked,true);
  await publicApi('track','POST',{kind:'entry',placement:'entry',visit_id:visit,contact_reference:'invalid',...source},400);
  for (let i=0;i<2;i++) await publicApi('track','POST',{...source,visit_id:visit,contact_reference:reference,kind:'offer',placement:'catalogo-online',landing_path:'/guias'});
  const pageReport=await api('funnel&qa=1&start='+today+'&end='+today);
  assert.equal(pageReport.pages.find(row=>row.page==='catalogo-online').visits,1);
  assert.equal(pageReport.pages.find(row=>row.kind==='entry' && row.page==='/guias').visits,1);
  const opts={name:'QA de catálogo',project_name:'Catálogo Online QA',channel:'whatsapp',origin:'manual',campaign:'manual'};
  const created=(await api('save','POST',{...opts,visit_reference:reference},201)).row;
  assert.equal(created.reference,reference);
  assert.equal(created.attributed_visit_id,visit);
  assert.equal(created.campaign,campaign);
  await api('save','POST',{...opts,visit_reference:reference},409);
  const path='pipeline-detail&reference='+reference;
  const detail=()=>api(path);
  let actual=await detail();
  assert.equal(actual.attribution.status,'linked');
  assert.deepEqual(actual.attribution.events.map(e=>e.kind),['entry','demo','whatsapp','offer']);
  assert.equal(actual.row.deposit_status,null);
  await member(path,'GET',undefined,404);
  const deposit=(payload,status)=>api('pipeline-deposit','PATCH',{reference,...payload},status);
  const pending={revision:1,status:'pending',value_cents:84500,received_on:null};
  await publicApi('pipeline-deposit','PATCH',{reference,...pending},401);
  await member('pipeline-deposit','PATCH',{reference,...pending},404);
  await deposit({...pending,value_cents:845.01},400);
  await deposit({...pending,value_cents:0},400);
  await deposit({...pending,status:'received'},400);
  await deposit({...pending,status:'received',received_on:'2026-02-31'},400);
  await deposit({...pending,status:'received',received_on:tomorrow},422);
  await deposit({...pending,received_on:today},400);

  const move=(row,stage,fields={})=>api('pipeline-stage','PATCH',{reference,revision:row.revision,stage,...fields});
  await api('activity','POST',{id:randomUUID(),reference,kind:'whatsapp',outcome:'connected',occurred_at:new Date().toISOString(),notes:'Simulação, sem mensagem'},201);
  const conversation=(await move(created,'conversa')).row;
  const proposal=(await move(conversation,'proposta',{value_cents:169000,proposal_on:today,due_on:today,next_step:'Retorno de QA'})).row;
  const report=async ()=>(await api('funnel&qa=1&start='+today+'&end='+today+'&breakdown=creative')).rows.find(row=>row.campaign===campaign);
  const first = await report();
  assert.deepEqual([first.entries,first.demos,first.whatsapp,first.contacts,first.proposals,first.deposits],[1,1,1,1,1,0]);
  const pendingData={...pending,revision:proposal.revision};
  const logged=(await deposit(pendingData)).deposit;
  assert.equal(logged.deposit_status,'pending');
  assert.equal(Number((await report()).deposit_cents),0);
  const received={revision:logged.revision,status:'received',value_cents:84500,received_on:today};
  const results=await Promise.all([deposit(received),deposit(received)]);
  assert.equal(results[0].revision,results[1].revision);
  assert.equal(results.filter(row=>row.deposit).length,1);
  await deposit({...received,value_cents:84600},409);
  actual=await detail();
  assert.equal(actual.row.stage,'proposta');
  assert.equal(actual.row.value_cents,169000);
  assert.equal(actual.row.deposit_received_on,today);
  assert.deepEqual(actual.depositEvents.map(event=>event.status),['received','pending']);
  const next=await report();
  assert.equal(next.wins,0);
  assert.equal(next.deposits,1);
  assert.equal(Number(next.deposit_cents),84500);
  assert.equal(Number(next.cents),0);
  const regular=(await api('funnel&start='+today+'&end='+today)).rows;
  assert.ok(!regular.some(row=>row.campaign===campaign));

  const older='CD-000000000022';
  await track('whatsapp',null,randomUUID());
  const manual=(await api('save','POST',{...opts,visit_reference:older},201)).row;
  assert.equal(manual.attributed_visit_id,null);
  assert.equal(manual.campaign,'manual');
  assert.equal((await api('pipeline-detail&reference='+older)).attribution.status,'unmatched');
  await track('whatsapp',older,randomUUID());
  const updated=(await api('save','PATCH',{...opts,reference:older,visit_reference:older,revision:manual.revision})).row;
  assert.ok(updated.attributed_visit_id);
  assert.equal(updated.campaign,campaign);
  await api('save','POST',{...opts,visit_reference:'CD-ALMOST'},400);

  const conflict='CD-000000000023';
  await Promise.all([track('whatsapp',conflict,randomUUID()),track('whatsapp',conflict,randomUUID())]);
  const unresolved=(await api('save','POST',{...opts,visit_reference:conflict},201)).row;
  assert.equal(unresolved.attributed_visit_id,null);
  await track('whatsapp',reference,randomUUID());
  assert.equal((await detail()).attribution.status,'conflict');
});
