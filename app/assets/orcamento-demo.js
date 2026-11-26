(() => {
 const lab = document.querySelector('.quote-lab');
 const service = lab.querySelector('#quote-service');
 const count = lab.querySelector('#quote-count');
 const city = lab.querySelector('#quote-city');
 const wording = {
  luz: {pt:['instalar','luminária','luminárias'], en:['install','light fixture','light fixtures']},
  tomada: {pt:['trocar','tomada','tomadas'], en:['replace','outlet','outlets']},
  ventilador: {pt:['instalar','ventilador de teto','ventiladores de teto'], en:['install','ceiling fan','ceiling fans']}
 };
 function render() {
  const en = document.documentElement.lang.startsWith('en');
  const terms = wording[service.value][en ? 'en' : 'pt'];
  lab.querySelector('#quote-greeting').textContent = en ? 'Hi! I’d like a quote to ' : 'Olá! Gostaria de um orçamento para ';
  lab.querySelector('#quote-description').textContent = [terms[0], count.value, terms[count.value === '1' ? 1 : 2]].join(' ');
  lab.querySelector('#quote-location').textContent = en ? ' in ' : ' em ';
  lab.querySelector('#quote-place').textContent = city.value;
  lab.querySelector('#quote-ending').textContent = en ? '. Do you serve my area?' : '. Vocês atendem minha região?';
 }
 lab.querySelector('fieldset').disabled = false;
 lab.addEventListener('change', event => {
  render();
  const part = lab.querySelector(event.target === city ? '#quote-place' : '#quote-description');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
   part.animate([{backgroundColor:'#ffcd83'},{backgroundColor:'transparent'}],{duration:500});
  }
  window.portfolioCampaign?.tryDemo('montar-pedido');
 });
 document.addEventListener('caos-language-change', render);
 window.addEventListener('pageshow', render);
 render();
})();
