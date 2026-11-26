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
  agencias:{title:'Seu time cria.',accent:'Eu desenvolvo.',copy:'Seu layout aprovado vira um site ou interface navegável, com revisão e repasse para a sua agência.',link:'assets/casos/painel.html',demo:'Experimentar uma revisão com o cliente',cta:'Conversar sobre meu layout',message:'Olá, Pedro! Tenho um layout ou briefing e quero conversar sobre a implementação para a minha agência.'},
  prestadores:{title:'Mais pedidos de',accent:'orçamento.',copy:'Veja como seu cliente escolhe um serviço e pede orçamento pelo celular.',link:'demos/plano/index.html',demo:'Testar a página de captação',cta:'Quero uma página de orçamento',message:'Olá, Pedro! Quero uma página de orçamento para receber pedidos dos meus clientes.'}
 };
 const offer = Object.hasOwn(offers,audience) ? offers[audience] : null;
 const defaultMessage = 'Olá, Pedro! Quero conversar sobre um projeto.';
 const phone = 'https://wa.me/5519974149650';
 const makeUrl = text => phone + '?text=' + encodeURIComponent(text);
 const campaignSlug = (value, fallback = '') => value?.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || fallback;
 function referral() {
  if (!document.referrer) return {source:'desconhecida', medium:''};
  const host = new URL(document.referrer).hostname.replace(/^www\./,'');
  if (host === location.hostname.replace(/^www\./,'') || host === 'caosdomado.com.br') {
   return {source:'desconhecida', medium:''};
  }
  const search = {'google.com':'google','google.com.br':'google','bing.com':'bing','duckduckgo.com':'duckduckgo','search.yahoo.com':'yahoo'};
  return {source:search[host] || campaignSlug(host), medium:search[host] ? 'organico' : 'referencia'};
 }
 const previousTouch = load('portfolio-first-touch');
 const touch = previousTouch?.visit === visitId ? previousTouch : {
  visit:visitId, path:location.pathname, ...referral()
 };
 save('portfolio-first-touch',touch);
 const originName = campaignSlug(campaign.utm_source, touch.source);
 const campaignName = campaignSlug(campaign.utm_campaign, offer ? audience : 'sem-campanha');
 const campaignKey = originName + '/' + campaignName;
 const medium = campaignSlug(campaign.utm_medium, campaign.utm_source ? '' : touch.medium);
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
 const surface = document.body.dataset.campaignSurface || demo || (hero ? 'home' : 'contato');
 const solutionNames = {orcamento:'Páginas de orçamento',catalogo:'Catálogos online',agendamento:'Agendamento online',operacao:'Ferramentas para equipes'};
 function galleryPage(path) {
  const segments = path.split('/').filter(Boolean);
  const [area, family, branch, file = 'index.html'] = segments;
  if (area === 'exemplos' && branch) {
   const type = {catalogos:'catalogo',agendamentos:'agendamento',equipes:'operacao'}[family] || 'orcamento';
   return {type,branch,version:file.replace(/\.html$/,''),comparison:file === 'versoes.html'};
  }
  if (area === 'demos') return {type:'orcamento',branch:'climapro',version:family || 'index',comparison:!family || family === 'index.html'};
  if (area === 'assets' && family === 'casos') {
   const id = branch.replace(/\.html$/,'');
   return {type:({catalogo:'catalogo',agenda:'agendamento'})[id] || 'operacao',branch:id,version:'principal'};
  }
 }
 const gallery = galleryPage(location.pathname);
 function galleryEvent(action,type,branch,version,label) {
  if (!solutionNames[type]) return;
  const placement = [action,type,branch,version].filter(Boolean).join('--');
  return track('gallery',placement,[solutionNames[type],label].filter(Boolean).join(' · '));
 }
 function track(kind, placement, galleryLabel) {
  return fetch('/api/crm?action=track', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify({
    visit_id: visitId, contact_reference: reference, landing_path:touch.path, gallery_label:galleryLabel, kind, placement, origin: originName, campaign: campaignName, medium, creative
   }),
   keepalive: true
  }).then(response => response.ok, () => false);
 }
 function record(event, fields = {}, placement) {
  const entry = {event,...campaign,portfolio_demo:demo,page:location.pathname,reference,event_id:id(),...fields};
  (window.dataLayer ||= []).push(entry);
  if (placement && trackedKinds[event]) {
   const button = [surface,placement].join('-');
   const point = gallery && trackedKinds[event] === 'whatsapp' ? button + '--' + gallery.version : button;
   track(trackedKinds[event],point,gallery ? document.title : undefined);
  }
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
 function tryDemo(action) {
  const key = 'simulation/' + action;
  if (recorded.has(key)) return;
  recorded.add(key);
  record('portfolio_demo_interacao', {portfolio_demo: surface, portfolio_cta: action}, action);
  if (recorded.has('inline-demo')) return;
  recorded.add('inline-demo');
  track('demo', surface + '-simulacao');
 }
 window.portfolioCampaign = {
  whatsappUrl, record, contact, tryDemo, galleryEvent,
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
   hero.querySelector('.hero-offers')?.setAttribute('hidden', '');
   hero.querySelector('h1').firstChild.textContent = offer.title;
   hero.querySelector('h1 .accent').textContent = offer.accent;
   hero.querySelector('p').textContent = offer.copy;
   exploration.href = offer.link;
   exploration.firstChild.textContent = offer.demo + ' ';
   const showcase = document.querySelector('.work-showcase');
   if (showcase) showcase.dataset.defaultProject = audience === 'agencias' ? 'painel' : 'climapro';
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
   document.querySelector('.showcase-explorer')?.after(followUp);
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
  const opening = contextualLink('demo-opening');
  const navigationContact = document.querySelector('[data-demo-navigation-contact]');
  if (navigationContact) {
   const label = navigationContact.dataset.contactLabel;
   const textNode = [...opening.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
   if (label && textNode) textNode.textContent = ' ' + label;
   navigationContact.append(opening);
  } else {
   const banner = document.createElement('aside');
   banner.className = 'campaign-demo-bar';
   banner.setAttribute('aria-label','Contato com a Caos Domado');
   const notice = document.createElement('span');
   notice.textContent = 'Demonstração da Caos Domado';
   banner.append(notice,opening);
   document.querySelector('body > header')?.after(banner);
  }
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
  record('portfolio_entrada', {}, demo ? 'demo' : surface);
  save('portfolio-measured-entry', reference);
 }
 if (['pagina-de-orcamentos','catalogo-online','agendamento-online'].includes(surface)) track('offer',surface);
 if (gallery) galleryEvent(gallery.comparison ? 'comparar' : 'abrir',gallery.type,gallery.branch,gallery.version,document.title);
 document.addEventListener('click',event => {
  const link = event.target.closest?.('.examples-tree a[href]');
  if (!link) return;
  const next = galleryPage(new URL(link.href).pathname);
  if (next) galleryEvent('ramo',next.type,next.branch,null,link.textContent.trim());
 });
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
