(() => {
if (location.hash === '#climapro') {
 location.replace('demos/plano/index.html');
 return;
}
const form = document.querySelector('#briefing-form');
const formStatus = document.querySelector('#form-status');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navegacao');
const translate = text => window.caosTranslate?.(text) ?? text;
function toggleMenu(open) {
 nav.classList.toggle('is-open', open);
 menuButton.setAttribute('aria-expanded', String(open));
 menuButton.querySelector('.sr-only').textContent = translate(open ? 'Fechar menu' : 'Abrir menu');
}
menuButton.addEventListener('click', () => toggleMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', event => {
 if(event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {toggleMenu(false);menuButton.focus();}
});
if (!form) return;
form.querySelector('button[type=submit]').disabled = false;
form.addEventListener('input', event => event.target.setCustomValidity?.(''));
form.addEventListener('submit', async event => {
 event.preventDefault();
 for(const key of ['name', 'message']) {
  const field = form.elements.namedItem(key);
  field.setCustomValidity(field.value.trim().length < field.minLength ? translate('Preencha este campo com pelo menos ') + field.minLength + translate(' caracteres.') : '');
 }
 if(!form.reportValidity()) return;
 const data = Object.fromEntries(new FormData(form));
 const message = [
  'Olá, Pedro! Quero conversar sobre um projeto.',
  '',
  'Nome: ' + data.name.trim(),
  'E-mail: ' + data.email.trim(),
  ...(data.company.trim() ? ['Empresa/agência: ' + data.company.trim()] : []),
  '',
  'Meu projeto:',
  data.message.trim()
 ].join('\n');
 const baseUrl = 'https://wa.me/5519974149650?text=' + encodeURIComponent(message);
 const url = window.portfolioCampaign?.whatsappUrl(baseUrl) || baseUrl;
 const submit = form.querySelector('button[type=submit]');
 submit.disabled = true;
 formStatus.removeAttribute('data-state');
 formStatus.textContent = translate('Enviando seu projeto…');
 let received = false;
 try {
  const response = await fetch('/api/crm?action=intake', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify({...data, ...window.portfolioCampaign?.attribution, accepted: data.accepted === 'on'}),
   signal: AbortSignal.timeout(8000)
  });
  received = response.ok;
  if (response.status === 201) window.portfolioCampaign?.record('portfolio_projeto_enviado', {}, 'briefing');
 } catch {
  // Keep the WhatsApp option available when intake is offline.
 }
 formStatus.dataset.state = received ? 'success' : 'error';
 formStatus.textContent = translate(received ? 'Recebemos seu projeto. Se preferir, continue no WhatsApp.' :
  'Não conseguimos confirmar o recebimento. Tente novamente ou envie pelo WhatsApp.') + ' ';
 const fallback = document.createElement('a');
 fallback.href = url;
 fallback.target = '_blank';
 fallback.rel = 'noopener noreferrer';
 fallback.className = 'email-link';
 fallback.textContent = translate('Abrir conversa no WhatsApp');
 const whatsappIcon = document.querySelector('.header-cta .whatsapp-icon');
 if (whatsappIcon) fallback.prepend(whatsappIcon.cloneNode(true));
 fallback.addEventListener('click', () => window.portfolioCampaign?.contact('briefing'));
 formStatus.append(fallback);
 if (received) form.reset();
 submit.disabled = false;
});
})();
const gallery = document.querySelector('.work-index');
if (gallery) {
 const filters = [...gallery.querySelectorAll('[data-filter]')];
 const works = [...gallery.querySelectorAll('[data-categories]')];
 const group = gallery.querySelector('.work-filters');
 const status = gallery.querySelector('#work-results');
 const actions = gallery.querySelector('.collection-actions');
 const toggle = actions.querySelector('button');
 const selectedCount = 3;
 const translate = text => window.caosTranslate?.(text) ?? text;
 let category = 'all';
 let expanded = new URLSearchParams(location.search).get('acervo') === 'aberto';
 group.hidden = false;

 function renderCollection() {
  const matches = works.filter(work => category === 'all' || work.dataset.categories.split(' ').includes(category));
  const visible = category === 'all' && !expanded ? matches.slice(0, selectedCount) : matches;
  works.forEach(work => { work.hidden = !visible.includes(work); });
  filters.forEach(button => button.setAttribute('aria-pressed', String(category === button.dataset.filter)));
  gallery.querySelector('.work-grid').classList.toggle('is-filtered', category !== 'all');
  actions.hidden = category !== 'all' || matches.length <= selectedCount;
  toggle.textContent = translate(expanded ? 'Mostrar só os destaques' : 'Ver mais trabalhos');
  toggle.setAttribute('aria-expanded', String(expanded));
  status.textContent = document.documentElement.lang === 'en' ? visible.length + (visible.length === 1 ? ' project shown.' : ' projects shown.') : visible.length === 1 ? '1 trabalho exibido.' : visible.length + ' trabalhos exibidos.';
 }

 filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  renderCollection();
 }));
 toggle.addEventListener('click', () => {
  expanded = !expanded;
  const url = new URL(location.href);
  if (expanded) url.searchParams.set('acervo', 'aberto');
  else url.searchParams.delete('acervo');
  history.replaceState(null, '', url);
  renderCollection();
  if (expanded) works[selectedCount].querySelector('a').focus();
 });
 document.addEventListener('caos-language-change', renderCollection);
 renderCollection();
}


if (document.querySelector('#feedbacks') && (location.protocol === 'file:' || ['localhost','127.0.0.1','[::1]'].includes(location.hostname))) {
 const preview = document.createElement('script');
 preview.src = 'revisao/depoimentos-local.js';
 document.head.append(preview);
}
