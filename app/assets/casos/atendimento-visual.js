const catalog = document.querySelector('#catalog-form');
if (catalog) {
 const total = document.querySelector('#catalog-total');
 function updateQuantity() {
  const counts = [...catalog.querySelectorAll('input[type=number]')].map(input => Number(input.value));
  const quantity = counts.reduce((sum, count) => sum + count, 0);
  total.textContent = counts.some(value => !Number.isInteger(value) || value < 0 || value > 999)
   ? 'Revise as quantidades.'
   : quantity + (quantity === 1 ? ' peça na cotação' : ' peças na cotação');
 }
 catalog.addEventListener('input', updateQuantity);
 updateQuantity();
}
const inspection = document.querySelector('#inspection-form');
if (inspection) {
 const fields = [...inspection.querySelectorAll('select')];
 function updateProgress() {
  const done = fields.filter(field => field.value).length;
  const pending = fields.filter(field => field.value === 'Requer ajuste').length;
  document.querySelector('#visit-status').textContent = done + ' de ' + fields.length + ' verificados';
  document.querySelector('#visit-pending').textContent = pending + (pending === 1 ? ' pendência' : ' pendências');
  document.querySelector('#visit-meter').value = done;
 }
 inspection.addEventListener('change', updateProgress);
 updateProgress();
}
