import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const origin = 'https://www.caosdomado.com.br';
const campaign = 'qa-journey-monitor';
const source = 'verificacao';
const monitorEmail = 'monitor@caosdomado.invalid';
const secret = process.env.JOURNEY_MONITOR_SECRET;
const drill = process.env.MONITOR_DRILL === '1';

async function start(page, path) {
  const url = new URL(path, origin);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_campaign', campaign);
  const response = await page.goto(url.href, {waitUntil: 'domcontentloaded'});
  assert.ok(response?.ok(), `Não abriu ${path} (HTTP ${response?.status() ?? 'sem resposta'})`);
  assert.equal(new URL(page.url()).origin, origin, 'Redirecionamento fora do site');
}

async function homeToDemo(page) {
  await start(page, '/');
  await page.locator('.hero-offer-demo[href="#trabalhos-catalogo"]').click();
  await page.waitForFunction(() => document.querySelector('#trabalhos-catalogo')?.getAttribute('aria-pressed') === 'true');
  await page.locator('#showcase-search').fill('café');
  await page.locator('button[data-project="cafe"]').click();
  await page.locator('#showcase-open').click();
  await page.waitForURL(url => url.origin === origin && url.pathname === '/exemplos/catalogos/cafe/');
  await page.getByRole('button', {name: /^Adicionar .* em grãos$/}).first().click();
  await page.locator('[data-items] li').first().waitFor();
  return 'A home abriu Pedra Clara pela galeria e a demonstração adicionou um café à cotação.';
}

async function guideToWhatsApp(page) {
  const path = '/guia/catalogo-para-orcamentos-no-whatsapp';
  if (drill) {
    await page.route(url => url.origin === origin && url.pathname === path, route =>
      route.fulfill({status: 503, body: 'Exercício do alerta · falha simulada apenas no navegador do monitor'}));
  }
  await start(page, path);
  const guideRef = await page.evaluate(() => window.portfolioCampaign?.attribution.reference);
  assert.match(guideRef ?? '', /^CD-[A-Z0-9]{12}$/, 'Guia sem referência de visita');
  await page.locator('.guide-commercial a').click();
  await page.waitForURL(url => url.origin === origin && url.pathname === '/catalogo-online');
  const whatsapp = page.locator('.catalog-button[href^="https://wa.me/"]').first();
  await page.context().route('https://wa.me/**', route => route.fulfill({status: 200, body: 'Destino verificado.'}));
  const [attempt] = await Promise.all([
    page.context().waitForEvent('request', {predicate: request => new URL(request.url()).host === 'wa.me' && request.isNavigationRequest(), timeout: 15000}),
    whatsapp.click()
  ]);
  const target = new URL(attempt.url());
  assert.equal(target.pathname, '/5519974149650', 'Número de WhatsApp inesperado');
  const message = target.searchParams.get('text') || '';
  assert.ok(message.includes(guideRef) && message.includes(campaign), 'Referência da visita ou campanha perdida no WhatsApp');
  return 'O guia abriu a oferta e o botão direcionou ao WhatsApp comercial com a referência original.';
}

async function formToCRM(page) {
  assert.ok(secret, 'Credencial do monitor ausente');
  await start(page, '/contato.html');
  const isIntake = url => url.origin === origin && url.pathname === '/api/crm' && url.searchParams.get('action') === 'intake';
  let reference;
  await page.route(isIntake, async route => {
    const request = route.request();
    const payload = request.postDataJSON();
    if (request.method() !== 'POST' || payload.email !== monitorEmail || payload.campaign !== campaign ||
        payload.origin !== source || !/^CD-[A-Z0-9]{12}$/.test(payload.reference)) {
      return route.fulfill({status: 400, body: 'Marcadores de monitoramento ausentes'});
    }
    reference = payload.reference;
    try {
      const response = await route.fetch({
        headers: {...request.headers(), 'x-journey-monitor': secret},
        maxRedirects: 0,
        timeout: 12000
      });
      await route.fulfill({response});
    } catch {
      await route.abort('failed').catch(() => {});
    }
  });
  const form = page.locator('#briefing-form');
  await form.locator('[name="name"]').fill('Monitor da Caos Domado');
  await form.locator('[name="email"]').fill(monitorEmail);
  await form.locator('[name="message"]').fill('Verificação automática do recebimento do formulário no CRM.');
  await form.locator('[name="accepted"]').check();
  const [response] = await Promise.all([
    page.waitForResponse(r => isIntake(new URL(r.url())) && r.request().method() === 'POST'),
    form.locator('button[type="submit"]').click()
  ]);
  assert.equal(response.status(), 201, `CRM respondeu HTTP ${response.status()}`);
  const receipt = await response.json();
  assert.equal(receipt.reference, reference, 'Referência devolvida pelo CRM divergente');
  assert.ok(receipt.monitor?.crmReadback === true && receipt.monitor?.rolledBack === true,
    'CRM não confirmou a leitura do registro e a reversão da transação de teste');
  await page.locator('#form-status[data-state="success"]').waitFor();
  assert.ok((await page.locator('#form-status a').getAttribute('href'))?.includes(reference), 'Confirmação do formulário sem a referência recebida');
  return 'O formulário exibiu sucesso e o CRM confirmou o registro de teste na transação revertida.';
}

const journeys = [
  ['Home → galeria → demo', homeToDemo],
  ['Guia → oferta → WhatsApp', guideToWhatsApp],
  ['Formulário → CRM', formToCRM]
];
const results = [];
let browser;
try {
  browser = await chromium.launch();
  for (const [name, check] of journeys) {
    let context;
    try {
      context = await browser.newContext({locale: 'pt-BR', viewport: {width: 390, height: 844}, serviceWorkers: 'block'});
      await context.route('**/_vercel/insights/**', route => route.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      page.setDefaultNavigationTimeout(30000);
      results.push({name, ok: true, detail: await check(page)});
    } catch (error) {
      const detail = error.message.split('\n').slice(0, 2).join(' ').slice(0, 450);
      results.push({name, ok: false, detail});
    } finally {
      await context?.close().catch(() => {});
    }
  }
} catch {
  for (const [name] of journeys.slice(results.length)) {
    results.push({name, ok: false, detail: 'Não foi possível iniciar o navegador de monitoramento.'});
  }
} finally {
  await browser?.close().catch(() => {});
  await writeFile('journey-results.json', JSON.stringify(results, null, 2) + '\n');
}
for (const result of results) console.log(`${result.ok ? 'OK' : 'FALHA'} · ${result.name} · ${result.detail}`);
if (results.some(result => !result.ok)) process.exitCode = 1;
