const form = document.querySelector('[data-request]');
const result = document.querySelector('[data-result]');
const summary = document.querySelector('[data-summary]');
const fields = [...form.querySelectorAll('[data-field]')];
form.querySelector('button[type="submit"]').disabled = false;

form.addEventListener('submit', event => {
 event.preventDefault();
 const lines = fields.filter(field => field.type !== 'radio' || field.checked).map(field => {
  const row = document.createElement('div');
  const key = document.createElement('dt');
  const value = document.createElement('dd');
  key.textContent = field.dataset.field;
  value.textContent = field.type === 'date' ? field.value.split('-').reverse().join('/') : field.value;
  row.append(key, value);
  return row;
 });
 summary.replaceChildren(...lines);
 form.hidden = true;
 result.hidden = false;
 result.querySelector('h3').focus();
});

document.querySelector('[data-edit]').addEventListener('click', () => {
 result.hidden = true;
 form.hidden = false;
 (form.querySelector('input:checked') ?? fields[0]).focus();
});
