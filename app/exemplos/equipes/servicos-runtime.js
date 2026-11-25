import data from './servicos-dados.js';
const scope = document.querySelector('[data-workspace]');
if (scope) init(scope);

function init(root) {
  const brand = data.find(entry => entry.slug === document.body.dataset.campaignDemo);
  const config = brand.pages.find(page => page.view === root.dataset.workspace);
  const storageKey = 'caos-equipes-v1:' + brand.slug + ':' + config.view;
  let selected = config.data[0][0];
  let filter = '';
  let stored = readStorage();
  let sticky = false;
  const get = key => root.querySelector(key);
  const collection = get('[data-collection]');
  const drawer = get('[data-drawer]');
  const notice = get('[data-notice]');
  const tabs = get('[data-filters]');
  const proof = get('[data-proof]');

  function readStorage() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
  }

  function text(tag, value, css) {
    const el = document.createElement(tag);
    if (css) el.className = css;
    el.textContent = value;
    return el;
  }

  function items() {
    return config.data.map(([id, name, meta, initial, context, detail, seed]) => {
      const known = stored[id] || {};
      return {id, name, meta, context, detail, status: known.status || initial, fields: {...seed, ...known.fields}, note: known.note};
    });
  }

  function chip(status) {
    const el = text('span', status, 'chip');
    el.dataset.level = config.labels.indexOf(status);
    return el;
  }

  function control(label, callback, css) {
    const button = text('button', label, css);
    button.type = 'button';
    button.addEventListener('click', callback);
    return button;
  }

  function pick(row, css = 'record') {
    const button = control('', () => {
      selected = row.id;
      show();
      const target = root.querySelector('[data-record="' + row.id + '"]');
      if (matchMedia('(max-width:740px)').matches) {
        drawer.scrollIntoView({block:'start'});
        get('#item-title').focus({preventScroll:true});
      } else target?.focus();
    }, css);
    button.dataset.record = row.id;
    button.setAttribute('aria-pressed', String(selected === row.id));
    const heading = text('strong', row.name);
    const meta = text('small', row.meta);
    const contents = document.createElement('span');
    contents.className = 'record-copy';
    contents.append(heading, meta);
    button.append(contents, chip(row.status), text('span', row.id, 'record-code'));
    if (config.view === 'tickets') {
      button.append(text('span', row.fields.prioridade, row.fields.prioridade === 'Urgente' ? 'priority urgent' : 'priority'));
    }
    return button;
  }

  function group(name, data, css = 'lane') {
    const section = document.createElement('section');
    section.className = css;
    const title = document.createElement('h3');
    title.append(text('span', name), text('small', String(data.length), 'lane-count'));
    section.append(title);
    section.append(...data.map(row => pick(row)));
    if (!data.length) section.append(text('p', 'Nenhum item', 'empty'));
    return section;
  }

  function list(rows) {
    const view = config.view;
    if (!rows.length) return [text('p', 'Nenhum item neste estado. Escolha outro filtro.', 'empty block')];
    if (view === 'board' || view === 'queue') {
      const labels = filter ? [filter] : config.labels;
      return labels.map(label => group(label, rows.filter(r => r.status === label)));
    }
    if (view === 'schedule') {
      const output = [];
      const free = rows.filter(r => r.status === 'Liberada');
      const dates = ['Terça · 09h','Quarta · 12h','Quinta · 18h'];
      if (free.length) output.push(group('Ainda sem horário', free, 'lane backlog'));
      const booked = rows.filter(r => r.status === 'Programada');
      for (const date of dates) {
        const children = booked.filter(r => r.fields.horario === date);
        output.push(group(date, children, 'lane slot'));
      }
      return output;
    }
    if (view === 'roommap') {
      return ['Térreo','Piso 1'].filter(floor => rows.some(row => row.meta.startsWith(floor)))
        .map(floor => group(floor, rows.filter(row => row.meta.startsWith(floor)), 'lane floor'));
    }
    if (view === 'ledger' || view === 'arrivals') {
      const head = document.createElement('div');
      head.className = 'ledger-head';
      const pair = view === 'ledger' ? ['Retorno e data','Situação'] : ['Reserva e hora','Situação'];
      head.append(...pair.map(label => text('span', label)));
      return [head, ...rows.map(row => pick(row, 'record ledger-row'))];
    }
    if (view === 'tickets') {
      return [...rows].sort((a, b) => Number(b.fields.prioridade === 'Urgente') - Number(a.fields.prioridade === 'Urgente')).map(row => pick(row));
    }
    return rows.map(row => pick(row));
  }

  function rules(row, draft, checks) {
    switch (config.view) {
      case 'board':
        return {status:draft.etapa, note:'Responsável · ' + draft.dono};
      case 'review':
        if (draft.decisao === 'Aprovada' && checks !== 2) return {error:'Confira texto e versão visual antes de aprovar.'};
        return {status:draft.decisao, note:draft.decisao === 'Aprovada' ? 'Texto e versão visual conferidos.' : 'Ajuste em ' + draft.motivo.toLowerCase() + '.'};
      case 'schedule':
        if (items().some(item => item.id !== row.id && item.fields.canal === draft.canal && item.fields.horario === draft.horario)) return {error:'Já há uma peça programada nesse canal e horário. Escolha outra janela.'};
        return {status:'Programada', note:draft.canal + ' · ' + draft.horario};
      case 'queue':
        if (items().some(item => item.id !== row.id && item.status === 'Em sala' && item.fields.sala === draft.sala)) return {error:'Essa sala está em uso. Selecione outra sala.'};
        return {status:'Em sala', note:'Recepção encaminhou para ' + draft.sala + '.'};
      case 'ledger':
        return {status:draft.resposta, note:'Contato registrado por ' + draft.origem + '.'};
      case 'handover':
        if (checks !== 1) return {error:'Confirme que a equipe recebeu a pendência.'};
        return {status:'Repassado', note:draft.equipe + ' recebeu a pendência.'};
      case 'arrivals':
        if (!row.fields.liberado) return {error:'O quarto está em limpeza. Aguarde a liberação para registrar a chegada.'};
        if (checks !== 1) return {error:'Marque a conferência de cadastro antes de entregar a chave.'};
        return {status:'Chegou', note:'Chave entregue em ' + draft.chave.toLowerCase() + '.'};
      case 'roommap':
        if (checks !== 3) return {error:'Conclua as três conferências para liberar o quarto.'};
        return {status:'Liberado', note:'Enxoval, banheiro e chave conferidos.'};
      case 'tickets':
        if (draft.andamento === 'Resolvido' && checks !== 1) return {error:'Registre a verificação final antes de resolver o chamado.'};
        return {status:draft.andamento, note:draft.prioridade + ' · ' + (draft.andamento === 'Resolvido' ? 'verificação final registrada' : 'equipe acionada') + '.'};
    }
  }

  function editable(row) {
    const terminal = {queue:'Encerrado',handover:'Repassado',arrivals:'Chegou',roommap:'Liberado',tickets:'Resolvido'};
    if (config.view === 'arrivals' && row.fields.liberado === false) return 'A equipe de limpeza ainda não liberou o quarto.';
    return row.status === terminal[config.view] ? 'Esta etapa está concluída. Selecione outro item para experimentar.' : '';
  }

  function layoutDetail(row) {
    drawer.replaceChildren();
    if (!row) return;
    const heading = text('h2', row.name);
    heading.id = 'item-title';
    heading.tabIndex = -1;
    const top = text('div', '', 'drawer-top');
    top.append(text('span', row.id, 'mono'), chip(row.status));
    drawer.append(top, heading, text('p', row.context, 'context'), text('p', row.detail, 'brief'));
    if (row.note) drawer.append(text('p', 'Último registro · ' + row.note, 'readback'));
    const locked = editable(row);
    if (locked) {
      drawer.append(text('p', locked, 'note'));
      return;
    }
    if (config.view === 'queue' && row.status === 'Em sala') {
      drawer.append(control('Encerrar atendimento', () => {
        saveRecord(row, row.fields, {status:'Encerrado', note:'Saída registrada pela recepção.'}, 'Atendimento encerrado');
      }, 'primary'));
      return;
    }
    const form = document.createElement('form');
    form.dataset.operation = config.view;
    const error = text('p', '', 'error');
    error.setAttribute('role','status');
    const controls = {};
    for (const [key, label, choices] of config.fields) {
      const field = text('label', label, 'field');
      const list = document.createElement('select');
      list.name = key;
      const blank = text('option', 'Selecione');
      blank.value = '';
      list.append(blank, ...choices.map(choice => text('option', choice)));
      list.required = key !== 'motivo';
      if (row.fields[key]) list.value = row.fields[key];
      controls[key] = list;
      field.append(list);
      form.append(field);
    }
    const checks = (config.checks ?? []).map(label => {
      const item = text('label','','check');
      const input = document.createElement('input');
      input.type = 'checkbox';
      item.append(input, text('span', label));
      form.append(item);
      return input;
    });
    if (controls.motivo) {
      function updateReason() {
        const active = controls.decisao.value === 'Ajuste solicitado';
        controls.motivo.closest('label').hidden = !active;
        controls.motivo.disabled = !active;
        controls.motivo.required = active;
      }
      controls.decisao.addEventListener('change', updateReason);
      updateReason();
    }
    const submit = text('button', config.action, 'primary');
    submit.type = 'submit';
    form.append(text('p', config.detail, 'help'), error, submit);
    form.addEventListener('change', () => { error.textContent = ''; });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const fields = Object.fromEntries(new FormData(form));
      const update = rules(row, fields, checks.filter(box => box.checked).length);
      if (update.error) { error.textContent = update.error; return; }
      saveRecord(row, fields, update, config.result);
    });
    drawer.append(form);
  }

  function saveRecord(row, fields, update, result) {
    delete stored[row.id];
    stored[row.id] = {status:update.status, fields, note:update.note};
    try { localStorage.setItem(storageKey, JSON.stringify(stored)); } catch { sticky = true; }
    selected = row.id;
    filter = '';
    show();
    notice.textContent = result + ': ' + row.name + '. ' + update.note;
    if (sticky) notice.textContent += ' Alteração mantida enquanto esta página estiver aberta.';
    get('#item-title')?.focus({preventScroll:true});
  }

  function show() {
    const current = items();
    const filtered = current.filter(row => !filter || row.status === filter);
    tabs.replaceChildren(...['', ...config.labels].map(value => {
      const count = current.filter(row => !value || value === row.status).length;
      const item = control((value || 'Todos') + ' · ' + count, () => {
        filter = value;
        if (!items().find(row => row.id === selected && (!filter || row.status === filter))) {
          selected = items().find(row => !filter || row.status === filter)?.id;
        }
        show();
        tabs.querySelector('[aria-pressed=true]').focus();
      });
      item.setAttribute('aria-pressed',String(filter === value));
      return item;
    }));
    collection.replaceChildren(...list(filtered));
    const active = filtered.find(row => row.id === selected);
    layoutDetail(active);
    drawer.hidden = !active;
    const total = current.length;
    get('[data-total]').textContent = total + ' ' + config.noun;
    get('[data-progress]').textContent = current.filter(row => row.status === config.labels.at(-1)).length + ' ' + config.labels.at(-1).toLowerCase();
    const latest = Object.entries(stored).at(-1);
    proof.hidden = !latest;
    if (latest) {
      const [id, record] = latest;
      const row = current.find(item => item.id === id);
      if (!row) { proof.hidden = true; return; }
      const summary = config.title + ' · ' + row.name + ' (' + id + ') · ' + record.status + ' · ' + record.note + ' · Demonstração local.';
      get('[data-proof-text]').textContent = summary;
      get('[data-copy]').onclick = async () => {
        try { await navigator.clipboard.writeText(summary); notice.textContent = 'Resumo copiado.'; }
        catch {
          const range = document.createRange();
          range.selectNodeContents(get('[data-proof-text]'));
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          notice.textContent = 'Resumo selecionado. Use o comando de cópia do navegador.';
        }
      };
    }
  }

  get('[data-reset]').addEventListener('click', () => {
    stored = {};
    try { localStorage.removeItem(storageKey); } catch {}
    selected = config.data[0][0];
    filter = '';
    notice.textContent = 'Demonstração restaurada.';
    show();
  });
  show();
}
