const copy = {
  title:['Testes de atendimento','Outreach tests'],
  active:['Em andamento','In progress'],
  add:['Adicionar contato','Add contact'],
  approach:['Abordagem','Approach'],
  contacts:['Contatos','Contacts'],
  responses:['Respostas','Responses'],
  meetings:['Reuniões','Meetings'],
  rate:['Taxa de resposta','Response rate'],
  call:['Ligação primeiro','Call first'],
  whatsapp:['WhatsApp primeiro','WhatsApp first'],
  contact:['Contato','Contact'],
  select:['Selecione','Select'],
  save:['Incluir no teste','Add to test'],
  loading:['Carregando o teste…','Loading the test…'],
  retry:['Tentar novamente','Try again'],
  saved:['Contato incluído no teste.','Contact added to the test.'],
  failure:['Não foi possível carregar o teste.','The test could not be loaded.'],
  saveFailure:['Não foi possível incluir o contato. Confira se ele já está no teste e tente novamente.','Could not add the contact. Check whether they are already in the test and try again.'],
  none:['Nenhum contato disponível para incluir.','No contacts available to add.'],
  note:['Cada contato entra em uma abordagem. A resposta conta quando há contato realizado. A reunião conta quando é marcada ou realizada após a inclusão. Os resultados são descritivos.','Each contact is assigned to one approach. A response counts after a successful contact. A meeting counts when booked or completed after assignment. Results are descriptive.']
};

function t(key) {
  return copy[key][document.documentElement.lang === 'en' ? 1 : 0];
}

function element(tag, content='', className='') {
  const item = document.createElement(tag);
  item.className = className;
  item.textContent = content;
  return item;
}

function percent(total, count) {
  if (!total) return '—';
  return new Intl.NumberFormat(document.documentElement.lang, {style:'percent', maximumFractionDigits:0}).format(count/total);
}

function metricCell(total, count) {
  const cell = element('td', String(count));
  const rate = total ? ' (' + percent(total,count) + ')' : '';
  cell.append(element('span', rate, 'experiments-rate-detail'));
  return cell;
}

function resultRow(data) {
  const row = document.createElement('tr');
  const variant = element('th', t(data.variant));
  variant.scope = 'row';
  const responseCell = metricCell(data.contacts, data.responses);
  const rate = element('div','','experiments-progress');
  const bar = document.createElement('progress');
  bar.max = data.contacts || 1;
  bar.value = data.responses;
  bar.setAttribute('aria-label', t('rate') + ': ' + t(data.variant));
  rate.append(bar,element('span',percent(data.contacts,data.responses)));
  const rateCell = element('td','','experiments-rate');
  rateCell.append(rate);
  row.append(variant, element('td',String(data.contacts)), responseCell, metricCell(data.contacts,data.meetings), rateCell);
  return row;
}

export function initTodayExperiments(api) {
  const root = document.querySelector('#today-experiments');
  root.classList.add('operations-band','today-experiments');
  root.setAttribute('aria-labelledby','experiments-title');
  root.innerHTML = [
    '<div class="operations-section-heading">',
    '<h2 id="experiments-title" tabindex="-1"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 3h6m-5 0v7l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3M8.5 15h7"/></svg><span data-copy="title"></span></h2>',
    '<div class="experiments-actions"><small data-copy="active" class="experiments-state" hidden></small>',
    '<button type="button" class="quiet" data-copy="add" aria-controls="experiments-form" aria-expanded="false" disabled></button></div>',
    '</div>',
    '<form id="experiments-form" class="experiments-form" hidden>',
    '<label><span data-copy="contact"></span><select name="reference" required></select></label>',
    '<label><span data-copy="approach"></span><select name="variant" required></select></label>',
    '<button type="submit" class="primary" data-copy="save"></button></form>',
    '<p class="experiments-status" role="status"></p>',
    '<button type="button" class="quiet experiments-retry" data-copy="retry" hidden></button>',
    '<table><thead><tr><th scope="col" data-copy="approach"></th><th scope="col" data-copy="contacts"></th>',
    '<th scope="col" data-copy="responses"></th><th scope="col" data-copy="meetings"></th>',
    '<th scope="col" class="experiments-rate"><span class="operations-sr" data-copy="rate"></span></th>',
    '</tr></thead><tbody></tbody></table><p class="experiments-note" data-copy="note"></p>'
  ].join('');
  const form = root.querySelector('form');
  const add = root.querySelector('[aria-controls="experiments-form"]');
  const select = form.elements.reference;
  const variant = form.elements.variant;
  const submit = form.querySelector('button');
  const table = root.querySelector('table');
  const status = root.querySelector('[role="status"]');
  const retry = root.querySelector('.experiments-retry');
  const badge = root.querySelector('.experiments-state');
  let version = 0;
  let model = null;
  let message = '';
  let busy = false;

  function setStatus(key) {
    message = key;
    status.textContent = key ? t(key) : '';
  }

  function setForm(open) {
    form.hidden = !open;
    add.setAttribute('aria-expanded', String(open));
  }

  function render() {
    for (const item of root.querySelectorAll('[data-copy]')) item.textContent = t(item.dataset.copy);
    status.textContent = message ? t(message) : '';

    table.hidden = !model;
    badge.hidden = !model?.groups.some(group => group.contacts);
    add.disabled = busy || !model?.available.length;
    submit.disabled = busy;
    if (!model) return;
    table.tBodies[0].replaceChildren(...model.groups.map(resultRow));

    const chosen = select.value;
    const approach = variant.value;
    select.replaceChildren(new Option(t('select'), ''), ...model.available.map(item =>
      new Option(item.company ? [item.company,item.name].filter(Boolean).join(' · ') : item.name, item.reference)));
    select.value = model.available.some(item => item.reference === chosen) ? chosen : '';
    variant.replaceChildren(new Option(t('select'),''), new Option(t('call'),'call'), new Option(t('whatsapp'),'whatsapp'));
    variant.value = approach;
  }

  async function refresh(successMessage='') {
    const request = ++version;
    busy = true;
    retry.hidden = true;
    setStatus('loading');
    render();
    try {
      const response = await api('experiments');
      if (request !== version) return;
      model = response;
      if (!model.available.length) setForm(false);
      setStatus(successMessage || (model.available.length ? '' : 'none'));
    } catch {
      if (request !== version) return;
      model = null;
      setForm(false);
      setStatus('failure');
      retry.hidden = false;
    } finally {
      if (request === version) {
        busy = false;
        render();
      }
    }
  }

  add.addEventListener('click', () => {
    setForm(form.hidden);
    if (!form.hidden) select.focus();
  });
  retry.addEventListener('click', () => refresh());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    const request = ++version;
    busy = true;
    setStatus('');
    render();
    try {
      await api('experiment-assignment', 'POST', {reference:select.value, variant:variant.value});
      if (request !== version) return;
      form.reset();
      setForm(false);
      await refresh('saved');
      if (model) (add.disabled ? root.querySelector('h2') : add).focus();
    } catch {
      if (request !== version) return;
      busy = false;
      setStatus('saveFailure');
      render();
    }
  });
  document.addEventListener('caos-language-change', render);
  render();

  return {
    refresh,
    reset() {
      version++;
      busy = false;
      model = null;
      retry.hidden = true;
      setStatus('');
      setForm(false);
      select.replaceChildren();
      variant.replaceChildren();
      table.tBodies[0].replaceChildren();
      render();
    }
  };
}
