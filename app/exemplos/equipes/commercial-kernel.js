export const money = (number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number / 100);
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
export const option = (list, select) =>
  list
    .map(
      ([value, label]) =>
        '<option value="' +
        escape(value) +
        '"' +
        (value === select ? ' selected' : '') +
        '>' +
        escape(label) +
        '</option>'
    )
    .join('');
export const line = (name, value) =>
  '<div class="receipt-line"><dt>' + escape(name) + '</dt><dd>' + escape(value) + '</dd></div>';
export function renderReceipt(title, rows) {
  return (
    '<section class="receipt"><h2>' +
    escape(title) +
    '</h2><dl>' +
    rows.map(([name, value]) => line(name, value)).join('') +
    '</dl><button type="button" class="secondary" data-copy>Copiar resumo</button></section>'
  );
}

export function start({ key, initial, views }) {
  const mode = document.body.dataset.mode;
  const view = views[mode];
  const outlet = document.querySelector('[data-app]');
  const status = document.querySelector('[data-status]');
  const name = 'caos-equipes-' + key + '-v1';
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(name));
      if (saved) return saved;
    } catch {}
    return structuredClone(initial);
  };
  let state = read();
  let session = view.create?.(state) || {};
  const draw = () => {
    outlet.innerHTML = view.render(state, session);
  };
  const save = () => {
    try {
      localStorage.setItem(name, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  };
  const notify = (message, type = '') => {
    status.dataset.tone = type;
    status.textContent = message;
  };
  const update = (action, data = new FormData()) => {
    state = read();
    const result = view.handle(action, data, state, session);
    if (!result) return;
    if (result.persist && !save()) {
      state = read();
      notify('Não foi possível salvar a operação neste navegador.', 'error');
      return;
    }
    notify(result.message || '', result.error ? 'error' : '');
    if (!result.error) {
      draw();
      const target = outlet.querySelector(result.focus || 'input,select,button');
      target?.focus({ preventScroll: true });
    }
  };
  outlet.addEventListener('input', (event) => {
    const form = event.target.closest('form[data-recompute]');
    if (!form) return;
    outlet.querySelector('button[data-action="' + form.dataset.recompute + '"]').disabled = true;
    notify(form.dataset.recomputeMessage);
  });
  outlet.addEventListener('submit', (event) => {
    event.preventDefault();
    update(event.target.dataset.action, new FormData(event.target, event.submitter));
  });
  outlet.addEventListener('click', async (event) => {
    const copy = event.target.closest('[data-copy]');
    if (copy) {
      const receipt = copy.closest('.receipt');
      const lines = [...receipt.querySelectorAll('dl > div')].map(
        (row) => row.querySelector('dt').textContent + ': ' + row.querySelector('dd').textContent
      );
      try {
        await navigator.clipboard.writeText([receipt.querySelector('h2').textContent, ...lines].join('\n'));
        notify('Resumo copiado.');
      } catch {
        const range = document.createRange();
        range.selectNodeContents(receipt.querySelector('dl'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        notify('Use a opção Copiar do seu dispositivo.');
      }
      return;
    }
    const control = event.target.closest('button[data-action]');
    if (!control) return;
    const data = new FormData();
    data.set('value', control.value);
    update(control.dataset.action, data);
  });
  document.querySelector('[data-reset-demo]').addEventListener('click', () => {
    try {
      localStorage.removeItem(name);
    } catch {
      notify('Não foi possível limpar os dados desta demonstração.', 'error');
      return;
    }
    state = read();
    session = view.create?.(state) || {};
    draw();
    notify('Demonstração reiniciada.');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== name) return;
    state = read();
    draw();
  });
  draw();
}
