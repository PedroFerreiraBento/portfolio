const config = JSON.parse(document.querySelector('#config').textContent);
const workspace = document.querySelector('[data-workspace]');
const notice = document.querySelector('[data-status]');
const storageKey = 'caos-ferramentas-v1:' + config.id;
const seed = () => {
  if (config.kind === 'flow') return { stage: config.rows.map(row => row[3]) };
  if (config.kind === 'gate') return { checks: config.check.map(() => false), status: 'review', issue: '' };
  return { counts: config.rows.map(row => row[3]), closed: false };
};
const safe = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

function load() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { return seed(); }
  if (config.kind === 'flow' && saved?.stage?.length === config.rows.length &&
      saved.stage.every(value => Number.isInteger(value) && value >= 0 && value < config.sections.length)) return saved;
  if (config.kind === 'gate' && saved?.checks?.length === config.check.length &&
      saved.checks.every(value => typeof value === 'boolean') &&
      ['review', 'issue', 'approved'].includes(saved.status) &&
      typeof saved.issue === 'string' && saved.issue.length <= 180) return saved;
  if (config.kind === 'count' && saved?.counts?.length === config.rows.length &&
      saved.counts.every(value => Number.isInteger(value) && value >= 0 && value <= 9999) &&
      typeof saved.closed === 'boolean') return saved;
  return seed();
}

let state = load();

function persist(message) {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { message += ' As alterações ficam abertas somente nesta página.'; }
  notice.textContent = message;
}

function toolbar(label) {
  return '<section class="bar"><div><strong>' + safe(config.job) + '</strong><span>' + safe(config.ref) + '</span></div><span class="progress" data-progress>' + safe(label) + '</span></section>';
}

function finish() {
  return '<div class="end"><button type="button" data-copy>' + safe(config.copyAction) + '</button></div>';
}

function renderFlow() {
  const ready = state.stage.filter(stage => stage === config.sections.length - 1).length;
  return toolbar(ready + ' de ' + config.rows.length + ' ' + config.units + ' concluídas') +
    '<div class="flow-grid">' + config.sections.map((label, stage) => {
      const entries = config.rows.map((row, index) => ({ row, index })).filter(record => state.stage[record.index] === stage);
      return '<section class="stage"><h2>' + safe(label) + '<span>' + entries.length + '</span></h2>' +
        (entries.length ? entries.map(({ row, index }) =>
          '<article class="task"><h3>' + safe(row[0]) + '</h3><p>' + safe(row[1]) + '</p><p class="due">' + safe(row[2]) + '</p><div class="task-actions">' +
          (stage > 0 ? '<button type="button" data-move="' + index + '" data-direction="-1" aria-label="Voltar etapa de ' + safe(row[0]) + '">Voltar</button>' : '') +
          (stage < config.sections.length - 1 ? '<button type="button" class="primary" data-move="' + index + '" data-direction="1" aria-label="' + safe(config.action + ': ' + row[0]) + '">Avançar</button>' : '') +
          '</div></article>').join('') : '<p class="empty">Nenhum item nesta etapa.</p>') + '</section>';
    }).join('') + '</div>' + finish();
}

function renderGate() {
  const checked = state.checks.filter(Boolean).length;
  const labels = {review: 'Em revisão', issue: 'Com pendência', approved: 'Liberada'};
  const terminal = state.status !== 'review';
  return toolbar(labels[state.status]) +
    '<div class="gate-grid"><figure><img src="' + safe(config.photo) + '" alt=""><figcaption>' + safe(config.photoLabel) + '</figcaption></figure>' +
    '<section class="gate"><h2>' + safe(config.panelTitle) + '</h2><p>' + safe(config.panelIntro) + '</p>' +
    '<fieldset ' + (terminal ? 'disabled' : '') + '><legend class="sr">Itens de conferência</legend>' +
    config.check.map((label, index) => '<label class="check"><input type="checkbox" data-gate="' + index + '" ' + (state.checks[index] ? 'checked' : '') + '><span>' + safe(label) + '</span></label>').join('') +
    '</fieldset><p class="gate-state" data-check-count>' + (state.status === 'issue' ? safe(state.issue) : checked + ' de ' + config.check.length + ' itens conferidos') + '</p>' +
    '<div class="gate-actions">' + (terminal ? '<button type="button" class="primary" data-reopen>Reabrir conferência</button>' :
      '<button type="button" class="primary" data-approve>' + safe(config.action) + '</button><button type="button" data-issue aria-expanded="false" aria-controls="pendencia">Registrar pendência</button>') +
    '</div>' + (terminal ? '' : '<form id="pendencia" hidden data-issue-form><label>O que precisa ser corrigido?<textarea data-issue-text maxlength="180" required>' + safe(state.issue || config.issue) + '</textarea></label><button type="submit">Salvar pendência</button></form>') +
    '</section></div>' + finish();
}

function rowVariance(planned, count) {
  const difference = count - planned;
  if (difference === 0) return 'Conferido';
  return difference > 0 ? difference + ' a mais' : 'Faltam ' + Math.abs(difference);
}

function renderCount() {
  const total = state.counts.reduce((sum, value) => sum + value, 0);
  const target = config.rows.reduce((sum, row) => sum + row[2], 0);
  return toolbar(state.closed ? 'Conferência concluída' : total + ' de ' + target + ' ' + config.unit) +
    '<section class="quantity"><h2>' + safe(config.panelTitle) + '</h2><div class="count-legend" aria-hidden="true"><span>Item</span><span>Previsto</span><span>Registrado</span><span>Diferença</span></div>' +
    config.rows.map((row, index) => '<div class="count-row"><div><strong>' + safe(row[0]) + '</strong><small>' + safe(row[1]) + '</small></div>' +
      '<div class="target"><span class="sr">Previsto</span>' + row[2] + '</div><label><span class="sr">Quantidade registrada de ' + safe(row[0]) +
      '</span><input type="number" min="0" max="9999" step="1" inputmode="numeric" required data-count="' + index + '" value="' + state.counts[index] + '"' + (state.closed ? ' disabled' : '') + '></label>' +
      '<div class="variance" data-variance="' + index + '">' + rowVariance(row[2], state.counts[index]) + '</div></div>').join('') +
    '<div class="count-actions">' + (state.closed ? '<button type="button" data-reopen>Reabrir contagem</button>' : '<button type="button" class="primary" data-close>' + safe(config.action) + '</button>') +
    '<button type="button" data-copy>' + safe(config.copyAction) + '</button></div></section>';
}

function render() {
  workspace.innerHTML = ({ flow: renderFlow, gate: renderGate, count: renderCount })[config.kind]();
}

function updateCount(input) {
  if (!input.validity.valid) return false;
  const index = Number(input.dataset.count);
  const value = input.valueAsNumber;
  state.counts[index] = value;
  workspace.querySelector('[data-variance="' + index + '"]').textContent = rowVariance(config.rows[index][2], value);
  const count = state.counts.reduce((sum, item) => sum + item, 0);
  const target = config.rows.reduce((sum, row) => sum + row[2], 0);
  workspace.querySelector('[data-progress]').textContent = count + ' de ' + target + ' ' + config.unit;
  persist('Quantidade registrada.');
  return true;
}

function summary() {
  const heading = config.brand + ' · ' + config.title + '\n' + config.job + ' · ' + config.ref;
  if (config.kind === 'flow') return [heading, ...config.rows.map((row, index) => row[0] + ' · ' + config.sections[state.stage[index]])].join('\n');
  if (config.kind === 'gate') {
    const labels = {review: 'Em revisão', issue: state.issue, approved: 'Liberada'};
    return [heading, 'Situação: ' + labels[state.status],
      ...config.check.map((item, index) => item + ' · ' + (state.checks[index] ? 'Conferido' : 'Pendente'))].join('\n');
  }
  return [heading, state.closed ? 'Conferência concluída' : 'Conferência em andamento',
    ...config.rows.map((row, index) => row[0] + ' · ' + state.counts[index] + '/' + row[2])].join('\n');
}

async function copy() {
  const text = summary();
  try {
    await navigator.clipboard.writeText(text);
    notice.textContent = 'Resumo copiado.';
  } catch {
    const field = document.createElement('textarea');
    field.readOnly = true;
    field.value = text;
    field.setAttribute('aria-label', 'Resumo para copiar');
    notice.textContent = 'Use a opção Copiar do seu dispositivo.';
    notice.append(field);
    field.select();
  }
}

workspace.addEventListener('input', event => {
  if (event.target.matches('[data-count]')) updateCount(event.target);
  if (event.target.matches('[data-gate]')) {
    state.checks[Number(event.target.dataset.gate)] = event.target.checked;
    workspace.querySelector('[data-check-count]').textContent = state.checks.filter(Boolean).length + ' de ' + config.check.length + ' itens conferidos';
    persist('Conferência atualizada.');
  }
});
workspace.addEventListener('submit', event => {
  if (!event.target.matches('[data-issue-form]')) return;
  event.preventDefault();
  const field = event.target.querySelector('[data-issue-text]');
  const reason = field.value.trim();
  if (!reason) {
    notice.textContent = 'Descreva o que precisa ser corrigido.';
    field.focus();
    return;
  }
  state.checks.fill(false);
  state.status = 'issue';
  state.issue = reason;
  persist('Pendência registrada. O trabalho continua em revisão.');
  render();
  workspace.querySelector('[data-reopen]').focus();
});
workspace.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-copy')) { copy(); return; }
  let focus;
  if (button.hasAttribute('data-move')) {
    const index = Number(button.dataset.move);
    const stage = state.stage[index] + Number(button.dataset.direction);
    if (stage < 0 || stage >= config.sections.length) return;
    state.stage[index] = stage;
    persist(config.rows[index][0] + ' · ' + config.sections[stage] + '.');
    focus = '[data-move="' + index + '"]';
  } else if (button.hasAttribute('data-approve')) {
    if (!state.checks.every(Boolean)) {
      notice.textContent = 'Confira todos os itens antes de liberar.';
      workspace.querySelector('[data-gate]:not(:checked)').focus();
      return;
    }
    state.status = 'approved';
    persist('Conferência liberada.');
    focus = '[data-reopen]';
  } else if (button.hasAttribute('data-issue')) {
    const form = workspace.querySelector('[data-issue-form]');
    form.hidden = !form.hidden;
    button.setAttribute('aria-expanded', String(!form.hidden));
    if (!form.hidden) form.querySelector('[data-issue-text]').focus();
    return;
  } else if (button.hasAttribute('data-close')) {
    const invalid = [...workspace.querySelectorAll('[data-count]')].find(input => !input.validity.valid);
    if (invalid) { invalid.reportValidity(); return; }
    if (!config.rows.every((row, index) => row[2] === state.counts[index])) {
      notice.textContent = 'Resolva as diferenças antes de concluir.';
      const first = config.rows.findIndex((row, index) => row[2] !== state.counts[index]);
      workspace.querySelector('[data-count="' + first + '"]').focus();
      return;
    }
    state.closed = true;
    persist('Conferência concluída.');
    focus = '[data-reopen]';
  } else if (button.hasAttribute('data-reopen')) {
    if (config.kind === 'gate') state.status = 'review';
    else state.closed = false;
    persist('Conferência reaberta.');
    focus = '[data-gate], [data-count]';
  }
  if (!focus) return;
  render();
  workspace.querySelector(focus)?.focus();
});
document.querySelector('[data-reset]').addEventListener('click', () => {
  state = seed();
  persist('Demonstração restaurada.');
  render();
});
render();
