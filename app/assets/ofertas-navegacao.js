/* Only the new, offer-specific labels use this small bilingual vocabulary.
   The site-wide preference controls remain responsible for the active locale. */
(() => {
  const labels = [...document.querySelectorAll('[data-offer-en]')].map(element => ({
    element, pt: element.textContent, en: element.dataset.offerEn
  }));
  function localize() {
    const english = document.documentElement.lang.startsWith('en');
    labels.forEach(({element,pt,en}) => { element.textContent = english ? en : pt; });
  }
  document.addEventListener('caos-language-change', localize);
  localize();
})();
