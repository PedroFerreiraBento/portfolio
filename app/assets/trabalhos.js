(() => {
 const root = document.querySelector('.work-showcase');
 const items = [
  {"type": "orcamento", "title": "Salão de beleza", "description": "Salão de beleza com uma vitrine de serviços e um pedido de atendimento.", "aliases": "cabeleireiro salão de cabelo cabeleireira", "id": "salao", "dest": "/exemplos/sites/salao/", "mobile": true, "brand": "Bellezza", "tone": "beleza", "english": {"title": "Hair salon", "description": "Browse salon services and try requesting an appointment."}},
  {"type": "orcamento", "title": "Barbearia", "description": "Compare referências de corte e simule um pedido de atendimento.", "aliases": "", "id": "barbearia", "dest": "/exemplos/sites/barbearia/", "mobile": true, "brand": "Ouro & Navalha", "tone": "produto", "english": {"title": "Barbershop", "description": "Explore haircut references and try the service request."}},
  {"type": "orcamento", "title": "Esmalteria", "description": "Compare acabamentos e simule um pedido de esmaltação.", "aliases": "", "id": "esmalteria", "dest": "/exemplos/sites/esmalteria/", "mobile": true, "brand": "L’Art des Ongles", "tone": "produto", "english": {"title": "Nail salon", "description": "Compare finishes and try a nail-care request.", "brand": "L’Art des Ongles"}},
  {"type": "orcamento", "title": "Clínica de estética", "description": "Explore os serviços e simule um pedido de avaliação.", "aliases": "", "id": "clinica-estetica", "dest": "/exemplos/sites/clinica-estetica/", "mobile": false, "brand": "Clínica de estética", "tone": "produto", "english": {"title": "Aesthetics clinic", "description": "Explore the services and try requesting a consultation.", "brand": "Aesthetics clinic"}},
  {"type": "orcamento", "title": "Estética biomédica", "description": "Conheça o atendimento e teste o pedido de contato.", "aliases": "", "id": "biomedicina", "dest": "/exemplos/sites/biomedicina/", "mobile": false, "brand": "Estética biomédica", "tone": "produto", "english": {"title": "Advanced aesthetics", "description": "Explore the treatments and try sending an enquiry.", "brand": "Advanced aesthetics"}},
  {"type": "orcamento", "title": "Dentista", "description": "Uma página de clínica com os atendimentos e o caminho para solicitar avaliação.", "aliases": "odontologia clínica odontológica", "id": "dentista", "dest": "/exemplos/sites/dentista/", "mobile": true, "brand": "Odonto Premium", "tone": "saude", "english": {"title": "Dental practice", "description": "Explore the treatments and see how to request a consultation."}},
  {"type": "orcamento", "title": "Psicologia", "description": "Conheça a abordagem e simule o primeiro contato.", "aliases": "", "id": "psicologia", "dest": "/exemplos/sites/psicologia/", "mobile": false, "brand": "Psicologia", "tone": "produto", "english": {"title": "Psychology practice", "description": "Learn about the approach and try making an enquiry.", "brand": "Psychology practice"}},
  {"type": "orcamento", "title": "Advocacia", "description": "Áreas de atuação e um primeiro contato reservado, em um site completo.", "aliases": "advogado advogada escritório jurídico", "id": "advocacia", "dest": "/exemplos/profissionais/advocacia/", "mobile": true, "brand": "Pátio Advocacia", "tone": "legal", "english": {"title": "Law firm", "description": "Explore practice areas and try making an initial enquiry."}},
  {"type": "orcamento", "title": "Arquitetura", "description": "Explore os estudos de projeto e monte um pedido de proposta.", "aliases": "", "id": "arquitetura", "dest": "/exemplos/profissionais/arquitetura/", "mobile": true, "brand": "Entrelinhas Arquitetura", "tone": "produto", "english": {"title": "Architecture studio", "description": "Explore the projects and put together a proposal request.", "brand": "Entrelinhas Arquitetura"}},
  {"type": "orcamento", "title": "Contabilidade", "description": "Escolha o que sua empresa precisa e simule a triagem.", "aliases": "contador abertura de empresa troca de contador folha", "id": "contabilidade", "dest": "/exemplos/profissionais/contabilidade/", "mobile": true, "brand": "Soma Clara", "tone": "produto", "english": {"title": "Accounting firm", "description": "Choose what your business needs and try the enquiry form."}},
  {"type": "orcamento", "title": "Fotografia", "description": "Veja o portfólio e teste uma consulta para seu evento.", "aliases": "", "id": "fotografia", "dest": "/exemplos/servicos/fotografia/", "mobile": true, "brand": "Ainda Aqui Fotografia", "tone": "produto", "english": {"title": "Photographer", "description": "Browse the portfolio and try an event enquiry."}},
  {"type": "orcamento", "title": "Aulas particulares", "description": "Escolha a matéria e simule um pedido de aula.", "aliases": "", "id": "aulas", "dest": "/exemplos/profissionais/aulas/", "mobile": true, "brand": "Traço", "tone": "produto", "english": {"title": "Private tutoring", "description": "Choose a subject and try requesting a lesson.", "brand": "Private tutoring"}},
  {"type": "orcamento", "title": "Buffet para eventos", "description": "Informe o tipo de evento e o número de convidados para cotar.", "aliases": "", "id": "buffet", "dest": "/exemplos/profissionais/buffet/", "mobile": true, "brand": "Mesa de Festa", "tone": "produto", "english": {"title": "Event catering", "description": "Explore a menu, compare event formats or prepare a catering brief."}},
  {"type": "orcamento", "title": "Personal trainer", "description": "Conheça os formatos e teste o pedido de uma conversa inicial.", "aliases": "", "id": "treinamento", "dest": "/exemplos/profissionais/treinamento/", "mobile": true, "brand": "Vetor Treinamento", "tone": "produto", "english": {"title": "Personal trainer", "description": "Explore the formats and try requesting an introductory call.", "brand": "Personal trainer"}},
  {"type": "orcamento", "title": "Banho e tosa", "description": "Informe a pelagem, explore uma agenda de exemplo ou monte o pedido de banho.", "aliases": "pet shop animais cachorro banho tosa pelagem", "id": "banho-e-tosa", "dest": "/exemplos/servicos/banho-e-tosa/", "mobile": true, "brand": "Linha Mansa", "tone": "produto", "english": {"title": "Dog grooming", "description": "Describe the coat, explore a sample schedule or build a grooming request.", "brand": "Linha Mansa"}},
  {"type": "orcamento", "title": "Mudanças residenciais", "description": "Liste os volumes, organize o dia da mudança ou compare o que cada serviço inclui.", "aliases": "mudanca mudanças carreto frete mudança residencial transportadora empacotamento", "id": "mudancas", "dest": "/exemplos/servicos/mudancas/", "mobile": true, "brand": "Casa em Trânsito", "tone": "produto", "english": {"title": "House moves", "description": "List your belongings, prepare for moving day or compare what each service includes.", "brand": "Casa em Trânsito"}},
  {"type": "orcamento", "title": "Higienização de estofados", "description": "Liste as peças, organize a visita por ambientes ou prepare uma avaliação do tecido.", "aliases": "limpeza de sofá estofado colchão poltrona higienizacao tecido", "id": "estofados", "dest": "/exemplos/servicos/estofados/", "mobile": true, "brand": "Casa em Trama", "tone": "produto", "english": {"title": "Upholstery cleaning", "description": "List furniture, plan a visit by room or put together a fabric assessment.", "brand": "Casa em Trama"}},
  {"type": "orcamento", "title": "Ar-condicionado", "description": "Página para pedir orçamento de manutenção empresarial, com três direções visuais.", "aliases": "climatização climapro", "id": "climapro", "dest": "/demos/plano/index.html", "mobile": true, "brand": "ClimaPro", "tone": "clima", "english": {"title": "Air conditioning", "description": "Request a commercial maintenance quote in one of three visual styles."}},
  {"type": "orcamento", "title": "Reformas", "description": "Escolha o tipo de reforma e teste o pedido de orçamento.", "aliases": "obra apartamento cozinha banheiro reforma residencial", "id": "reformas", "dest": "/exemplos/servicos/reformas/", "mobile": true, "brand": "Entre Obra", "tone": "produto", "english": {"title": "Home renovations", "description": "Choose a renovation type and try asking for a quote."}},
  {"type": "orcamento", "title": "Jardinagem", "description": "Explore jardins e formas de cuidado ou registre o que você já sabe sobre o espaço.", "aliases": "paisagismo manutenção jardins canteiros", "id": "jardinagem", "dest": "/exemplos/servicos/jardinagem/", "mobile": true, "brand": "Sombra de Folha", "tone": "produto", "english": {"title": "Gardening", "description": "Explore gardens and maintenance plans, or record what you know about the space."}},
  {"type": "orcamento", "title": "Oficina mecânica", "description": "Selecione o serviço e simule a solicitação para seu veículo.", "aliases": "mecanica oficina revisao automovel", "id": "oficina", "dest": "/exemplos/servicos/oficina/", "mobile": true, "brand": "Pista 22", "tone": "produto", "english": {"title": "Auto repair shop", "description": "Explore the workshop and prepare a sample service request."}},
  {"type": "orcamento", "title": "Marcenaria", "description": "Escolha o ambiente e simule um orçamento de móveis sob medida.", "aliases": "", "id": "marcenaria", "dest": "/exemplos/servicos/marcenaria/", "mobile": true, "brand": "Encaixe", "tone": "produto", "english": {"title": "Custom furniture", "description": "Choose a room and try requesting a custom furniture quote."}},
  {"type": "orcamento", "title": "Vidraçaria", "description": "Indique a peça e as dimensões para testar um pedido.", "aliases": "box espelho divisoria vidro sob medida", "id": "vidracaria", "dest": "/exemplos/servicos/vidracaria/", "mobile": true, "brand": "Plano Claro", "tone": "produto", "english": {"title": "Glass installation", "description": "Enter the piece and its dimensions to try a request."}},
  {"type": "catalogo", "title": "Loja de iluminação", "description": "Escolha luminárias, monte uma cotação e veja a mensagem pronta para o WhatsApp.", "aliases": "", "id": "catalogo", "dest": "/assets/casos/catalogo.html", "mobile": true, "brand": "Luz & Forma", "tone": "produto", "english": {"title": "Lighting store", "description": "Choose fixtures, build a quote request and see the message ready for WhatsApp."}},
  {"type": "catalogo", "title": "Uniformes personalizados", "description": "Escolha peças pela rotina, monte a grade da equipe ou posicione a marca no uniforme.", "aliases": "uniforme camisetas confecção bordado estampa avental polo equipe", "id": "uniformes", "dest": "/exemplos/catalogos/uniformes/", "mobile": true, "brand": "Trama de Ofício", "tone": "produto", "english": {"title": "Custom uniforms", "description": "Browse by trade, fill a size grid or place a mark on the uniform.", "brand": "Trama de Ofício"}},
  {"type": "catalogo", "title": "Ateliê de cerâmica", "description": "Componha uma mesa, escolha uma peça para presente ou prepare um lote para cafés.", "aliases": "ceramica louça pratos xicara presente mesa posta atelie porcelana café", "id": "ceramica", "dest": "/exemplos/catalogos/ceramica/", "mobile": true, "brand": "Ateliê Várzea", "tone": "produto", "english": {"title": "Ceramics studio", "description": "Build a table setting, choose a gift or specify a small batch for a café.", "brand": "Ateliê Várzea"}},
  {"type": "catalogo", "title": "Floricultura", "description": "Escolha um buquê, componha um arranjo ou planeje as flores de um evento.", "aliases": "flores buquê bouque presente arranjo eventos casamento", "id": "floricultura", "dest": "/exemplos/catalogos/floricultura/", "mobile": true, "brand": "Botânica das Horas", "tone": "produto", "english": {"title": "Florist", "description": "Choose a bouquet, compose an arrangement or plan the flowers for an event.", "brand": "Botânica das Horas"}},
  {"type":"catalogo","title":"Confeitaria artesanal","description":"Monte uma caixa mista, componha um bolo ou calcule a mesa de doces.","aliases":"doces bolo brigadeiro confeitaria festa bombons trufas sobremesa","id":"confeitaria","dest":"/exemplos/catalogos/confeitaria/","mobile":true,"brand":"Dobra Doce","tone":"produto","english":{"title":"Artisan confectionery","description":"Build a mixed box, design a cake or plan a dessert table.","brand":"Dobra Doce"}},
  {"type":"catalogo","title":"Gráfica e impressão personalizada","description":"Explore impressos por uso, especifique uma prova ou monte uma ficha para o evento.","aliases":"grafica impressão impressos papelaria cartão convite cardápio impressão personalizada crachá","id":"grafica","dest":"/exemplos/catalogos/grafica/","mobile":true,"brand":"Margem Comum","tone":"produto","english":{"title":"Custom printing","description":"Browse print pieces by use, configure a proof or plan the pieces for an event.","brand":"Margem Comum"}},
  {"type": "agendamento", "title": "Lavanderia e passadoria", "description": "Monte um cesto de roupas, confira o cuidado por peça ou simule a coleta.", "aliases": "lavanderia lavagem passadoria limpeza roupas coleta roupa delicada", "id": "lavanderia", "dest": "/exemplos/servicos/lavanderia/", "mobile": true, "brand": "Linha Clara", "tone": "produto", "english": {"title": "Laundry and pressing", "description": "Build a load, review individual garment care or try scheduling a pickup.", "brand": "Linha Clara"}},
  {"type": "agendamento", "title": "Oficina de bicicletas", "description": "Descreva os sinais, monte a lista de serviços ou escolha quando levar a bicicleta.", "aliases": "bike ciclismo bicicletaria conserto pedal freio revisão mecânica", "id": "bicicletas", "dest": "/exemplos/servicos/bicicletas/", "mobile": true, "brand": "Oficina Contrapedal", "tone": "produto", "english": {"title": "Bicycle repair shop", "description": "Describe what you noticed, list services or choose when to bring the bike.", "brand": "Oficina Contrapedal"}},
  {"type": "agendamento", "title": "Agenda para conversar sobre um projeto", "description": "Confira os dias livres e simule a escolha de um horário.", "aliases": "", "id": "agenda", "dest": "/assets/casos/agenda.html", "mobile": true, "brand": "Agenda online", "tone": "saude", "english": {"title": "Project consultation", "description": "Check available days and try booking a time."}},
  {"type": "operacao", "title": "Aprovação de site", "description": "Revise uma entrega, registre um ajuste e veja a aprovação.", "aliases": "", "id": "painel", "dest": "/assets/casos/painel.html", "mobile": true, "brand": "Aprovação de site", "tone": "legal", "english": {"title": "Website approval", "description": "Review a delivery, request a change and see the approval step.", "brand": "Website approval"}},
  {"type": "operacao", "title": "Da loja à expedição", "description": "Acompanhe um pedido simulado até a fila de separação.", "aliases": "", "id": "integracao", "dest": "/assets/casos/integracao.html", "mobile": false, "brand": "Da loja à expedição", "tone": "produto", "english": {"title": "Order to dispatch", "description": "Follow a sample order to the packing queue.", "brand": "Order to dispatch"}},
  {"type": "operacao", "title": "Vistoria pelo celular", "description": "Preencha uma inspeção de teste e veja o relatório.", "aliases": "", "id": "vistoria", "dest": "/assets/casos/vistoria.html", "mobile": false, "brand": "Vistoria pelo celular", "tone": "produto", "english": {"title": "Mobile inspection", "description": "Complete a sample inspection and see the report.", "brand": "Mobile inspection"}}
 ];
 const find = id => document.getElementById(id);
 const typeButtons = [...root.querySelectorAll('[data-type]')];
 const list = find('showcase-list');
 const search = find('showcase-search');
 const more = find('showcase-more');
 const featured = ['salao','dentista','advocacia','climapro'];
 const searchable = text => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/[^a-z0-9]+/g,' ').trim();
 const params = new URLSearchParams(location.search);
 const legacy = {
  '#card-captacao':'climapro', '#card-catalogo':'catalogo', '#card-agenda':'agenda',
  '#card-painel':'painel', '#card-integracao':'integracao', '#card-vistoria':'vistoria'
 };
 const validType = typeButtons.some(button => button.dataset.type === params.get('tipo'));
 const incomingProject = items.find(item => item.id === (params.get('projeto') || legacy[location.hash]));
 const campaignProject = items.find(item => item.id === root.dataset.defaultProject);
 let category = validType ? params.get('tipo') : (incomingProject || campaignProject)?.type || 'orcamento';
 let selected = [incomingProject, campaignProject].find(item => item?.type === category) || items.find(item => item.type === category);
 let expanded = category === 'orcamento' && !featured.includes(selected.id);
 const english = () => document.documentElement.lang === 'en';
 const localized = (pt,en) => english() ? en : pt;
 const nameOf = item => english() ? item.english.brand || item.brand : item.brand;

 function rememberSelection() {
  const url = new URL(location.href);
  url.searchParams.set('tipo',category);
  url.searchParams.set('projeto',selected.id);
  url.hash = 'trabalhos';
  history.replaceState(null,'',url);
 }

 function showProject(project) {
  selected = project;
  find('showcase-image').dataset.tone = project.tone;
  const desktop = find('showcase-desktop');
  desktop.src = '/assets/trabalhos/' + project.id + '.jpg';
  desktop.alt = localized('Prévia de ' + nameOf(project) + ' no computador', nameOf(project) + ' desktop preview');
  const phone = find('showcase-phone');
  find('showcase-phone-box').hidden = !project.mobile;
  if (project.mobile) {
   phone.src = '/assets/trabalhos/' + project.id + '-mobile.jpg';
   phone.alt = localized('Prévia de ' + nameOf(project) + ' no celular', nameOf(project) + ' mobile preview');
  }
  find('showcase-project-title').textContent = nameOf(project);
  find('showcase-project-copy').textContent = localized(project.description, project.english.description);
  const url = new URL(project.dest, location.origin);
  for (const [key,value] of new URLSearchParams(location.search)) {
   if (key === 'publico' || key.startsWith('utm_')) url.searchParams.set(key,value);
  }
  find('showcase-open').href = url;
  find('showcase-open').firstChild.nodeValue = category === 'orcamento'
   ? localized('Abrir site completo ', 'Open full website ') : localized('Abrir demonstração ', 'Open demo ');
  const variantsLink = find('showcase-variants');
  const variantsPath = {
   climapro:'/demos/index.html',
   salao:'/exemplos/sites/salao/versoes.html',
   dentista:'/exemplos/sites/dentista/versoes.html',
   advocacia:'/exemplos/profissionais/advocacia/versoes.html',
   arquitetura:'/exemplos/profissionais/arquitetura/versoes.html',
   contabilidade:'/exemplos/profissionais/contabilidade/versoes.html',
   fotografia:'/exemplos/servicos/fotografia/versoes.html',
   buffet:'/exemplos/profissionais/buffet/versoes.html',
   marcenaria:'/exemplos/servicos/marcenaria/versoes.html',
   jardinagem:'/exemplos/servicos/jardinagem/versoes.html',
   oficina:'/exemplos/servicos/oficina/versoes.html',
   vidracaria:'/exemplos/servicos/vidracaria/versoes.html',
   reformas:'/exemplos/servicos/reformas/versoes.html',
   aulas:'/exemplos/profissionais/aulas/versoes.html',
   barbearia:'/exemplos/sites/barbearia/versoes.html',
   esmalteria:'/exemplos/sites/esmalteria/versoes.html',
   treinamento:'/exemplos/profissionais/treinamento/versoes.html',
   'banho-e-tosa':'/exemplos/servicos/banho-e-tosa/versoes.html',
   'mudancas':'/exemplos/servicos/mudancas/versoes.html',
   'estofados':'/exemplos/servicos/estofados/versoes.html',
   'uniformes':'/exemplos/catalogos/uniformes/versoes.html',
   'ceramica':'/exemplos/catalogos/ceramica/versoes.html',
   'floricultura':'/exemplos/catalogos/floricultura/versoes.html',
   'confeitaria':'/exemplos/catalogos/confeitaria/versoes.html',
   'grafica':'/exemplos/catalogos/grafica/versoes.html',
   'lavanderia':'/exemplos/servicos/lavanderia/versoes.html',
   'bicicletas':'/exemplos/servicos/bicicletas/versoes.html'
  }[project.id];
  variantsLink.hidden = !variantsPath;
  if (variantsPath) {
   const variants = new URL(variantsPath,location.origin);
   variants.search = url.search;
   variantsLink.href = variants;
  }
  root.querySelectorAll('[data-project]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.project === project.id)));
  find('showcase-status').textContent = localized('Prévia de ' + nameOf(project) + ' carregada.', nameOf(project) + ' preview ready.');
 }

 function renderPicker() {
  const available = items.filter(item => item.type === category);
  const term = searchable(search.value);
  const matched = available.filter(item => searchable([item.title,item.brand,item.aliases,item.english.title,item.english.brand].join(' ')).includes(term));
  const shown = category === 'orcamento' && !expanded && !term
   ? featured.map(id => matched.find(item => item.id === id)).filter(Boolean) : matched;
  find('showcase-picker-title').textContent = category === 'orcamento'
   ? localized('Escolha o ramo', 'Choose your industry') : localized('Escolha um exemplo', 'Choose an example');
  find('showcase-count').textContent = available.length + (category === 'orcamento'
   ? localized(' ramos', ' industries')
   : available.length === 1 ? localized(' exemplo', ' example') : localized(' exemplos', ' examples'));
  find('showcase-search-box').hidden = category !== 'orcamento';
  list.replaceChildren(...shown.map(item => {
   const li = document.createElement('li');
   const button = document.createElement('button');
   button.type = 'button';
   button.dataset.project = item.id;
   button.setAttribute('aria-pressed',String(item === selected));
   button.textContent = localized(item.title, item.english.title);
   button.addEventListener('click', event => {
    showProject(item);
    rememberSelection();
    if (event.detail && matchMedia('(max-width:700px)').matches) {
     find('showcase-open').scrollIntoView({block:'nearest'});
    }
   });
   li.append(button);
   return li;
  }));
  more.hidden = category !== 'orcamento' || Boolean(term);
  more.textContent = expanded ? localized('Voltar aos destaques', 'Back to highlights') : localized('Ver todos os ramos', 'See all industries');
  more.setAttribute('aria-expanded', String(expanded));
  find('showcase-empty').textContent = shown.length ? '' : localized('Nenhum ramo encontrado. Tente um nome mais curto.', 'No industries found. Try a shorter search.');
 }

 typeButtons.forEach(button => button.addEventListener('click',() => {
  category = button.dataset.type;
  search.value = '';
  expanded = false;
  syncTypeButtons();
  showProject(category === 'orcamento' ? items.find(item => item.id === 'salao') : items.find(item => item.type === category));
  renderPicker();
  rememberSelection();
 }));
 search.addEventListener('input',renderPicker);
 more.addEventListener('click',() => {
  expanded = !expanded;
  if (!expanded && !featured.includes(selected.id)) {
   showProject(items.find(item => item.id === 'salao'));
   rememberSelection();
  }
  renderPicker();
  list.scrollTop = 0;
 });
 function renderLanguage() {
  root.lang = english() ? 'en' : 'pt-BR';
  for (const element of root.querySelectorAll('[data-en]')) {
   element.dataset.pt ??= element.textContent;
   element.textContent = localized(element.dataset.pt,element.dataset.en);
  }
  const searchLabel = localized('Buscar ramo', 'Search industries');
  find('showcase-search-label').textContent = searchLabel;
  search.placeholder = searchLabel;
  root.querySelector('.showcase-types').setAttribute('aria-label',localized('Soluções','Solutions'));
  showProject(selected);
  renderPicker();
 }

 function syncTypeButtons() {
  typeButtons.forEach(option => option.setAttribute('aria-pressed',String(option.dataset.type === category)));
 }

 addEventListener('hashchange', () => {
  const project = items.find(item => item.id === legacy[location.hash]);
  if (!project) return;
  category = project.type;
  search.value = '';
  expanded = category === 'orcamento' && !featured.includes(project.id);
  syncTypeButtons();
  showProject(project);
  renderPicker();
 });
 document.addEventListener('caos-language-change',renderLanguage);
 more.setAttribute('aria-controls',list.id);
 syncTypeButtons();
 renderLanguage();
 root.querySelector('.showcase-types').hidden = false;
 root.querySelector('.showcase-picker').hidden = false;
})();
