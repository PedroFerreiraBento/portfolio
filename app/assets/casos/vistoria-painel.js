(() => {
 const find = selector => document.querySelector(selector);
 const form = find('#inspection-form');
 const progress = find('#visit-meter');
 const output = find('#visit-report');
 const feedback = find('#visit-feedback');
 const pendingLabel = find('#visit-pending');
 const submit = form.querySelector('[type=submit]');
 const download = find('#download');
 const rowTemplate = find('#visit-report-row');
 const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle:'short', timeStyle:'short' });
 const photoTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
 const maxPhotoBytes = 10 * 1024 * 1024;
 const items = [...form.querySelectorAll('[data-item]')].map(field => ({
  field,
  title: field.querySelector('legend').textContent,
  note: field.querySelector('textarea'),
  photo: field.querySelector('[type=file]'),
  preview: field.querySelector('.visit-photo-preview'),
  photoError: field.querySelector('.visit-photo-error'),
  issue: field.querySelector('.visit-issue'),
  photoUrl: null,
  photoVersion: 0,
  loading: false
 }));

 function status(item) {
  return form.elements[item.field.dataset.item].value;
 }

 function clearReport() {
  output.hidden = true;
  feedback.textContent = '';
  feedback.removeAttribute('data-error');
  if (download.hasAttribute('href')) {
   URL.revokeObjectURL(download.href);
   download.removeAttribute('href');
  }
 }

 function updateProgress() {
  let completed = 0;
  let pending = 0;
  items.forEach(item => {
   const value = status(item);
   const needsAdjustment = value === 'Requer ajuste';
   if (value) completed += 1;
   if (needsAdjustment) pending += 1;
   item.issue.hidden = !needsAdjustment;
  });
  find('#visit-status').textContent = completed + ' de ' + items.length + ' verificados';
  pendingLabel.textContent = pending + (pending === 1 ? ' pendência' : ' pendências');
  pendingLabel.dataset.pending = String(pending > 0);
  progress.value = completed;
  submit.disabled = items.some(item => item.loading && status(item) === 'Requer ajuste');
 }

 function setPhotoMessage(item, message) {
  item.photoError.textContent = message;
  item.photoError.hidden = !message;
 }

 function clearPhoto(item) {
  if (item.photoUrl) URL.revokeObjectURL(item.photoUrl);
  item.photoUrl = null;
  item.preview.querySelector('img')?.remove();
  item.preview.hidden = true;
 }

 async function loadPhoto(item) {
  const file = item.photo.files[0];
  if (!file) return;
  const version = ++item.photoVersion;
  item.loading = false;
  clearReport();
  clearPhoto(item);
  if (!photoTypes.has(file.type) || !file.size || file.size > maxPhotoBytes) {
   item.photo.value = '';
   setPhotoMessage(item, 'Selecione uma foto JPG, PNG ou WebP de até 10 MB.');
   updateProgress();
   return;
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.alt = 'Foto anexada à pendência';
  image.src = url;
  item.loading = true;
  setPhotoMessage(item, 'Preparando a foto…');
  updateProgress();
  try {
   await image.decode();
   if (version !== item.photoVersion) {
    URL.revokeObjectURL(url);
    return;
   }
   item.photoUrl = url;
   item.preview.prepend(image);
   item.preview.hidden = false;
   setPhotoMessage(item, '');
  } catch {
   URL.revokeObjectURL(url);
   if (version === item.photoVersion) {
    item.photo.value = '';
    setPhotoMessage(item, 'Não foi possível abrir a foto. Escolha outro arquivo.');
   }
  } finally {
   if (version === item.photoVersion) {
    item.loading = false;
    updateProgress();
   }
  }
 }

 items.forEach(item => {
  item.photo.addEventListener('change', () => loadPhoto(item));
  item.preview.querySelector('button').addEventListener('click', () => {
   item.photoVersion += 1;
   item.loading = false;
   item.photo.value = '';
   clearPhoto(item);
   setPhotoMessage(item, '');
   clearReport();
   updateProgress();
   item.photo.focus();
  });
 });
 form.addEventListener('input', event => {
  if (event.target.type === 'file') return;
  clearReport();
  if (event.target.tagName === 'TEXTAREA') event.target.removeAttribute('aria-invalid');
  if (event.target.type === 'radio') updateProgress();
 });

 function reportRow({ title, result, note, photo }) {
  const row = rowTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector('h3').textContent = title;
  const chip = row.querySelector('.visit-result');
  chip.textContent = result;
  chip.dataset.pending = String(result === 'Requer ajuste');
  if (note) {
   const detail = row.querySelector('p');
   detail.textContent = note;
   detail.hidden = false;
  }
  if (photo) {
   const figure = row.querySelector('figure');
   const image = new Image();
   image.alt = 'Foto da pendência';
   image.src = photo;
   figure.prepend(image);
   figure.hidden = false;
  }
  return row;
 }

 function validationError(message, control) {
  feedback.dataset.error = '';
  feedback.textContent = message;
  control.focus();
 }

 form.addEventListener('submit', event => {
  event.preventDefault();
  clearReport();
  const unanswered = items.find(item => !status(item));
  if (unanswered) {
   validationError('Marque o resultado de todos os itens para gerar o relatório.', unanswered.field.querySelector('input'));
   return;
  }
  if (submit.disabled) return;
  const unresolved = items.find(item => status(item) === 'Requer ajuste' && !item.note.value.trim());
  if (unresolved) {
   unresolved.note.setAttribute('aria-invalid', 'true');
   validationError('Descreva o ajuste necessário em cada pendência.', unresolved.note);
   return;
  }
  const rows = items.map(item => {
   const result = status(item);
   const pending = result === 'Requer ajuste';
   return {
    title:item.title,
    result,
    note:pending ? item.note.value.trim() : '',
    photo:pending ? item.photoUrl : null
   };
  });
  const withIssues = rows.some(row => row.result === 'Requer ajuste');
  const next = withIssues ? 'Encaminhar as pendências abaixo à equipe de manutenção.' : 'Vistoria concluída sem pendências.';
  const now = new Date();
  const reportDate = find('#report-date');
  reportDate.dateTime = now.toISOString();
  reportDate.textContent = dateFormat.format(now);
  find('#report-next').textContent = next;
  find('#report-items').replaceChildren(...rows.map(reportRow));
  const text = [
   'Relatório VST-024 · Vistoria de demonstração',
   'Unidade Centro · Sala de máquinas · Unidade de ventilação UV-03',
   'Ana Ribeiro · Manutenção',
   'Registrado em: ' + reportDate.textContent,
   '',
   pendingLabel.textContent + '. ' + next,
   '',
   ...rows.flatMap(({title,result,note,photo}) => [
    title + ' — ' + result,
    ...(note ? ['Ajuste: ' + note] : []),
    ...(photo ? ['Evidência disponível na versão para impressão ou PDF.'] : []),
    ''
   ]),
   'Demonstração com dados fictícios.'
  ].join('\r\n');
  download.href = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  download.download = 'vistoria-VST-024.txt';
  output.hidden = false;
  feedback.textContent = 'Relatório gerado.';
  find('#report-title').focus();
 });

 find('#print-report').addEventListener('click', () => window.print());
 find('#edit-report').addEventListener('click', () => find('#visit-form-title').focus());
 updateProgress();
})();

