import { start, money, escape, option, renderReceipt } from '../commercial-kernel.js';

const products = {
  SUC: { name: 'Suco de uva', pack: '12 garrafas por caixa', price: 12900, cost: 8400 },
  CFT: { name: 'Café em grão', pack: '6 pacotes por caixa', price: 18900, cost: 11200 },
  AGU: { name: 'Água com gás', pack: '12 garrafas por caixa', price: 4890, cost: 3240 },
};
const windows = [
  ['ter-a', 'Terça · 08h–11h', 24],
  ['ter-b', 'Terça · 14h–17h', 80],
  ['qua-a', 'Quarta · 09h–12h', 80],
];
const initial = {
  next: 14,
  quotes: [
    { id: 'CC-013', product: 'SUC', count: 18, discount: 25, region: 'Rota Centro', phase: 'Em revisão' },
    { id: 'CC-012', product: 'CFT', count: 32, discount: 5, region: 'Rota Oeste', phase: 'Aprovada' },
  ],
};
const floor = 20;
const pct = (value) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value) + '%';
const choices = Object.entries(products).map(([id, value]) => [id, value.name]);
const answer = (message, persist = false, focus) => ({ message, persist, focus });
const error = (message) => ({ message, error: true });
const quoteBy = (state, session) =>
  state.quotes.find((item) => item.id === session.selected) || state.quotes[0];

function values(quote) {
  const item = products[quote.product];
  const gross = item.price * quote.count;
  const total = Math.round((gross * (100 - quote.discount)) / 100);
  const cost = item.cost * quote.count;
  return { gross, total, cost, margin: (100 * (total - cost)) / total };
}
function receipt(quote) {
  const win = windows.find((row) => row[0] === quote.window);
  return renderReceipt(quote.id, [
    ['Situação', quote.phase],
    ['Produto', products[quote.product].name],
    ['Caixas', quote.count],
    ['Desconto aplicado', pct(quote.discount)],
    ['Total comercial', money(values(quote).total)],
    ['Rota', quote.region],
    ...(win ? [['Janela', win[1]]] : []),
  ]);
}
function quoteList(state, selected, filter = () => true) {
  return state.quotes
    .filter(filter)
    .map(
      (quote) =>
        '<li><button class="switch-quote" type="button" data-action="choose" value="' +
        quote.id +
        '" aria-pressed="' +
        (quote.id === selected) +
        '"><strong>' +
        quote.id +
        '</strong><span>' +
        escape(quote.phase) +
        '</span><small>' +
        quote.count +
        ' caixas · ' +
        products[quote.product].name +
        '</small></button></li>'
    )
    .join('');
}
const cotacao = {
  create: () => ({ draft: { product: 'SUC', count: 12, discount: 0, region: 'Rota Centro' }, result: null }),
  render(state, session) {
    const draft = session.draft;
    const { gross, total } = values(draft);
    return (
      '<div class="shell-grid quotes"><section class="panel"><h2>Itens e destino</h2><form data-action="price" data-recompute="queue" data-recompute-message="Recalcule a cotação para atualizar a prévia."><div class="inputs"><label>Produto<select name="produto">' +
      option(choices, draft.product) +
      '</select></label><label>Caixas<input name="caixas" type="number" min="1" max="80" inputmode="numeric" required value="' +
      draft.count +
      '"></label><label>Rota<select name="rota">' +
      option(
        [
          ['Rota Centro', 'Centro'],
          ['Rota Oeste', 'Oeste'],
        ],
        draft.region
      ) +
      '</select></label></div><div class="actions"><button type="submit" class="primary">Calcular cotação</button></div></form><div class="info"><strong>Faixas de teste</strong><span>De 1 a 19 caixas · tabela base</span><span>20 a 39 caixas · 5% de desconto</span><span>40 a 80 caixas · 8% de desconto</span></div></section><section class="board estimate"><h2>Prévia da cotação</h2><p class="muted">' +
      products[draft.product].pack +
      '</p><dl class="quote-values"><div><dt>Produtos</dt><dd>' +
      money(gross) +
      '</dd></div><div><dt>Faixa comercial</dt><dd>' +
      pct(draft.discount) +
      '</dd></div><div><dt>Total</dt><dd>' +
      money(total) +
      '</dd></div></dl><div class="actions"><button class="primary" type="button" data-action="queue">Salvar para revisão</button></div></section></div>' +
      (state.quotes.some((item) => item.id === session.result)
        ? receipt(state.quotes.find((item) => item.id === session.result))
        : '')
    );
  },
  handle(action, data, state, session) {
    if (action === 'price') {
      const count = Number(data.get('caixas'));
      session.draft = {
        product: data.get('produto'),
        count,
        discount: count >= 40 ? 8 : count >= 20 ? 5 : 0,
        region: data.get('rota'),
      };
      return answer('Cotação recalculada.', false, '[data-action=queue]');
    }
    if (action !== 'queue') return;
    const quote = { ...session.draft, id: 'CC-' + String(state.next++).padStart(3, '0'), phase: 'Em revisão' };
    state.quotes.unshift(quote);
    session.result = quote.id;
    return answer('Cotação ' + quote.id + ' salva para revisão.', true, '[data-copy]');
  },
};
const margem = {
  create: (state) => ({ selected: state.quotes[0].id }),
  render(state, session) {
    const quote = quoteBy(state, session);
    const { total, cost, margin } = values(quote);
    const allowed = margin >= floor;
    const editable = quote.phase === 'Em revisão';
    return (
      '<div class="review-grid"><section class="panel"><h2>Propostas</h2><ul class="clean quote-list">' +
      quoteList(state, quote.id) +
      '</ul></section><section class="board margin-board"><h2>Revisar ' +
      quote.id +
      '</h2><div class="margin-comparison"><div><small>Preço negociado</small><strong>' +
      money(total) +
      '</strong></div><div><small>Custo de referência</small><strong>' +
      money(cost) +
      '</strong></div></div><div class="margin-status" data-allowed="' +
      allowed +
      '"><strong>' +
      pct(margin) +
      '</strong><span>' +
      (allowed ? 'Dentro da regra de demonstração' : 'Abaixo do mínimo de 20%') +
      '</span></div>' +
      (editable
        ? '<form data-action="discount" data-recompute="approve" data-recompute-message="Aplique o novo desconto antes de aprovar."><div class="inputs"><label>Novo desconto (%)<input name="desconto" type="number" min="0" max="35" required value="' +
          quote.discount +
          '"></label><button class="secondary" type="submit">Aplicar desconto</button></div></form><div class="actions"><button class="primary" type="button" data-action="approve">Aprovar cotação</button></div>'
        : '<p class="info">Cotação ' + escape(quote.phase.toLowerCase()) + '.</p>') +
      '</section></div>' +
      receipt(quote)
    );
  },
  handle(action, data, state, session) {
    if (action === 'choose') {
      session.selected = data.get('value');
      return answer('', false, '[aria-pressed=true]');
    }
    const quote = quoteBy(state, session);
    if (quote.phase !== 'Em revisão') return error('Esta cotação já saiu da revisão.');
    if (action === 'discount') {
      quote.discount = Number(data.get('desconto'));
      return answer('Desconto atualizado na proposta.', true, '[name=desconto]');
    }
    if (action === 'approve') {
      if (values(quote).margin < floor)
        return error('A margem está abaixo de 20%. Ajuste o desconto antes de aprovar.');
      quote.phase = 'Aprovada';
      return answer(quote.id + ' aprovada e disponível para agendar.', true, '[data-copy]');
    }
  },
};
const booked = (state, id) =>
  state.quotes.reduce((total, quote) => total + (quote.window === id ? quote.count : 0), 0);
const entrega = {
  create: (state) => ({ selected: state.quotes.find((quote) => quote.phase === 'Aprovada')?.id }),
  render(state, session) {
    const eligible = state.quotes.filter((quote) => quote.phase !== 'Em revisão');
    if (!eligible.length)
      return '<section class="panel"><h2>Nenhuma proposta aprovada</h2><p class="muted">Abra Revisão de margem para liberar uma cotação.</p></section>';
    const quote = eligible.find((item) => item.id === session.selected) || eligible[0];
    const slots = windows
      .map(([id, name, capacity]) => {
        const available = capacity - booked(state, id);
        return (
          '<label class="window"><input name="janela" type="radio" value="' +
          id +
          '" required' +
          (available >= quote.count ? '' : ' disabled') +
          '><span><strong>' +
          name +
          '</strong><small>' +
          available +
          ' de ' +
          capacity +
          ' caixas livres' +
          (available < quote.count ? ' · insuficiente' : '') +
          '</small><i class="meter"><span style="width:' +
          (100 * available) / capacity +
          '%"></span></i></span></label>'
        );
      })
      .join('');
    return (
      '<div class="review-grid delivery"><section class="panel"><h2>Cotações liberadas</h2><ul class="clean quote-list">' +
      quoteList(state, quote.id, (quote) => quote.phase !== 'Em revisão') +
      '</ul></section><section class="board"><h2>' +
      quote.id +
      ' · ' +
      quote.count +
      ' caixas</h2><p>' +
      escape(quote.region) +
      '</p>' +
      (quote.phase === 'Agendada'
        ? '<div class="info">Entrega planejada na janela ' +
          windows.find((row) => row[0] === quote.window)[1] +
          '.</div><button class="secondary" type="button" data-action="release">Editar janela</button>'
        : '<form data-action="dispatch"><fieldset class="fieldset"><legend>Capacidade por janela</legend>' +
          slots +
          '</fieldset><div class="actions"><button class="primary" type="submit">Confirmar janela</button></div></form>') +
      '</section></div>' +
      receipt(quote)
    );
  },
  handle(action, data, state, session) {
    if (action === 'choose') {
      session.selected = data.get('value');
      return answer('', false, '[aria-pressed=true]');
    }
    const quote = state.quotes.find((item) => item.id === session.selected && item.phase !== 'Em revisão');
    if (!quote) return error('Selecione uma cotação aprovada.');
    if (action === 'release') {
      quote.window = null;
      quote.phase = 'Aprovada';
      return answer('Janela anterior liberada. Escolha outra opção.', true, '[name=janela]:enabled');
    }
    if (action !== 'dispatch' || quote.phase !== 'Aprovada') return;
    const win = windows.find((row) => row[0] === data.get('janela'));
    if (!win || win[2] - booked(state, win[0]) < quote.count)
      return error('Esta janela já não comporta todas as caixas. Escolha outra opção.');
    quote.window = win[0];
    quote.phase = 'Agendada';
    return answer('Janela confirmada para ' + quote.id + '.', true, '[data-copy]');
  },
};
start({ key: 'cais-b2b', initial, views: { cotacao, margem, entrega } });
