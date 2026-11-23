(() => {
 const root = document.documentElement;
 const preferences = document.querySelector('.header-preferences');
 const language = preferences.querySelector('[data-language]');
 const languageMenu = document.getElementById('language-menu');
 const languageOptions = [...languageMenu.querySelectorAll('[data-locale]')];
 const theme = preferences.querySelector('button[data-theme-toggle]');
 const { colorScheme, languageKey, themeKey, storedLanguage, storedTheme, deviceLanguage, deviceTheme, save } = window.caosPreferences;
 const dictionary = new Map([
 [
  "Início",
  "Home"
 ],
 [
  "Projetos",
  "Projects"
 ],
 [
  "Serviços",
  "Services"
 ],
 [
  "Como trabalhamos",
  "How we work"
 ],
 [
  "Contato",
  "Contact"
 ],
 [
  "Trabalhos",
  "Work"
 ],
 [
  "Como trabalho",
  "How I work"
 ],
 [
  "Dúvidas",
  "FAQ"
 ],
 [
  "Pular para o conteúdo",
  "Skip to content"
 ],
 [
  "Navegação principal",
  "Main navigation"
 ],
 [
  "Navegação do rodapé",
  "Footer navigation"
 ],
 [
  "Caos Domado, início",
  "Caos Domado, home"
 ],
 [
  "Caos Domado, voltar ao início",
  "Caos Domado, back to home"
 ],
 [
  "Abrir menu",
  "Open menu"
 ],
 [
  "Fechar menu",
  "Close menu"
 ],
 [
  "Conversar no",
  "Chat on"
 ],
 [
  "Conversar no WhatsApp",
  "Chat on WhatsApp"
 ],
 [
  "Conversar no WhatsApp (nova aba)",
  "Chat on WhatsApp (new tab)"
 ],
 [
  "Sites, interfaces e integrações",
  "Websites, interfaces and integrations"
 ],
 [
  "para empresas e agências.",
  "for businesses and agencies."
 ],
 [
  "Design e código",
  "Design and code"
 ],
 [
  "Criamos sites, interfaces e integrações para agências e empresas, do seu layout ou briefing à entrega.",
  "We build websites, interfaces and integrations for agencies and businesses, from your design or brief through delivery."
 ],
 [
  "Explorar trabalhos",
  "Explore our work"
 ],
 [
  "Trabalhos selecionados",
  "Selected work"
 ],
 [
  "Filtrar trabalhos",
  "Filter projects"
 ],
 [
  "Todos",
  "All"
 ],
 [
  "Sites",
  "Websites"
 ],
 [
  "Interfaces",
  "Interfaces"
 ],
 [
  "Integrações",
  "Integrations"
 ],
 [
  "Ver mais trabalhos",
  "View more projects"
 ],
 [
  "Mostrar só os destaques",
  "Show featured projects only"
 ],
 [
  "Site · Projeto demonstrativo",
  "Website · Demo project"
 ],
 [
  "Interface · Projeto demonstrativo",
  "Interface · Demo project"
 ],
 [
  "Integração · Projeto demonstrativo",
  "Integration · Demo project"
 ],
 [
  "Interface e integração · Projeto demonstrativo",
  "Interface and integration · Demo project"
 ],
 [
  "Página de captação para prestadores de serviço",
  "Lead generation page for service businesses"
 ],
 [
  "Uma página de orçamento em três direções visuais.",
  "A quote request page in three visual styles."
 ],
 [
  "Painel de produção para agências",
  "Agency production dashboard"
 ],
 [
  "Acompanhe entregas e aprove uma versão da campanha.",
  "Track deliverables and approve a campaign version."
 ],
 [
  "Integração de pedidos com a operação",
  "Order integration for operations"
 ],
 [
  "Envie um pedido da loja e teste o reenvio sem duplicar o registro.",
  "Send a store order and retry it without duplicating the record."
 ],
 [
  "Catálogo B2B com lista de cotação",
  "B2B catalog with a quote list"
 ],
 [
  "Selecione produtos e quantidades para montar uma cotação.",
  "Choose products and quantities to prepare a quote request."
 ],
 [
  "Checklist de vistoria em campo",
  "Field inspection checklist"
 ],
 [
  "Registre pendências e baixe o relatório da visita.",
  "Report issues and download the inspection report."
 ],
 [
  "Agendamento com convite de calendário",
  "Scheduling with calendar invites"
 ],
 [
  "Escolha um horário e abra o compromisso no seu calendário.",
  "Choose a time and open the appointment in your calendar."
 ],
 [
  "O que eu desenvolvo",
  "What we build"
 ],
 [
  "Escolha um serviço para ver um exemplo",
  "Choose a service to see an example"
 ],
 [
  "Sites e landing pages",
  "Websites and landing pages"
 ],
 [
  "Interfaces web",
  "Web interfaces"
 ],
 [
  "Formulários e integrações",
  "Forms and integrations"
 ],
 [
  "Ver a página de captação",
  "View the lead generation page"
 ],
 [
  "Testar o painel para agências",
  "Try the agency dashboard"
 ],
 [
  "Testar a integração de pedidos",
  "Try the order integration"
 ],
 [
  "Desenvolvimento para agências",
  "Development for agencies"
 ],
 [
  "Agência",
  "Agency"
 ],
 [
  "Envia o layout",
  "Share the design"
 ],
 [
  "Seu time compartilha o briefing e os arquivos. Combinamos o escopo e o prazo.",
  "Your team shares the brief and assets. We agree on scope and timing."
 ],
 [
  "Desenvolvo o site",
  "I build the website"
 ],
 [
  "Transformo o layout em páginas responsivas e conecto os formulários previstos.",
  "I turn the design into responsive pages and connect the planned forms."
 ],
 [
  "Agência + Pedro",
  "Agency + Pedro"
 ],
 [
  "Revisamos a entrega",
  "We review the delivery"
 ],
 [
  "Vocês testam a versão navegável. Faço os ajustes combinados e preparo a publicação ou o repasse.",
  "You test a working version. I make the agreed changes and prepare it for launch or handoff."
 ],
 [
  "Dúvidas frequentes",
  "Frequently asked questions"
 ],
 [
  "Você desenvolve a partir de um layout da agência?",
  "Can you build from our agency’s design?"
 ],
 [
  "Sim. Pode me passar o layout, o briefing e os arquivos disponíveis. Antes de começar, alinhamos o que falta e como a página deve se comportar no celular.",
  "Yes. Send me the design, brief and available assets. Before we start, we agree on what is missing and how the page should work on mobile."
 ],
 [
  "Posso contratar só uma parte do projeto?",
  "Can I hire you for part of a project?"
 ],
 [
  "Sim. Podemos combinar uma entrega pontual, como implementar uma landing page, ajustar um formulário ou integrar uma página a uma ferramenta que seu time já usa.",
  "Yes. We can agree on a focused deliverable, such as building a landing page, adjusting a form or integrating a page with a tool your team already uses."
 ],
 [
  "Como são definidos prazo e orçamento?",
  "How do you set the timeline and budget?"
 ],
 [
  "Depois de entender o escopo, o que já está pronto e quais integrações entram na entrega, eu proponho o valor e o cronograma para aprovação. Se você já tem uma data de campanha, inclua no briefing.",
  "Once I understand the scope, existing assets and integrations, I propose a price and timeline for approval. Include any campaign date in your brief."
 ],
 [
  "Como funciona a revisão antes de publicar?",
  "How does review work before launch?"
 ],
 [
  "Você recebe uma versão navegável para revisar. Validamos o que foi combinado, incluindo os fluxos principais, antes de decidir se eu ajudo na publicação ou faço o repasse ao seu time.",
  "You get a working version to review. We test the agreed scope and key workflows, then decide how to handle launch or handoff."
 ],
 [
  "A entrega inclui hospedagem e suporte?",
  "Are hosting and support included?"
 ],
 [
  "Hospedagem, publicação e suporte após a entrega são definidos na proposta. Assim fica claro quem cuida do site depois e quais ajustes fazem parte da entrega.",
  "The proposal defines hosting, launch and ongoing support, including who maintains the site and which adjustments are included."
 ],
 [
  "Atende empresas diretamente?",
  "Do you work directly with businesses?"
 ],
 [
  "Sim. Se você ainda não tem um layout, me conte o objetivo e o que precisa funcionar. A primeira conversa serve para definir por onde começar.",
  "Yes. If you don’t have a design yet, tell me your goal and what needs to work. Our first conversation helps define where to start."
 ],
 [
  "Tenho outra dúvida no WhatsApp",
  "Ask another question on WhatsApp"
 ],
 [
  "Vamos conversar",
  "Let’s talk"
 ],
 [
  "sobre seu projeto?",
  "about your project"
 ],
 [
  "Me conte o que precisa sair do papel, o que já está pronto e se você tem uma data em mente. Assim já conseguimos conversar sobre escopo.",
  "Tell me what you want to launch, what is ready and whether you have a date in mind. We can use that to discuss scope."
 ],
 [
  "Página de contato",
  "Contact page"
 ],
 [
  "Montar meu briefing",
  "Prepare my brief"
 ],
 [
  "Outras formas de contato",
  "Other ways to get in touch"
 ],
 [
  "Contato direto",
  "Direct contact"
 ],
 [
  "E-mail",
  "Email"
 ],
 [
  "Conte sua ideia.",
  "Tell us your idea."
 ],
 [
  "Preencha seu briefing e continue no WhatsApp. Você poderá revisar a mensagem antes de enviá-la. Se preferir, escreva para",
  "Fill out your brief and continue on WhatsApp. You can review the message before sending it. You can also email"
 ],
 [
  "Seu nome",
  "Your name"
 ],
 [
  "Como posso chamar você?",
  "What should we call you?"
 ],
 [
  "voce@empresa.com",
  "you@company.com"
 ],
 [
  "Empresa ou agência",
  "Company or agency"
 ],
 [
  "(opcional)",
  "(optional)"
 ],
 [
  "Nome da empresa",
  "Company name"
 ],
 [
  "O que você quer construir?",
  "What do you want to build?"
 ],
 [
  "Conte o objetivo, o que precisa funcionar e se já existe um prazo.",
  "Describe your goal, what needs to work and any deadline."
 ],
 [
  "Continuar no WhatsApp",
  "Continue on WhatsApp"
 ],
 [
  "Fechar formulário",
  "Close form"
 ],
 [
  "Conte o que você precisa colocar no ar. Se já tiver um layout, um briefing ou uma data em mente, inclua na mensagem.",
  "Tell us what you need to launch. Include any designs, briefs or target dates you already have."
 ],
 [
  "Me conte sobre seu projeto",
  "Tell us about your project"
 ],
 [
  "Preencha o briefing e revise sua mensagem com o Pedro no WhatsApp.",
  "Fill out the brief and review your message to Pedro on WhatsApp."
 ],
 [
  "Canais de atendimento",
  "Contact channels"
 ],
 [
  "Fale diretamente com Pedro",
  "Chat directly with Pedro"
 ],
 [
  "Sites para pequenos negócios e agências | Caos Domado",
  "Websites for Small Businesses and Agencies | Caos Domado"
 ],
 [
  "Contato para projetos de sites e integrações | Caos Domado",
  "Contact About Websites and Integrations | Caos Domado"
 ],
 [
  "Seu time cria.",
  "Your team designs."
 ],
 [
  "Eu desenvolvo.",
  "I build."
 ],
 [
  "Seu layout aprovado vira um site ou interface navegável, com revisão e repasse para a sua agência.",
  "Turn your approved design into a working website or interface, with review and handoff for your agency."
 ],
 [
  "Mais pedidos de",
  "Get more"
 ],
 [
  "orçamento.",
  "quote requests."
 ],
 [
  "Veja como seu cliente escolhe um serviço e pede orçamento pelo celular.",
  "See how your customer can choose a service and request a quote on mobile."
 ],
 [
  "Testar a página de captação",
  "Try the lead generation page"
 ],
 [
  "Seu briefing está pronto. Revise e envie a mensagem na conversa do WhatsApp.",
  "Your brief is ready. Review and send the message in WhatsApp."
 ],
 [
  "Abrir conversa no WhatsApp",
  "Open chat on WhatsApp"
 ]
]);
 let selectedLanguage = storedLanguage();
 let locale = selectedLanguage ?? deviceLanguage();
 let selectedTheme = storedTheme();
 const localizedImages = [...document.querySelectorAll('img[data-en-src]')].map(image => ({
  image,
  originalSrc: image.getAttribute('src'),
  originalSrcset: image.getAttribute('srcset')
 }));
 const originals = new WeakMap();
 const attributes = ['placeholder', 'aria-label', 'alt'];
 function translate(input) {
  return locale === 'en' ? (dictionary.get(input) ?? input) : input;
 }
 dictionary.set('Me conte o que você quer lançar, o que já tem pronto e qual prazo tem em mente.', 'Tell me what you want to launch, what is ready and when you’d like to go live.');
 dictionary.set('Como funcionam o escopo, a revisão e a publicação do seu projeto.', 'How we handle scope, reviews and launch for your project.');
 dictionary.set('Ficou com outra dúvida?', 'Still have a question?');
 dictionary.set('Contato sobre dúvidas', 'Questions and contact');
 dictionary.set('Já tem o layout aprovado? Eu assumo a implementação e trabalho com sua equipe até a entrega.', 'Have an approved design? I handle implementation and work with your team through delivery.');
 dictionary.set('Quer ver como funciona uma revisão?', 'Want to see how a review works?');
 dictionary.set("Já tem o layout aprovado? A Caos Domado assume a implementação e trabalha com sua equipe até a entrega.", "Have an approved design? Caos Domado handles implementation and works with your team through delivery.");
 dictionary.set("Desenvolvemos o site", "We build the website");
 dictionary.set("Implementamos o layout, testamos no computador e no celular e conectamos os formulários previstos.", "We implement the design, test it on desktop and mobile, and connect the planned forms.");
 dictionary.set("Agência + Caos Domado", "Agency + Caos Domado");
 dictionary.set("Sua equipe testa a versão navegável. Fazemos os ajustes combinados e preparamos a publicação ou o repasse.", "Your team tests a working version. We make the agreed changes and prepare it for launch or handoff.");
 dictionary.set('Voltar ao topo', 'Back to top');
 dictionary.set('Identidade visual do portfólio Pedro aplicada a um notebook e um celular', 'The Pedro portfolio branding shown on a laptop and phone');
 for (const [pt, en] of [["O que podemos criar para você", "What we can build for you"], ["Escolha o que você precisa resolver e veja um exemplo funcionando.", "Choose what you need to solve and explore a working example."], ["Escolha o que precisa resolver", "Choose what you need to solve"], ["Receber pedidos de orçamento", "Receive quote requests"], ["Seu cliente escolhe o serviço e envia o pedido de orçamento pelo celular.", "Customers choose a service and request a quote on their phone."], ["Ver a página de orçamento", "View the quote request page"], ["Pessoa solicitando orçamento de manutenção no tablet.", "Someone requesting a maintenance quote on a tablet."], ["Organizar o trabalho da equipe", "Organize your team’s work"], ["Sua equipe vê o que está pronto, o que precisa de revisão e quem aprova cada entrega.", "Your team sees what is ready, what needs review and who approves each deliverable."], ["Testar o painel de entregas", "Try the delivery dashboard"], ["Profissional revisando uma entrega em um painel de projetos.", "A team member reviewing a deliverable on a project dashboard."], ["Enviar pedidos para a expedição", "Send orders to fulfillment"], ["O pedido da loja aparece na fila de separação com os dados certos. Se a loja reenviar o pedido, a fila mantém um único registro.", "Store orders appear in the packing queue with the right details. Retrying the same order keeps a single record."], ["Testar o envio de um pedido", "Try sending an order"], ["Pedido com o mesmo número na etiqueta da caixa e no painel de expedição.", "The same order number on a package label and the fulfillment dashboard."], ["Montar cotações de produtos", "Build product quote lists"], ["O comprador escolhe os produtos e as quantidades e baixa uma lista para pedir cotação.", "Buyers choose products and quantities and download a list to request a quote."], ["Experimentar o catálogo", "Try the product catalog"], ["Cliente escolhendo luminárias e quantidades no catálogo.", "A buyer selecting lights and quantities from the catalog."], ["Registrar vistorias no celular", "Record inspections on mobile"], ["Quem faz a visita marca o que conferiu, anota pendências e leva o relatório pronto.", "Inspectors check off completed items, record issues and leave with a report."], ["Testar uma vistoria", "Try an inspection"], ["Profissional preenchendo uma lista de vistoria em um tablet.", "A field technician filling out an inspection checklist on a tablet."], ["Agendar atendimentos", "Schedule appointments"], ["O cliente escolhe um horário disponível e pode salvar o compromisso no calendário.", "Customers choose an available time and can add the appointment to their calendar."], ["Testar um agendamento", "Try booking an appointment"], ["Pessoa escolhendo um horário de atendimento no celular.", "Someone choosing an appointment time on a phone."]]) dictionary.set(pt, en);
 for (const [pt, en] of [["Ferramentas", "Tools"], ["Automações", "Automations"], ["Abra um trabalho para ver como funciona na prática.", "Open a project to see how it works."], ["Site", "Website"], ["Site para pedir orçamento", "A website for quote requests"], ["Escolha um serviço e simule um pedido de orçamento pelo celular.", "Choose a service and try requesting a quote on your phone."], ["Ferramenta de trabalho", "Team tool"], ["Painel para aprovar entregas", "Delivery approval dashboard"], ["Abra uma entrega, confira os ajustes e aprove a versão.", "Open a deliverable, check the changes and approve the version."], ["Automação", "Automation"], ["Da loja à expedição", "From store to fulfillment"], ["Simule uma venda e acompanhe o pedido do pagamento até a coleta.", "Simulate a sale and follow the order from payment to pickup."], ["Catálogo para pedir cotação", "Catalog for quote requests"], ["Escolha luminárias e quantidades para baixar uma lista de cotação.", "Choose lights and quantities and download a quote list."], ["Vistoria pelo celular", "Mobile inspection"], ["Confira os itens, anote o que precisa de ajuste e baixe o relatório.", "Check the items, record any issues and download the report."], ["Agenda online", "Online appointments"], ["Escolha um horário e salve o compromisso no seu calendário.", "Choose a time and save the appointment to your calendar."]]) dictionary.set(pt, en);
 dictionary.set("Aprovação de site pelo cliente", "Client website approval");
 dictionary.set("Veja como o cliente pede ajustes e aprova o site antes de publicar.", "See how a client requests changes and signs off before launch.");
 dictionary.set("Seu cliente confere o site, envia os ajustes e deixa a aprovação registrada.", "Your client reviews the website, requests changes and records their approval.");
 dictionary.set("Experimentar a aprovação do site", "Try website approval");
 dictionary.set("Experimentar uma revisão com o cliente", "Try a client review");
 for (const [pt, en] of [
  ["O que muda na prática","What changes in practice"],
  ["Escolha uma situação para ver como o fluxo funciona.","Choose a scenario to see how it works."],
  ["Escolher uma situação","Choose a scenario"],
  ["Aprovar um site","Approve a website"],
  ["O cliente aprova a versão certa.","The client approves the right version."],
  ["A equipe envia uma prévia. O cliente pede ajustes ou aprova por ali, e a versão liberada fica registrada para a publicação.","The team sends a preview. The client can request changes or approve it there, and the approved version is recorded for publishing."],
  ["Página da campanha ao lado dos botões de aprovação e pedido de ajuste.","Campaign page next to the approval and request changes buttons."],
  ["Receber orçamentos","Get quote requests"],
  ["O pedido já chega com o serviço escolhido.","Each inquiry arrives with the selected service."],
  ["O cliente seleciona o serviço e descreve o que precisa. A equipe recebe esse contexto para dar sequência no atendimento.","The customer selects a service and describes what they need. The team gets that context to follow up."],
  ["Página ClimaPro com opções de manutenção e botão para solicitar orçamento.","ClimaPro page with maintenance options and a quote request button."],
  ["Preparar pedidos","Pack orders"],
  ["O pedido pago entra na fila de separação.","The paid order goes straight to the packing queue."],
  ["A equipe confere os itens e as quantidades que vieram da loja, gera a etiqueta e registra a coleta.","The team checks the items and quantities from the store, generates a label and records pickup."],
  ["Checklist de separação com os produtos do pedido e seu estado na loja e na expedição.","Packing checklist with the order items and their status in the store and warehouse."],
  ["Ver a aprovação de site","See website approval"],
  ["Ver a página de orçamento","See the quote request page"],
  ["Ver o fluxo de expedição","See the fulfillment workflow"]
 ]) dictionary.set(pt, en);
 dictionary.set("Conversar sobre meu layout", "Talk about my design");
 dictionary.set("Quero uma página de orçamento", "I want a quote request page");
 for (const [pt, en] of [
  ['Envie os detalhes do seu projeto para a Caos Domado. Você pode continuar no WhatsApp depois.', 'Send the details of your project to Caos Domado. You can continue on WhatsApp afterwards.'],
  ['Autorizo o uso dos meus dados para responder a este pedido.', 'I agree to the use of my information to respond to this request.'],
  ['Enviar projeto', 'Send project'],
  ['Enviando seu projeto…', 'Sending your project…'],
  ['Recebemos seu projeto. Se preferir, continue no WhatsApp.', 'We received your project. You can continue on WhatsApp if you prefer.'],
  ['Não conseguimos confirmar o recebimento. Tente novamente ou envie pelo WhatsApp.', 'We could not confirm receipt. Try again or send your project on WhatsApp.']
 ]) dictionary.set(pt, en);
 for (const [pt, en] of window.caosPreferenceTranslations ?? []) dictionary.set(pt, en);
 window.caosTranslate = translate;
 for (const [pt, en] of [["Identidade da Caos Domado aplicada a um site no monitor e a uma prova impressa.", "Caos Domado branding on a website shown on a monitor beside a printed proof."], ["Painel de projetos com o site institucional selecionado, status Em revisão e checklist de entrega.", "Project dashboard showing a company website under review and its delivery checklist."], ["O pedido do Estúdio Aurora aparece preenchido no tablet e marcado como recebido no painel do notebook.", "Estúdio Aurora’s request is filled in on the tablet and marked as received on the laptop."], ["Preencha este campo com pelo menos ", "Enter at least "], [" caracteres.", " characters."]]) dictionary.set(pt, en);

 for (const [pt, en] of [
  ["Ver oferta do Catálogo Online", "See the Online Catalog offer"],
  ["Catálogo online para orçamento pelo WhatsApp | Caos Domado", "Online Catalog for WhatsApp Quotes | Caos Domado"],
  ["Seus clientes escolhem os produtos e", "Your customers pick products and"],
  ["pedem orçamento pelo WhatsApp.", "request a quote on WhatsApp."],
  ["Um catálogo online para a sua loja. O comprador escolhe as quantidades e envia a lista de cotação em uma única mensagem.", "An online catalog for your shop. Buyers choose quantities and send their quote list in a single message."],
  ["R$ 1.690", "R$ 1,690"],
  ["Entrega em 7 dias úteis*", "Delivery in 7 business days*"],
  ["Falar com Pedro no WhatsApp", "Talk to Pedro on WhatsApp"],
  ["Ver demonstração da lista", "See the sample quote list"],
  ["*A partir da entrada e do recebimento dos materiais e acessos necessários. O tempo de aprovação do cliente fica fora da contagem.", "*The timeline starts once we receive the deposit, materials and required access. Time spent awaiting client approval is excluded."],
  ["Luminária pendente verde sobre uma mesa de madeira.", "A green pendant light above a wooden table."],
  ["Exemplo de lista de cotação", "Sample quote list"],
  ["Pendente Vale", "Vale pendant light"],
  ["Abajur Serra", "Serra table lamp"],
  ["Na demonstração, você pode baixar uma lista de teste com luminárias.", "In the Portuguese-language demo, you can download a sample quote list for lighting products."],
  ["O que está incluído", "What’s included"],
  ["Para lojas que já recebem pedidos de orçamento pelo WhatsApp, de floriculturas e lojas de jardinagem a outros comércios com produtos para cotar.", "For shops that already receive quote requests through WhatsApp, from florists and garden centers to other retailers that sell by quote."],
  ["Catálogo online para uma linha de produtos, com cadastro inicial de até 15 itens.", "An online catalog for one product line, with up to 15 items added for you."],
  ["Seleção de produtos e quantidades pelo comprador.", "Buyers can select products and quantities."],
  ["Envio da lista de cotação pelo comprador no WhatsApp da loja.", "Buyers send their quote list to your shop on WhatsApp."],
  ["Uma rodada consolidada de ajustes.", "One consolidated round of revisions."],
  ["O escopo é de catálogo para cotação. Loja virtual, pagamento online e sincronização de estoque ficam fora do pacote.", "The package covers a quote-request catalog. E-commerce, online payments and inventory sync are outside the scope."],
  ["Como contratar", "How to get started"],
  ["Conte ao Pedro qual linha de produtos você quer colocar no catálogo.", "Tell Pedro which product line you want to feature."],
  ["R$ 845 de entrada (50%)", "R$ 845 deposit (50%)"],
  ["Envie os materiais e acessos necessários para começar.", "Send the materials and access we need to get started."],
  ["R$ 845 na entrega (50%)", "R$ 845 on delivery (50%)"],
  ["Domínio, hospedagem e ferramentas pagas são cobrados à parte.", "Domain, hosting and paid tools cost extra."],
  ["Voltar ao portfólio", "Back to portfolio"],
 ]) dictionary.set(pt, en);

 const localizedContacts = [...document.querySelectorAll("a[data-whatsapp-en]")].map(link => {
  const text = new URL(link.href).searchParams.get("text") || "";
  const [message, ...tracking] = text.split("\n\n");
  return {link, message, tracking};
 });

 function applyLanguage() {
  root.lang = locale;
  for (const {link, message, tracking} of localizedContacts) {
   const url = new URL(link.href);
   url.searchParams.set('text', [locale === 'en' ? link.dataset.whatsappEn : message, ...tracking].join('\n\n'));
   link.href = url.href;
  }
  for (const { image, originalSrc, originalSrcset } of localizedImages) {
   const src = locale === 'en' ? image.dataset.enSrc : originalSrc;
   const srcset = locale === 'en' ? image.dataset.enSrcset : originalSrcset;
   if (srcset && image.getAttribute('srcset') !== srcset) image.setAttribute('srcset', srcset);
   if (image.getAttribute('src') !== src) image.setAttribute('src', src);
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
   if (node.parentElement.closest('script, style, .header-preferences, [data-no-translate]')) continue;
   const original = originals.get(node) || node.nodeValue;
   if (!dictionary.has(original.trim())) continue;
   originals.set(node, original);
   node.nodeValue = original.replace(original.trim(), translate(original.trim()));
  }
  for (const element of document.querySelectorAll('[placeholder], [aria-label], img[alt]')) {
   if (element.closest('.header-preferences, [data-no-translate]')) continue;
   const original = originals.get(element) || {};
   for (const attribute of attributes) {
    const value = original[attribute] ?? element.getAttribute(attribute);
    if (!dictionary.has(value)) continue;
    original[attribute] = value;
    element.setAttribute(attribute, translate(value));
   }
   originals.set(element, original);
  }
  const title = originals.get(document) || document.title;
  originals.set(document, title);
  document.title = translate(title);
  language.querySelector('[data-language-code]').textContent = locale === 'en' ? 'EN' : 'PT';
  const languageNames = locale === 'en' ? {'pt-BR':'Portuguese',en:'English'} : {'pt-BR':'Português',en:'Inglês'};
  languageOptions.forEach(option => {
   option.setAttribute('aria-checked', String(option.dataset.locale === locale));
   option.querySelector('[data-localized-label]').textContent = languageNames[option.dataset.locale];
  });
  language.setAttribute('aria-label', locale === 'en' ? 'Language' : 'Idioma');
  languageMenu.setAttribute('aria-label', language.getAttribute('aria-label'));
  const menu = document.querySelector('.menu-toggle');
  if (menu) menu.querySelector('.sr-only').textContent = translate(menu.getAttribute('aria-expanded') === 'true' ? 'Fechar menu' : 'Abrir menu');
  applyTheme();
  document.dispatchEvent(new Event('caos-language-change'));
 }

 function applyTheme() {
  root.dataset.theme = selectedTheme ?? deviceTheme();
  const dark = root.dataset.theme === 'dark';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1b1a19' : '#f3e5d6');
  const favicon = document.querySelector('[data-theme-icon]');
  if (favicon) favicon.setAttribute('href', favicon.dataset[root.dataset.theme]);
  theme.setAttribute('aria-label', locale === 'en' ? (dark ? 'Use light theme' : 'Use dark theme') : (dark ? 'Usar tema claro' : 'Usar tema escuro'));
  theme.title = theme.getAttribute('aria-label');
 }
 preferences.hidden = false;
 function openLanguageMenu(option = languageOptions.find(item => item.dataset.locale === locale)) {
  languageMenu.hidden = false;
  language.setAttribute('aria-expanded', 'true');
  option.focus();
 }
 function closeLanguageMenu(restoreFocus = false) {
  languageMenu.hidden = true;
  language.setAttribute('aria-expanded', 'false');
  if (restoreFocus) language.focus();
 }
 language.addEventListener('click', () => {
  if (languageMenu.hidden) openLanguageMenu();
  else closeLanguageMenu();
 });
 language.addEventListener('keydown', event => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  openLanguageMenu(event.key === 'ArrowUp' ? languageOptions.at(-1) : languageOptions[0]);
 });
 languageOptions.forEach(option => option.addEventListener('click', () => {
  selectedLanguage = locale = option.dataset.locale;
  save(languageKey, locale);
  applyLanguage();
  closeLanguageMenu(true);
 }));
 languageMenu.addEventListener('keydown', event => {
  const index = languageOptions.indexOf(document.activeElement);
  if (event.key === 'Escape') {
   event.preventDefault();
   event.stopPropagation();
   closeLanguageMenu(true);
   return;
  }
  const offsets = {ArrowDown:1, ArrowUp:-1};
  if (event.key in offsets || event.key === 'Home' || event.key === 'End') {
   event.preventDefault();
   const size = languageOptions.length;
   const next = event.key === 'Home' ? 0 : event.key === 'End' ? size - 1 : (index + offsets[event.key] + size) % size;
   languageOptions[next].focus();
  }
 });
 const languageControl = language.parentElement;
 document.addEventListener('pointerdown', event => {
  if (!languageMenu.hidden && !languageControl.contains(event.target)) closeLanguageMenu();
 });
 languageControl.addEventListener('focusout', event => {
  if (!languageControl.contains(event.relatedTarget)) closeLanguageMenu();
 });
 theme.addEventListener('click', () => {
  selectedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  save(themeKey, selectedTheme);
  applyTheme();
 });
 function updateLanguage() {
  const nextLocale = selectedLanguage ?? deviceLanguage();
  if (nextLocale === locale) return;
  locale = nextLocale;
  applyLanguage();
 }
 window.addEventListener('languagechange', updateLanguage);
 colorScheme.addEventListener('change', applyTheme);
 window.addEventListener('storage', event => {
  if (event.key === themeKey || event.key === null) {
   selectedTheme = storedTheme();
   applyTheme();
  }
  if (event.key === languageKey || event.key === null) {
   selectedLanguage = storedLanguage();
   updateLanguage();
  }
 });
 applyLanguage();
})();
