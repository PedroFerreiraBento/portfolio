const view = document.body.dataset.view;
const form = document.querySelector('[data-form]');
const key = 'caos-norte-servico-demo-v1';
const labels = {fila:'A planejar', agenda:'Planejada', kit:'Kit separado', fim:'Concluída'};
const catalog = {
  F12: ['Filtro F12','Bancada A'],
  R8: ['Rolamento R8','Bancada B'],
  C3: ['Correia C3','Bancada B'],
};
const initial = {
  stock: {F12: 6, R8: 4, C3: 0},
  jobs: [
    {id:'NS-104', name:'Mercado Horizonte', service:'Revisão do equipamento', state:'fila', parts:{F12:2}},
    {id:'NS-105', name:'Oficina Rua 12', service:'Manutenção programada', state:'agenda', tech:'Lia', time:'10h', parts:{F12:1,R8:2}},
    {id:'NS-106', name:'Estúdio Arco', service:'Ajuste em visita', state:'kit', tech:'Rui', time:'13h30', parts:{F12:1}},
    {id:'NS-107', name:'Depósito Leste', service:'Troca de conjunto', state:'agenda', tech:'Bia', time:'15h', parts:{C3:1}},
  ],
};

if (form) {
  const by = name => document.querySelector('[data-' + name + ']');
  const node = (tag, content, cls) => {
    const el = document.createElement(tag);
    if (content !== undefined) el.textContent = content;
    if (cls) el.className = cls;
    return el;
  };
  const visitTimes = ['08h30','10h','13h30','15h'];
  const submit = by('action');
  const status = by('status');
  let state = read();
  let selected = {triagem:'NS-104',pecas:'NS-105',fechamento:'NS-106'}[view];
  const active = () => state.jobs.find(job => job.id === selected);

  function read(fallback = initial) {
    try { return JSON.parse(localStorage.getItem(key)) || structuredClone(initial); }
    catch { return structuredClone(fallback); }
  }

  function save(message) {
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { message += ' Alteração disponível somente nesta página.'; }
    render();
    status.textContent = message;
  }

  function details(list, fields) {
    list.replaceChildren(...fields.map(([label, value]) => {
      const row = node('div');
      row.append(node('dt', label), node('dd', value));
      return row;
    }));
  }

  function shortage(job) {
    return Object.entries(job.parts).some(([code, quantity]) => state.stock[code] < quantity);
  }

  function render() {
    const job = active();
    by('selected').textContent = job.id + ' · ' + job.name;
    by('summary').replaceChildren(...Object.entries(labels).map(([stateName, label]) => {
      const item = node('div');
      item.append(node('strong', state.jobs.filter(item => item.state === stateName).length), node('span', label));
      return item;
    }));
    by('jobs').replaceChildren(...state.jobs.map(row => {
      const button = node('button', undefined, 'job');
      button.type = 'button';
      button.dataset.job = row.id;
      button.setAttribute('aria-pressed', String(row.id === selected));
      const name = node('div');
      name.append(node('strong', row.name), node('small', row.id + ' · ' + row.service));
      button.append(name, node('span',labels[row.state],'badge ' + row.state));
      return button;
    }));

    if (view === 'triagem') {
      form.elements.tecnico.value = job.tech || 'Lia';
      form.elements.hora.value = job.time || '08h30';
      submit.disabled = ['kit','fim'].includes(job.state);
      by('schedule').replaceChildren(...state.jobs.filter(row => row.time && row.state !== 'fim').sort((a,b) => visitTimes.indexOf(a.time) - visitTimes.indexOf(b.time)).map(row => {
        const line = node('li');
        line.append(node('time',row.time), node('strong',row.tech), node('span',row.name));
        return line;
      }));
    }
    if (view === 'pecas') {
      by('stock').replaceChildren(...Object.entries(catalog).map(([code,[name, location]]) => {
        const item = node('article');
        item.append(node('p', location), node('h3', name), node('strong', String(state.stock[code]) + ' disponíveis', state.stock[code] ? '' : 'warning'));
        return item;
      }));
      const kit = node('dl', undefined, 'kit-table');
      details(kit,Object.entries(job.parts).map(([code,qty]) => [catalog[code][0],qty + (qty === 1 ? ' unidade' : ' unidades')]));
      by('kit').replaceChildren(kit);
      const note = job.state === 'agenda' && shortage(job) ? 'Saldo insuficiente para esta ordem.' :
        job.state === 'fila' ? 'Planeje a visita antes de separar o kit.' :
        job.state === 'fim' ? 'Material registrado no histórico.' : '';
      if (note) by('kit').append(node('p',note, 'warning'));
      submit.disabled = job.state !== 'agenda' || shortage(job);
      by('return').hidden = job.state !== 'kit';
    }
    if (view === 'fechamento') {
      form.hidden = job.state === 'fim';
      submit.disabled = job.state !== 'kit';
      by('receipt').hidden = job.state !== 'fim';
      if (job.state === 'fim') details(by('history'), report(job));
      if (job.state === 'fila' || job.state === 'agenda') status.textContent = 'Planeje a visita e confirme a separação antes de concluir.';
    }
  }

  function report(job) {
    const parts = Object.entries(job.parts).map(([code,qty]) => qty + ' × ' + catalog[code][0]).join(', ');
    return [['Ordem',job.id],['Local',job.name],['Atendimento',job.tech + ' · ' + job.time],['Material',parts],['Resultado',job.result]];
  }

  by('jobs').addEventListener('click', event => {
    const button = event.target.closest('[data-job]');
    if (!button) return;
    selected = button.dataset.job;
    form.reset();
    status.textContent = '';
    render();
    by('jobs').querySelector('[aria-pressed=true]').focus();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    state = read(state);
    const job = active();
    if (view === 'triagem' && ['fila','agenda'].includes(job.state)) {
      const tech = form.elements.tecnico.value;
      const time = form.elements.hora.value;
      const clash = state.jobs.some(other => other !== job && other.state !== 'fim' && other.tech === tech && other.time === time);
      if (clash) { status.textContent = 'Este técnico já tem uma visita nesse horário. Escolha outro horário ou profissional.'; return; }
      Object.assign(job, {tech, time, state:'agenda'});
      save('Visita salva na agenda.');
    }
    if (view === 'pecas' && job.state === 'agenda' && !shortage(job)) {
      for (const [code,qty] of Object.entries(job.parts)) state.stock[code] -= qty;
      job.state = 'kit';
      save('Kit separado. Saldo atualizado.');
    }
    if (view === 'fechamento' && job.state === 'kit' && form.elements.confirmar.checked) {
      job.state = 'fim';
      job.result = form.elements.resultado.value;
      save('Ordem concluída e histórico registrado.');
      by('receipt').focus();
    }
  });

  by('return')?.addEventListener('click', () => {
    state = read(state);
    const job = active();
    if (job.state !== 'kit') return;
    for (const [code,qty] of Object.entries(job.parts)) state.stock[code] += qty;
    job.state = 'agenda';
    save('Material devolvido. Saldo atualizado.');
  });

  by('copy')?.addEventListener('click',async () => {
    const text = ['Norte Serviço · demonstração', ...report(active()).map(([label, value]) => label + ': ' + value)].join('\n');
    try { await navigator.clipboard.writeText(text); status.textContent = 'Resumo copiado.'; }
    catch {
      const range = document.createRange();
      range.selectNodeContents(by('history'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Use a opção Copiar do seu dispositivo.';
    }
  });

  by('reset').addEventListener('click', () => { by('reset-confirm').hidden = false; by('reset-yes').focus(); });
  by('reset-no').addEventListener('click', () => { by('reset-confirm').hidden = true; by('reset').focus(); });
  by('reset-yes').addEventListener('click', () => {
    state = structuredClone(initial);
    form.reset();
    by('reset-confirm').hidden = true;
    save('Demonstração reiniciada.');
    by('reset').focus();
  });
  addEventListener('storage', event => {
    if (event.key === key) { state = read(); render(); }
  });
  render();
}
