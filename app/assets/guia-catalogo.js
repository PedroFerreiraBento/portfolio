(() => {
 const button = document.getElementById('copiar-mensagem');
 const message = document.getElementById('mensagem-exemplo');
 const status = document.getElementById('estado-copia');
 if (!navigator.clipboard?.writeText) return;

 button.hidden = false;
 button.addEventListener('click', async () => {
  try {
   await navigator.clipboard.writeText(message.textContent.trim());
   status.textContent = 'Mensagem copiada.';
  } catch {
   const selection = window.getSelection();
   if (!selection) return;
   const range = document.createRange();
   range.selectNodeContents(message);
   selection.removeAllRanges();
   selection.addRange(range);
   status.textContent = 'Mensagem selecionada. Use o comando de copiar do seu dispositivo.';
  }
 });
})();
