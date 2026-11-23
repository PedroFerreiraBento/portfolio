const form = document.querySelector('[data-demo-form]');
const receipt = form.querySelector('[data-receipt]');
const details = receipt.querySelector('[data-summary]');
form.querySelector('button[type=submit]').disabled = false;

form.addEventListener('submit', event => {
 event.preventDefault();
 if (!form.reportValidity()) return;
 const lines = [...new FormData(form)].map(([label, value]) => {
  const row = document.createElement('div');
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  term.textContent = label;
  description.textContent = value;
  row.append(term, description);
  return row;
 });
 details.replaceChildren(...lines);
 receipt.hidden = false;
 receipt.querySelector('h3').focus();
});

form.addEventListener('change', () => { receipt.hidden = true; });
