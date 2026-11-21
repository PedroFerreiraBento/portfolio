(() => {
 const qs = new URLSearchParams(location.search);
 const keys = ['publico','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
 const incoming = Object.fromEntries(keys.flatMap(key => {
  const value = qs.get(key)?.replace(/[\r\n\t]/g, ' ').trim().slice(0,80);
  return value ? [[key,value]] : [];
 }));
 function load(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
 }
 function save(key,value) {
  try { sessionStorage.setItem(key,JSON.stringify(value)); } catch { /* The page still works without storage. */ }
 }
 const previousCampaign = load('portfolio-campanha') || {};
 const replacedCampaign = ['utm_source', 'utm_campaign'].some(key =>
  Object.hasOwn(incoming, key) && previousCampaign[key] !== incoming[key]);
 const campaign = replacedCampaign ? incoming : {...previousCampaign, ...incoming};
 const newCampaign = keys.some(key => previousCampaign[key] !== campaign[key]);
 save('portfolio-campanha',campaign);
 const id = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
 const reference = (!newCampaign && load('portfolio-contact-ref')) || 'CD-' + id().replaceAll('-','').slice(0,12).toUpperCase();
 save('portfolio-contact-ref',reference);
 const visitId = (!newCampaign && load('portfolio-funnel-visit')) || id();
 save('portfolio-funnel-visit',visitId);
 const demo = document.body.dataset.campaignDemo || '';
 const hero = document.querySelector('.hero-copy');
 const audience = campaign.publico;
 const offers = {
  agencias:{title:'Seu time cria.',accent:'Eu desenvolvo.',copy:'Seu layout aprovado vira um site ou interface navegável, com revisão e repasse para a sua agência.',link:'assets/casos/painel.html',demo:'Experimentar uma revisão com o cliente',cta:'Conversar sobre meu layout',message:'Olá, Pedro! Tenho um layout ou briefing e quero conversar sobre a implementação para a minha agência.',card:'card-painel'},
  prestadores:{title:'Mais pedidos de',accent:'orçamento.',copy:'Veja como seu cliente escolhe um serviço e pede orçamento pelo celular.',link:'demos/plano/index.html',demo:'Testar a página de captação',cta:'Quero uma página de orçamento',message:'Olá, Pedro! Quero uma página de orçamento para receber pedidos dos meus clientes.',card:'card-captacao'}
 };
 const offer = Object.hasOwn(offers,audience) ? offers[audience] : null;
 const defaultMessage = 'Olá, Pedro! Quero conversar sobre um projeto.';
 const phone = 'https://wa.me/5519974149650';
 const makeUrl = text => phone + '?text=' + encodeURIComponent(text);
 const campaignSlug = (value, fallback = '') => value?.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || fallback;
 const originName = campaignSlug(campaign.utm_source, 'direto');
 const campaignName = campaignSlug(campaign.utm_campaign, offer ? audience : 'direto');
 const campaignKey = originName + '/' + campaignName;
 const medium = campaignSlug(campaign.utm_medium);
 const creative = campaignSlug(campaign.utm_content);
 const contactDetails = contactReference => [
  'Referência: ' + contactReference,
  'Campanha: ' + campaignName,
  'Origem: ' + originName,
  ...(medium ? ['Meio: ' + medium] : []),
  ...(creative ? ['Criativo: ' + creative] : [])
 ].join('\n');
 const recorded = new Set();

 function whatsappUrl(value, contactReference = reference) {
  const url = new URL(value);
  url.searchParams.set('text', (url.searchParams.get('text') || '') + '\n\n' + contactDetails(contactReference));
  return url.href;
 }
 function emailUrl(url) {
  url.searchParams.set('subject', url.searchParams.get('subject') || 'Caos Domado — ' + reference);
  url.searchParams.set('body', (url.searchParams.get('body') || '') + '\r\n\r\n' + contactDetails(reference).replaceAll('\n', '\r\n'));
  url.search = url.searchParams.toString().replaceAll('+', '%20');
  return url.href;
 }
 const trackedKinds = {
  portfolio_demo_aberta: 'demo',
  portfolio_whatsapp_clique: 'whatsapp',
  portfolio_email_clique: 'email'
 };
 const surface = demo || (hero ? 'home' : 'contato');
 function track(kind, placement) {
  return fetch('/api/crm?action=track', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify({
    visit_id: visitId, kind, placement, origin: originName, campaign: campaignName, medium, creative
   }),
   keepalive: true
  }).then(response => response.ok, () => false);
 }
 function record(event, fields = {}, placement) {
  const entry = {event,...campaign,portfolio_demo:demo,page:location.pathname,reference,event_id:id(),...fields};
  (window.dataLayer ||= []).push(entry);
  if (placement && trackedKinds[event]) track(trackedKinds[event], surface + '-' + placement);
  if (vercelAnalytics && placement) {
   window.va('event', {name: event, data: {campanha: campaignKey, cta: placement}});
  }
  if (location.protocol === 'http:' && ['localhost','127.0.0.1'].includes(location.hostname)) {
   fetch('/api/portfolio-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(entry),keepalive:true}).catch(() => {});
  }
 }
 function contact(placement, channel = 'whatsapp') {
  const key = channel + '/' + placement;
  if (recorded.has(key)) return;
  recorded.add(key);
  record('portfolio_' + channel + '_clique', {portfolio_cta: placement}, placement);
 }
 window.portfolioCampaign = {
  whatsappUrl, record, contact,
  attribution: {reference, origin: originName, campaign: campaignName, medium, creative}
 };

 const vercelAnalytics = location.protocol === 'https:' &&
  (['caosdomado.com.br','www.caosdomado.com.br'].includes(location.hostname) ||
   /^portfolio-[a-z0-9-]+-pedrobentos-projects\.vercel\.app$/.test(location.hostname));
 if (vercelAnalytics) {
  window.va ||= (...args) => (window.vaq ||= []).push(args);
  window.va('beforeSend', event => {
   const url = new URL(event.url);
   url.search = '';
   url.hash = '';
   return {...event, url: url.href};
  });
  const insights = document.createElement('script');
  insights.src = '/_vercel/insights/script.js';
  insights.defer = true;
  insights.dataset.disableAutoTrack = '1';
  document.head.append(insights);
 }

 const stylesheet = document.createElement('link');
 stylesheet.rel = 'stylesheet';
 stylesheet.href = new URL('campanha-conversao.css',document.currentScript.src);
 document.head.append(stylesheet);

 if (hero && !demo) {
  const actions = hero.querySelector('.hero-actions');
  const exploration = actions.querySelector('a');
  if (offer) {
   hero.querySelector('h1').firstChild.textContent = offer.title;
   hero.querySelector('h1 .accent').textContent = offer.accent;
   hero.querySelector('p').textContent = offer.copy;
   exploration.href = offer.link;
   exploration.firstChild.textContent = offer.demo + ' ';
   const featured = document.getElementById(offer.card);
   featured?.parentElement.prepend(featured);
  }
  const direct = document.createElement('a');
  direct.className = 'button campaign-hero-contact';
  direct.href = makeUrl(offer?.message || defaultMessage);
  direct.dataset.campaignPlacement = 'home-opening';
  direct.target = '_blank';
  direct.rel = 'noopener noreferrer';
  direct.textContent = offer?.cta || 'Conversar no WhatsApp';
  const icon = document.querySelector('.header-cta .whatsapp-icon');
  if (icon) direct.prepend(icon.cloneNode(true));
  actions.prepend(direct);
  if (offer) {
   const followUp = document.createElement('div');
   followUp.className = 'campaign-gallery-action';
   const link = direct.cloneNode(true);
   link.className = 'button';
   link.dataset.campaignPlacement = 'gallery';
   followUp.append(link);
   document.querySelector('.collection-actions')?.after(followUp);
  }
 }
 const demoCTA = document.querySelector('[data-project-whatsapp]');
 if (demo && demoCTA) {
  const isAgencyReview = audience === 'agencias' && demo === 'painel';
  if (isAgencyReview) {
   demoCTA.href = makeUrl(offer.message);
   const textNode = [...demoCTA.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
   if (textNode) textNode.textContent = ' ' + offer.cta;
  }
  demoCTA.dataset.campaignPlacement = 'demo-footer';
  function contextualLink(placement) {
   const link = demoCTA.cloneNode(true);
   link.removeAttribute('data-project-whatsapp');
   link.dataset.campaignPlacement = placement;
   return link;
  }
  const banner = document.createElement('aside');
  banner.className = 'campaign-demo-bar';
  banner.setAttribute('aria-label','Contato com a Caos Domado');
  const notice = document.createElement('span');
  notice.textContent = 'Demonstração da Caos Domado';
  banner.append(notice,contextualLink('demo-opening'));
  document.querySelector('body > header')?.after(banner);
  const completion = document.querySelector('#approval-receipt,#catalog-review,#visit-report,#agenda-confirmation,[data-step="done"],[data-receipt]');
  if (completion) {
   const action = document.createElement('div');
   action.className = 'campaign-demo-completion';
   action.append(contextualLink('demo-completion'));
   completion.append(action);
  }
 }
 if (load('portfolio-funnel-entry') !== visitId) {
  track('entry', surface).then(accepted => {
   if (accepted) save('portfolio-funnel-entry', visitId);
  });
 }
 if (load('portfolio-measured-entry') !== reference) {
  record('portfolio_entrada', {}, demo ? 'demo' : hero ? 'home' : 'contato');
  save('portfolio-measured-entry', reference);
 }
 if (demo) record('portfolio_demo_aberta', {}, demo);
 document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.getAttribute('href'),document.baseURI);
  if (url.hostname === 'wa.me') {
   const placement = link.dataset.campaignPlacement || (link.matches('.header-cta') ? 'header' : link.closest('#contato') ? 'home-contact' : link.closest('#duvidas') ? 'faq' : link.closest('footer') ? 'footer' : 'contact-channel');
   if (offer && !demo && ['header','home-contact','contact-channel','footer'].includes(placement)) link.href = makeUrl(offer.message);
   link.href = whatsappUrl(link.href);
   link.addEventListener('click',() => contact(placement));
   return;
  }
  if (url.protocol === 'mailto:' && url.pathname.toLowerCase() === 'contato@caosdomado.com.br') {
   const placement = link.closest('footer') ? 'footer' : link.closest('#contato') ? 'home-contact' : 'contact-channel';
   link.href = emailUrl(url);
   link.addEventListener('click', () => contact(placement, 'email'));
   return;
  }
  if (url.protocol !== location.protocol || url.host !== location.host || link.getAttribute('href').startsWith('#')) return;
  Object.entries(campaign).forEach(([key,value]) => {
   if (!url.searchParams.has(key)) url.searchParams.set(key,value);
  });
  if (url.href !== link.href) link.href = url.href;
 });
})();
