const form = document.querySelector('[data-flow]');

if (form) {
  const controls = form.elements;
  const fields = form.querySelector('[data-fields]');
  const hours = form.querySelector('[data-hours]');
  const receipt = form.querySelector('[data-receipt]');
  const summary = form.querySelector('[data-summary]');
  const status = form.querySelector('[data-status]');
  const submit = form.querySelector('[data-submit]');
  const schedules = {
    'Terça-feira': [9, 10, 11, 14, 15, 16, 17],
    'Quarta-feira': [10, 11, 14, 16, 17, 18],
    'Sábado': [9, 10, 11, 12, 14, 15],
  };
  const capacities = {'Mesa coletiva': 8, 'Roda de conversa': 10, Fileiras: 12};
  const mode = form.dataset.flow;
  const hourLabel = hour => String(hour).padStart(2, '0') + 'h';

  function refreshAvailability() {
    const open = schedules[controls.dia.value];
    const duration = mode === 'blocos' ? Number(controls.duracao.value[0]) : 1;
    const available = open.filter(hour => Array.from({length: duration}, (_, offset) => hour + offset).every(slot => open.includes(slot)));
    const selected = form.querySelector('[name=horario]:checked')?.value;
    hours.replaceChildren(...available.map(hour => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'horario';
      input.value = hourLabel(hour) + '–' + hourLabel(hour + duration);
      input.required = true;
      input.checked = input.value === selected;
      label.append(input, ' ' + input.value);
      return label;
    }));
    const tip = form.querySelector('[data-tip]');
    if (tip) tip.textContent = available.length ? 'Os horários acima acomodam o bloco inteiro.' : 'Nenhum bloco cabe neste dia. Experimente outro dia ou uma duração menor.';
    submit.disabled = available.length === 0;
  }

  function refreshLayout() {
    if (mode !== 'encontro') return;
    const seats = capacities[controls.layout.value];
    controls.pessoas.max = seats;
    const layout = form.querySelector('[data-layout]');
    layout.dataset.arrangement = controls.layout.selectedIndex;
    layout.replaceChildren(...Array.from({length: seats}, (_, index) => {
      const chair = document.createElement('i');
      if (controls.layout.value === 'Roda de conversa') {
        const angle = index * 2 * Math.PI / seats;
        chair.style.setProperty('--x', Math.cos(angle).toFixed(3));
        chair.style.setProperty('--y', Math.sin(angle).toFixed(3));
      }
      return chair;
    }));
    form.querySelector('[data-capacity]').textContent = 'Até ' + seats + ' pessoas nesta disposição.';
  }

  form.addEventListener('change', event => {
    if (['dia', 'duracao'].includes(event.target.name)) refreshAvailability();
    if (event.target.name === 'layout') refreshLayout();
  });

  let copyText = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(form);
    const rows = [['Espaço', values.get('sala') || (mode === 'blocos' ? 'Cabine Onda' : 'Sala Oficina')]];
    if (mode === 'encontro') rows.push(['Disposição', values.get('layout')], ['Pessoas', values.get('pessoas')]);
    rows.push(['Dia de exemplo', values.get('dia')], ['Horário de exemplo', values.get('horario')]);
    summary.replaceChildren(...rows.map(([key, value]) => {
      const row = document.createElement('div');
      const label = document.createElement('dt');
      const detail = document.createElement('dd');
      label.textContent = key;
      detail.textContent = value;
      row.append(label, detail);
      return row;
    }));
    copyText = ['Pátio Comum · PC-DEMO-001', ...rows.map(([key, value]) => key + ': ' + value)].join('\n');
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  function edit() {
    fields.hidden = false;
    receipt.hidden = true;
    status.textContent = '';
    fields.querySelector('input:checked, select').focus();
  }

  form.querySelector('[data-edit]').addEventListener('click', edit);
  form.addEventListener('reset', () => {
    queueMicrotask(() => { refreshLayout(); refreshAvailability(); edit(); });
  });
  form.querySelector('[data-copy]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      status.textContent = 'Resumo copiado.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Use a opção Copiar do seu dispositivo.';
    }
  });
  refreshLayout();
  refreshAvailability();
}
