import { start, money, escape, option, renderReceipt } from '../commercial-kernel.js';

const products = [
  {
    id: 'CIM-50',
    name: 'Cimento CP II',
    unit: 'sacos de 50 kg',
    stock: 34,
    minimum: 12,
    price: 3890,
    aisle: 'A · 01',
  },
  {
    id: 'ARG-20',
    name: 'Argamassa AC II',
    unit: 'sacos de 20 kg',
    stock: 11,
    minimum: 18,
    price: 2790,
    aisle: 'A · 02',
  },
  {
    id: 'PVC-32',
    name: 'Tubo PVC 32 mm',
    unit: 'barras de 3 m',
    stock: 22,
    minimum: 8,
    price: 2490,
    aisle: 'B · 03',
  },
  {
    id: 'FIT-18',
    name: 'Fita veda-rosca',
    unit: 'rolos de 18 m',
    stock: 45,
    minimum: 20,
    price: 590,
    aisle: 'C · 02',
  },
];
const lookup = (id) => products.find((item) => item.id === id);
const choices = products.map((item) => [item.id, item.name]);
const initial = {
  available: Object.fromEntries(products.map((item) => [item.id, item.stock])),
  orders: [
    {
      id: 'PO-027',
      lines: [
        ['ARG-20', 2],
        ['FIT-18', 4],
      ],
      phase: 'A separar',
    },
  ],
  movement: { id: 'ARG-20', amount: 6, after: 11 },
  next: 28,
};
const textOr = (item, fallback) => escape(item || fallback);
const quantityInput = (text, initialValue = 1) =>
  '<label>' +
  text +
  '<input name="quantidade" type="number" min="1" max="999" value="' +
  initialValue +
  '" required inputmode="numeric"></label>';
const result = (message, persist = false, focus) => ({ message, persist, focus });
const fail = (message) => ({ message, error: true });

function orderReceipt(order) {
  const total = order.lines.reduce((acc, [id, qty]) => acc + lookup(id).price * qty, 0);
  return renderReceipt('Pedido ' + order.id, [
    ...order.lines.map(([id, qty]) => [lookup(id).name, qty + ' ' + lookup(id).unit]),
    ['Total', money(total)],
    ['Etapa', order.phase],
  ]);
}
const pedido = {
  create: () => ({ lines: new Map(), receipt: null, selected: 'CIM-50' }),
  render(state, session) {
    const lines = [...session.lines];
    const confirmed = state.orders.find((item) => item.id === session.receipt);
    const total = lines.reduce((acc, [id, qty]) => acc + lookup(id).price * qty, 0);
    const rows = lines
      .map(
        ([id, qty]) =>
          '<li class="row"><span><b>' +
          lookup(id).name +
          '</b><small>' +
          id +
          '</small></span><strong>' +
          qty +
          ' × ' +
          money(lookup(id).price) +
          '</strong><button class="quiet" type="button" data-action="remove" aria-label="Remover ' +
          lookup(id).name +
          '" value="' +
          id +
          '">Remover</button></li>'
      )
      .join('');
    return (
      '<div class="shell-grid counter-screen"><section class="panel"><h2>Adicionar ao pedido</h2><form data-action="add"><div class="inputs"><label>Produto<select name="produto">' +
      option(choices, session.selected) +
      '</select></label>' +
      quantityInput('Unidades', 2) +
      '</div><div class="actions"><button class="primary" type="submit">Adicionar item</button></div></form><div class="stock-strip">' +
      products
        .map(
          (item) =>
            '<div><strong>' +
            state.available[item.id] +
            '</strong><small>' +
            item.id +
            ' disponíveis</small></div>'
        )
        .join('') +
      '</div></section><section class="board ticket"><h2>Pedido em montagem</h2><ul class="clean">' +
      (rows || '<li class="empty">Adicione um produto para começar.</li>') +
      '</ul><p class="sale-total"><span>Total</span><strong>' +
      money(total) +
      '</strong></p><div class="actions"><button class="primary" type="button" data-action="confirm"' +
      (lines.length ? '' : ' disabled') +
      '>Confirmar e separar</button></div></section></div>' +
      (confirmed ? orderReceipt(confirmed) : '')
    );
  },
  handle(action, data, state, session) {
    if (action === 'remove') {
      session.lines.delete(data.get('value'));
      return result('Item removido.');
    }
    if (action === 'add') {
      const id = data.get('produto');
      const count = Number(data.get('quantidade')) + (session.lines.get(id) || 0);
      if (count > state.available[id])
        return fail('O pedido excede o saldo de ' + lookup(id).name + '. Reduza a quantidade.');
      session.lines.set(id, count);
      session.selected = id;
      return result('Item adicionado ao pedido.');
    }
    if (action !== 'confirm' || !session.lines.size) return;
    const lines = [...session.lines];
    for (const [id, qty] of lines)
      if (qty > state.available[id])
        return fail('O saldo de ' + lookup(id).name + ' mudou. Atualize o pedido.');
    for (const [id, qty] of lines) state.available[id] -= qty;
    const id = 'PO-' + String(state.next++).padStart(3, '0');
    state.orders.unshift({ id, lines, phase: 'A separar' });
    session.lines.clear();
    session.receipt = id;
    return result('Pedido ' + id + ' confirmado. O estoque foi atualizado.', true, '[data-copy]');
  },
};
const estoque = {
  create: () => ({ filter: 'todos' }),
  render(state, session) {
    const items = products.filter(
      (item) => session.filter === 'todos' || state.available[item.id] < item.minimum
    );
    const movement = state.movement;
    const rows = items
      .map(
        (item) =>
          '<article class="inventory-row"><div><h3>' +
          item.name +
          '</h3><small>' +
          item.id +
          ' · Corredor ' +
          item.aisle +
          '</small></div><strong>' +
          state.available[item.id] +
          '</strong><span>' +
          (state.available[item.id] < item.minimum ? 'Repor' : 'Em dia') +
          '</span></article>'
      )
      .join('');
    return (
      '<div class="shell-grid inventory"><section class="panel"><div class="inventory-title"><h2>Saldo disponível</h2><div class="actions"><button class="secondary" type="button" data-action="filter" value="todos" aria-pressed="' +
      (session.filter === 'todos') +
      '">Todos</button><button class="secondary" type="button" data-action="filter" value="repor" aria-pressed="' +
      (session.filter === 'repor') +
      '">A repor</button></div></div>' +
      (rows || '<p class="empty">Nenhum item abaixo do mínimo.</p>') +
      '</section><div><section class="board"><h2>Registrar entrada</h2><form data-action="entry"><div class="inputs"><label>Produto<select name="produto">' +
      option(choices, movement.id) +
      '</select></label>' +
      quantityInput('Quantidade', 10) +
      '</div><div class="actions"><button class="primary" type="submit">Dar entrada</button></div></form></section>' +
      renderReceipt('Última entrada', [
        ['Produto', lookup(movement.id).name],
        ['Entrada', movement.amount],
        ['Saldo registrado', movement.after],
      ]) +
      '</div></div>'
    );
  },
  handle(action, data, state, session) {
    if (action === 'filter') {
      session.filter = data.get('value');
      return result('', false, '[aria-pressed=true]');
    }
    if (action !== 'entry') return;
    const id = data.get('produto');
    const amount = Number(data.get('quantidade'));
    state.available[id] += amount;
    state.movement = { id, amount, after: state.available[id] };
    return result('Entrada de ' + amount + ' unidades registrada.', true, '[data-copy]');
  },
};
const separacao = {
  create: (state) => ({ selected: state.orders[0].id }),
  render(state, session) {
    const order = state.orders.find((item) => item.id === session.selected) || state.orders[0];
    const checklist = order.lines
      .map(
        ([id, qty]) =>
          '<label class="tick"><input name="item" type="checkbox" value="' +
          id +
          '">' +
          qty +
          ' × ' +
          lookup(id).name +
          ' · ' +
          lookup(id).aisle +
          '</label>'
      )
      .join('');
    const buttons = state.orders
      .map(
        (item) =>
          '<li><button class="order-select" data-action="select" type="button" value="' +
          item.id +
          '" aria-pressed="' +
          (order.id === item.id) +
          '"><strong>' +
          item.id +
          '</strong><span>' +
          textOr(item.phase, '') +
          '</span></button></li>'
      )
      .join('');
    return (
      '<div class="pick-grid"><section class="panel"><h2>Fila do dia</h2><ul class="clean pick-orders">' +
      buttons +
      '</ul></section><section class="board"><h2>Conferir ' +
      order.id +
      '</h2>' +
      (order.phase === 'Pronto para retirada'
        ? '<p class="info">Pedido conferido e pronto para retirada.</p>'
        : '<form data-action="ready"><fieldset class="fieldset"><legend>Marque os itens separados</legend>' +
          checklist +
          '</fieldset><div class="actions"><button class="primary" type="submit">Liberar retirada</button></div></form>') +
      '</section></div>' +
      orderReceipt(order)
    );
  },
  handle(action, data, state, session) {
    if (action === 'select') {
      session.selected = data.get('value');
      return result('', false, '[aria-pressed=true]');
    }
    const order = state.orders.find((item) => item.id === session.selected) || state.orders[0];
    if (action !== 'ready' || !order || order.phase !== 'A separar') return;
    const checked = data.getAll('item');
    if (!order.lines.every(([id]) => checked.includes(id)))
      return fail('Confira todos os itens antes de liberar a retirada.');
    order.phase = 'Pronto para retirada';
    return result(order.id + ' pronto para retirada.', true, '[data-copy]');
  },
};
start({ key: 'ponto-obra', initial, views: { pedido, estoque, separacao } });
