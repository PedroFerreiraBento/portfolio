(() => {
 const root = document.documentElement;
 const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
 const languageKey = 'caos-language';
 const themeKey = 'caos-theme';

 function readChoice(key, supported) {
  try {
   const value = localStorage.getItem(key);
   return supported.includes(value) ? value : null;
  } catch {
   return null;
  }
 }

 function deviceLanguage() {
  for (const locale of [...(navigator.languages || []), navigator.language || '']) {
   const language = locale.toLowerCase().split('-')[0];
   if (language === 'pt') return 'pt-BR';
   if (language === 'en') return 'en';
  }
  return 'pt-BR';
 }

 const storedLanguage = () => readChoice(languageKey, ['pt-BR', 'en']);
 const storedTheme = () => readChoice(themeKey, ['light', 'dark']);
 const deviceTheme = () => colorScheme.matches ? 'dark' : 'light';
 function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* The current page still uses the choice. */ }
 }

 if (!document.currentScript.hasAttribute('data-fixed-language')) root.lang = storedLanguage() ?? deviceLanguage();
 root.dataset.theme = storedTheme() ?? deviceTheme();
 const { heroPt, heroEn, heroMobilePt, heroMobileEn } = document.currentScript.dataset;
 if (heroPt && heroEn) {
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  const english = root.lang === 'en';
  const mobile = window.matchMedia('(max-width: 480px)').matches;
  preload.href = mobile && heroMobilePt && heroMobileEn
   ? (english ? heroMobileEn : heroMobilePt)
   : (english ? heroEn : heroPt);
  preload.fetchPriority = 'high';
  document.head.append(preload);
 }
 window.caosPreferences = { colorScheme, languageKey, themeKey, storedLanguage, storedTheme, deviceLanguage, deviceTheme, save };
})();
