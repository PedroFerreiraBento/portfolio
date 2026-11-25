import { start, money, escape, option, renderReceipt } from '../commercial-kernel.js';

const fleet = {
  CMP: {
    name: 'Placa compactadora',
    group: 'Compactação',
    units: 3,
    price: 18500,
    requirements: ['Base sem trincas', 'Alça firme', 'Nível de combustível registrado'],
  },
  LAV: {
    name: 'Lavadora de pressão',
    group: 'Limpeza',
    units: 2,
    price: 11200,
    requirements: ['Mangueira e bico presentes', 'Cabo sem cortes', 'Carcaça sem danos'],
  },
  GER: {
    name: 'Gerador portátil',
    group: 'Energia',
    units: 2,
    price: 22500,
    requirements: ['Tomadas intactas', 'Estrutura e alças firmes', 'Nível de combustível registrado'],
  },
};
const initial = {
  next: 22,
  bookings: [
    { id: 'PL-021', item: 'CMP', quantity: 1, from: 1, to: 4, phase: 'Em uso' },
    { id: 'PL-020', item: 'LAV', quantity: 1, from: 3, to: 7, phase: 'Reservada' },
    { id: 'PL-019', item: 'GER', quantity: 1, from: 1, to: 2, phase: 'Em uso' },
  ],
};
const day = (date) => String(13 + Number(date)).padStart(2, '0') + '/dez';
const dates = Array.from({ length: 10 }, (_, i) => [String(i + 1), day(i + 1)]);
const products = Object.entries(fleet).map(([id, item]) => [id, item.name]);
const reply = (message, persist = false, focus) => ({ message, persist, focus });
const problem = (message) => ({ message, error: true });
const period = (data) => ({ from: Number(data.get('inicio')), to: Number(data.get('fim')) });
const dateFields = (from, to) =>
  '<label>Retirada<select name="inicio">' +
  option(dates, String(from)) +
  '</select></label><label>Devolução<select name="fim">' +
  option(dates, String(to)) +
  '</select></label>';
const calculated = (item, quantity, from, to) => fleet[item].price * quantity * (to - from + 1);
const isHeld = (item) => item.phase === 'Reservada' || item.phase === 'Em uso';
const available = (state, item, from, to) => {
  const maintenance = state.bookings.reduce(
    (total, booking) =>
      total + (booking.item === item && booking.phase === 'Manutenção' ? booking.quantity : 0),
    0
  );
  const byDay = Array.from({ length: to - from + 1 }, (_, i) => from + i).map((date) =>
    state.bookings
      .filter(
        (booking) => booking.item === item && isHeld(booking) && date >= booking.from && date <= booking.to
      )
      .reduce((total, booking) => total + booking.quantity, 0)
  );
  return Math.max(0, fleet[item].units - maintenance - Math.max(...byDay));
};
function receipt(booking) {
  return renderReceipt(booking.id, [
    ['Equipamento', fleet[booking.item].name],
    ['Unidades', booking.quantity],
    ['Período de exemplo', day(booking.from) + ' a ' + day(booking.to)],
    ['Situação', booking.phase],
    ['Diárias previstas', money(calculated(booking.item, booking.quantity, booking.from, booking.to))],
    ...(booking.condition ? [['Condição registrada', booking.condition]] : []),
  ]);
}
const disponibilidade = {
  create: () => ({ from: 2, to: 4 }),
  render(state, session) {
    const rows = Object.entries(fleet)
      .map(([id, item]) => {
        const free = available(state, id, session.from, session.to);
        const calendar = dates
          .map(([num, date]) => {
            const left = available(state, id, Number(num), Number(num));
            return (
              '<span data-free="' +
              (left > 0) +
              '" title="' +
              date +
              ' · ' +
              left +
              ' livres">' +
              left +
              '</span>'
            );
          })
          .join('');
        return (
          '<article class="fleet-row"><div><h3>' +
          item.name +
          '</h3><small>' +
          item.group +
          ' · ' +
          id +
          '</small></div><p class="free-count"><strong>' +
          free +
          '</strong><small>livres</small></p><div class="calendar-counts" aria-label="Unidades livres por dia">' +
          calendar +
          '</div><a class="text-link" href="reserva.html?item=' +
          id +
          '&amp;inicio=' +
          session.from +
          '&amp;fim=' +
          session.to +
          '">Simular reserva</a></article>'
        );
      })
      .join('');
    return (
      '<section class="panel calendar-panel"><div class="calendar-header"><div><h2>Mapa de disponibilidade</h2><p class="muted">A menor quantidade livre entre ' +
      day(session.from) +
      ' e ' +
      day(session.to) +
      ' define o saldo para o período inteiro.</p></div><form data-action="filter"><div class="inputs">' +
      dateFields(session.from, session.to) +
      '<button class="primary" type="submit">Consultar</button></div></form></div><div class="days" aria-hidden="true">' +
      dates.map(([, date]) => '<small>' + date.split('/')[0] + '</small>').join('') +
      '</div>' +
      rows +
      '</section>'
    );
  },
  handle(action, data, state, session) {
    if (action !== 'filter') return;
    const range = period(data);
    if (range.to < range.from) return problem('A devolução deve ser no dia da retirada ou depois.');
    Object.assign(session, range);
    return reply('Disponibilidade atualizada para ' + day(range.from) + ' a ' + day(range.to) + '.');
  },
};
const reserva = {
  create: () => {
    const params = new URLSearchParams(location.search);
    const item = fleet[params.get('item')] ? params.get('item') : 'CMP';
    let from = Number(params.get('inicio') || 2);
    let to = Number(params.get('fim') || 4);
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to > 10 || to < from)
      [from, to] = [2, 4];
    return { item, quantity: 1, from, to, id: null };
  },
  render(state, session) {
    const booking = state.bookings.find((item) => item.id === session.id);
    const free = available(state, session.item, session.from, session.to);
    const count = session.to - session.from + 1;
    return (
      '<div class="shell-grid booking-grid"><section class="panel"><h2>Montar uma reserva</h2><form data-action="estimate" data-recompute="book" data-recompute-message="Recalcule a reserva para atualizar o saldo e o total."><div class="inputs"><label>Equipamento<select name="equipamento">' +
      option(products, session.item) +
      '</select></label><label>Unidades<input name="unidades" type="number" min="1" max="9" required inputmode="numeric" value="' +
      session.quantity +
      '"></label>' +
      dateFields(session.from, session.to) +
      '</div><div class="actions"><button class="primary" type="submit">Calcular reserva</button></div></form></section><section class="board allocation"><h2>' +
      fleet[session.item].name +
      '</h2><dl><div><dt>Período</dt><dd>' +
      day(session.from) +
      ' a ' +
      day(session.to) +
      '</dd></div><div><dt>Diárias</dt><dd>' +
      count +
      '</dd></div><div><dt>Unidades livres</dt><dd>' +
      free +
      '</dd></div><div><dt>Total previsto</dt><dd>' +
      money(calculated(session.item, session.quantity, session.from, session.to)) +
      '</dd></div></dl><div class="actions"><button class="primary" type="button" data-action="book"' +
      (session.quantity > free ? ' disabled' : '') +
      '>Confirmar reserva</button></div>' +
      (session.quantity > free
        ? '<p class="info">A quantidade solicitada supera o saldo. Ajuste o período ou as unidades.</p>'
        : '') +
      '</section></div>' +
      (booking
        ? receipt(booking) +
          (booking.phase === 'Reservada'
            ? '<div class="actions"><button class="secondary" type="button" data-action="pickup">Registrar retirada</button><button class="quiet" type="button" data-action="cancel">Cancelar reserva</button></div>'
            : '')
        : '')
    );
  },
  handle(action, data, state, session) {
    if (action === 'estimate') {
      const range = period(data);
      if (range.to < range.from) return problem('A devolução deve ser no dia da retirada ou depois.');
      Object.assign(session, range, { item: data.get('equipamento'), quantity: Number(data.get('unidades')) });
      return reply('Reserva recalculada.');
    }
    if (action === 'book') {
      if (available(state, session.item, session.from, session.to) < session.quantity)
        return problem('O estoque disponível mudou. Recalcule a reserva.');
      const id = 'PL-' + String(state.next++).padStart(3, '0');
      const { item, quantity, from, to } = session;
      state.bookings.unshift({ id, item, quantity, from, to, phase: 'Reservada' });
      session.id = id;
      return reply('Reserva ' + id + ' confirmada na simulação.', true, '[data-copy]');
    }
    const booking = state.bookings.find((item) => item.id === session.id && item.phase === 'Reservada');
    if (!booking) return;
    if (action === 'pickup') {
      booking.phase = 'Em uso';
      return reply('Retirada registrada. O equipamento aparece em Vistoria de retorno.', true, '[data-copy]');
    }
    if (action === 'cancel') {
      booking.phase = 'Cancelada';
      return reply('Reserva cancelada. As unidades voltaram ao saldo.', true, '[data-copy]');
    }
  },
};
const vistoria = {
  create: (state) => ({ selected: state.bookings.find((booking) => booking.phase === 'Em uso')?.id }),
  render(state, session) {
    const list = state.bookings.filter((item) => ['Em uso', 'Liberada', 'Manutenção'].includes(item.phase));
    if (!list.length)
      return '<section class="panel"><h2>Nenhum equipamento em uso</h2><p class="muted">Registre uma retirada na página de reserva para começar.</p></section>';
    const booking = list.find((item) => item.id === session.selected) || list[0];
    const items = list
      .map(
        (item) =>
          '<li><button class="inspection-select" type="button" data-action="choose" value="' +
          item.id +
          '" aria-pressed="' +
          (item.id === booking.id) +
          '"><strong>' +
          item.id +
          '</strong><span>' +
          fleet[item.item].name +
          '</span><small>' +
          escape(item.phase) +
          '</small></button></li>'
      )
      .join('');
    const checks = fleet[booking.item].requirements
      .map(
        (item, index) =>
          '<label class="tick"><input type="checkbox" name="item" value="' + index + '">' + item + '</label>'
      )
      .join('');
    return (
      '<div class="inspection-grid"><section class="panel"><h2>Equipamentos em retorno</h2><ul class="clean">' +
      items +
      '</ul></section><section class="board checklist"><h2>Ficha ' +
      booking.id +
      '</h2>' +
      (booking.phase === 'Em uso'
        ? '<form data-action="check"><fieldset class="fieldset"><legend>Marque os itens em conformidade</legend>' +
          checks +
          '</fieldset><div class="inputs"><label>Condição final<select name="condicao">' +
          option(
            [
              ['Operacional', 'Operacional'],
              ['Requer reparo', 'Requer reparo'],
            ],
            'Operacional'
          ) +
          '</select></label></div><div class="actions"><button class="primary" type="submit">Registrar devolução</button></div></form>'
        : '<p class="info">Vistoria concluída. ' +
          (booking.phase === 'Manutenção'
            ? 'Equipamento em manutenção, fora do saldo de locação.'
            : 'Equipamento liberado para locação.') +
          '</p>') +
      '</section></div>' +
      receipt(booking)
    );
  },
  handle(action, data, state, session) {
    if (action === 'choose') {
      session.selected = data.get('value');
      return reply('', false, '[aria-pressed=true]');
    }
    const booking = state.bookings.find((item) => item.id === session.selected && item.phase === 'Em uso');
    if (action !== 'check' || !booking) return;
    const condition = data.get('condicao');
    const complete = data.getAll('item').length === fleet[booking.item].requirements.length;
    if (condition === 'Operacional' && !complete)
      return problem('Confira todos os itens para liberar ou encaminhe para reparo.');
    booking.condition = condition;
    booking.phase = condition === 'Operacional' ? 'Liberada' : 'Manutenção';
    return reply('Devolução registrada · ' + booking.phase + '.', true, '[data-copy]');
  },
};
start({ key: 'parque', initial, views: { disponibilidade, reserva, vistoria } });
