import { execFile, spawnSync } from 'node:child_process';
import { cp, copyFile, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projects = join(root, 'LandingPages/projects');
const output = join(root, 'app/exemplos/sites');
const base = '/exemplos/sites';
const demos = [
  ['001-BarbeariaPremium', 'barbearia', 'Barbearia', '#775a17', ['Corte de cabelo', 'Barba com toalha quente', 'Corte e barba']],
  ['002-SalaoDeBelezaPremium', 'salao', 'Salão de beleza', '#7c501d', ['Corte e finalização', 'Coloração', 'Penteado para um evento']],
  ['003-EsmalteriaChic', 'esmalteria', 'Esmalteria', '#8c4c51', ['Manicure designer', 'Nail art', 'Spa de mãos e pés']],
  ['004-ClinicaEsteticaLux', 'clinica-estetica', 'Clínica de estética', '#225571', ['Avaliação inicial', 'Informações sobre atendimento facial', 'Informações sobre atendimento corporal']],
  ['005-BiomedicaEsteta', 'biomedicina', 'Biomedicina estética', '#79522c', ['Conversa sobre avaliação', 'Informações sobre atendimento facial', 'Informações sobre cuidados prévios']],
  ['006-OdontologiaPremium', 'dentista', 'Dentista', '#224e91', ['Primeira avaliação', 'Consulta de rotina', 'Informações sobre alinhadores']],
  ['007-PsicologiaViva', 'psicologia', 'Psicologia', '#365f53', ['Primeiro contato', 'Informações sobre sessão online', 'Informações sobre horários']],
];
const photoReplacements = new Map([
  ['photo-1523213139764-6677f5024bb0', 'photo-1490730141103-6cac27aaab94'],
  ['photo-1526045431048-f857369aba09', 'photo-1522338140262-f46f5913618a'],
]);
const phrases = new Map([
  ['Especialistas Renomados', 'Corte e coloração'],
  ['Ativos Premium', 'Cuidados faciais'],
  ['Padrão Internacional', 'Atendimento com hora marcada'],
  ['Tecnologia e ativos premium para resultados visíveis e duradouros na sua pele.', 'Apresente os tipos de cuidados faciais e o que conversar na avaliação.'],
  ['2.5k+', 'Cores'],
  ['Clientes Felizes', 'Escolha o acabamento'],
  ['500+', 'Arte'],
  ['Cores Exclusivas', 'Inspire seu próximo desenho'],
  ['Escolha o seu momento Bellezza', "Escolha seu momento na L’Art des Ongles"],
  ['Referência em Medicina Estética', 'Avaliação em medicina estética'],
  ['A Ciência da', 'Cuidado e'],
  ['Beleza Real', 'Informação'],
  ['Onde a alta tecnologia encontra o cuidado médico especializado. Protocolos personalizados para realçar sua essência com naturalidade e segurança.', 'Conheça as linhas de atendimento e veja como solicitar uma conversa inicial. A avaliação profissional orienta as opções em cada caso.'],
  ['15+', 'Pele'],
  ['Anos de Experiência', 'Avaliação facial'],
  ['10k+', 'Corpo'],
  ['Vidas Transformadas', 'Avaliação corporal'],
  ['Resultados Naturais', 'Avaliação individual'],
  ['Protocolos aprovados pela ANVISA e FDA', 'Orientações após a avaliação'],
  ['Nossa equipe é formada por médicos e especialistas certificados, dedicados a atualizações constantes nos maiores congressos mundiais de dermatologia e estética.', 'Aqui uma clínica pode apresentar sua equipe, as áreas de atendimento e o que esperar na primeira visita.'],
  ['Investimos nas plataformas mais renomadas do mundo para garantir precisão, conforto e resultados superiores.', 'Conheça as categorias de equipamentos que podem ser discutidas em uma avaliação.'],
  ['Cada face e corpo é único. Nossos tratamentos são desenhados para respeitar sua anatomia e entregar resultados harmônicos.', 'Veja as linhas de atendimento e converse com a equipe sobre quais opções podem ser avaliadas para você.'],
  ['Dra. Carolina Mendes', 'Estúdio de Biomedicina'],
  ['Certificação Biomédica', 'Avaliação inicial'],
  ['Pós-Graduada', 'Primeira visita'],
  ['em Estética Avançada', 'para conversar'],
  ['Membro Ativo', 'Orientações'],
  ['de Conselhos Estéticos', 'em cada etapa'],
  ['Formada em Biomedicina com especialização em Estética Avançada, a Estúdio de Biomedicina acredita que a beleza deve ser um reflexo da saúde e da harmonia interior.', 'Conheça a proposta de atendimento deste estúdio conceitual e as perguntas úteis antes de marcar uma avaliação.'],
  ['Seu método exclusivo une protocolos de alta performance com um olhar artístico, garantindo que cada intervenção seja sutil, elegante e, acima de tudo, segura.', 'A escolha de procedimentos, quando indicada, depende de avaliação e orientação profissional.'],
  ['Tratamento de base para regeneração do colágeno e firmeza duradoura da pele.', 'Informações iniciais sobre opções que podem ser discutidas em avaliação.'],
  ['Definição do contorno facial com técnicas enzimáticas e tecnologias associadas.', 'Entenda o que pode ser conversado numa avaliação sobre o contorno facial.'],
  ['Protocolos de Alta Performance', 'Áreas de atendimento'],
  ['Serviços selecionados que unem tecnologia de ponta e expertise técnica para resultados excepcionais.', 'Conheça os temas da avaliação e as informações que ajudam a orientar o atendimento.'],
  ['Tecnologia & Conforto Absoluto', 'Atendimento odontológico'],
  ['Redescubra a confiança de sorrir. Na Odonto Premium, unimos odontologia digital de alta precisão com um atendimento focado no seu bem-estar.', 'Conheça as especialidades e veja como funciona o primeiro contato para marcar uma avaliação.'],
  ['98%', 'Consulta'],
  ['Satisfação', 'Primeira avaliação'],
  ['5k+', 'Prevenção'],
  ['Procedimentos', 'Orientações de rotina'],
  ['Sorriso Perfeito', 'Pessoa sorrindo, em imagem ilustrativa'],
  ['Resultados Que Falam', 'Uma primeira conversa'],
  ['Sorria Sem Reservas.', 'Conheça as opções.'],
  ['Viva Sem Limites.', 'Tire suas dúvidas.'],
  ['Conforto Absoluto', 'Primeiro contato'],
  ['Alta Precisão', 'Acompanhamento'],
  ['O tratamento é doloroso?', 'Como funciona a primeira avaliação?'],
  ['Utilizamos protocolos de anestesia computadorizada e sedação consciente para garantir uma experiência totalmente indolor.', 'A equipe conversa sobre o motivo da visita e orienta os próximos passos.'],
  ['Quanto tempo dura o tratamento de lentes?', 'Como saber qual opção é indicada?'],
  ['Com o fluxo digital, conseguimos finalizar casos complexos em poucas sessões, muitas vezes em menos de 15 dias.', 'A indicação e o tempo variam conforme a avaliação profissional.'],
  ['Quais as formas de pagamento?', 'Como pedir informações?'],
  ['Oferecemos condições flexíveis e parcelamento em até 12x para facilitar o seu acesso ao sorriso dos sonhos.', 'Escolha o motivo do contato na simulação ao final da página.'],
  ['Lâminas ultra-finas de porcelana que corrigem cor, forma e alinhamento com naturalidade absoluta.', 'Converse na avaliação sobre indicações, alternativas e cuidados.'],
  ['Implantes de Carga Imediata', 'Implantes dentários'],
  ['Recupere sua função mastigatória e estética em tempo recorde com cirurgia guiada por computador.', 'A avaliação ajuda a orientar as opções de reabilitação oral.'],
  ['Invisalign (Ortodontia Digital)', 'Alinhadores ortodônticos'],
  ['Alinhe seus dentes de forma invisível e confortável com os alinhadores mais avançados do mundo.', 'Informe-se sobre o planejamento e o acompanhamento de um tratamento ortodôntico.'],
  ['Oferecemos tratamentos de alta complexidade com foco em resultados estéticos duradouros.', 'Veja as principais linhas de cuidado para conversar com a equipe durante uma avaliação.'],
  ['Adeus moldagens desconfortáveis. Mapeamento digital 100% preciso.', 'Recurso de registro de imagens para apoiar a avaliação.'],
  ['Veja seu novo sorriso antes mesmo de iniciar o tratamento.', 'Recursos para apresentar as opções que serão avaliadas.'],
  ['Sedação Consciente', 'Orientações antes da consulta'],
  ['Protocolos para uma experiência relaxante e sem traumas.', 'Converse com a equipe sobre dúvidas e cuidados prévios.'],
  ['Na Odonto Premium, a tecnologia não é apenas um luxo, é a garantia de que seu tratamento será mais rápido, preciso e confortável.', 'A página apresenta os recursos da clínica e explica como conversar com a equipe sobre seus cuidados.'],
  ['>100%</span>', '>Fluxo</span>'],
  ['CRP Ativo 06/123456', 'Psicoterapia'],
  ['Sigilo Absoluto', 'Confidencialidade'],
  ['Anos de Prática Clíncia', 'Primeiro contato'],
  ['10+', 'Escuta'],
  ['ato de cura.', 'ponto de partida.'],
  ['Dra. Marina Costa', 'Equipe de Psicologia Viva'],
  ['Sou a Equipe de Psicologia Viva, psicóloga apaixonada por acompanhar processos de transformação humana. Meu trabalho é oferecer um espaço livre de julgamentos, onde sua vulnerabilidade é respeitada e sua força é redescoberta.', 'Esta página permite apresentar como um atendimento psicológico pode começar e indicar um canal para o primeiro contato.'],
  ['Com especialização em Terapia Humanista, foco no momento presente e na capacidade intrínseca de cada indivíduo de encontrar seu próprio caminho para a plenitude.', 'Informe-se sobre formatos de sessão, horários e como funciona a conversa inicial.'],
  ['Um refúgio seguro para você explorar suas emoções, curar feridas e reencontrar seu equilíbrio interno através de uma terapia humanizada e empática.', 'Conheça a proposta de atendimento e veja como pedir informações para uma primeira conversa.'],
  ['Resposta em menos de 5 minutos', 'Demonstração com dados fictícios'],
]);

function requestMarkup(sector, accent, services) {
  const prompt = ['Dentista', 'Psicologia', 'Biomedicina estética', 'Clínica de estética'].includes(sector)
    ? 'Como seria seu primeiro contato?' : 'Qual serviço você quer pedir?';
  return '<section id="contato" class="portfolio-demo-request" style="--demo-accent:' + accent + '">\n'
    + ' <div><h2>' + prompt + '</h2><p>Escolha um serviço e veja a mensagem que este site montaria. O teste usa apenas as opções abaixo.</p></div>\n'
    + ' <div class="portfolio-demo-panel"><label for="demo-service">Serviço de interesse</label>\n'
    + '  <select id="demo-service">' + services.map(service => '<option>' + service + '</option>').join('') + '</select>\n'
    + '  <label for="demo-period">Melhor horário para receber retorno</label>\n'
    + '  <select id="demo-period"><option>Pela manhã</option><option>À tarde</option><option>Qualquer horário</option></select>\n'
    + '  <button type="button" data-demo-action disabled>Visualizar pedido de teste</button>\n'
    + '  <div class="portfolio-demo-result" hidden><h3 tabindex="-1">Mensagem de exemplo</h3><p data-demo-message></p>'
    + '<p>Nenhuma mensagem foi enviada.</p><a data-demo-contact href="https://wa.me/5519974149650?text='
    + encodeURIComponent('Olá, Pedro! Vi o exemplo de ' + sector + ' no portfólio e quero conversar sobre uma página para o meu negócio.')
    + '" target="_blank" rel="noopener noreferrer" data-campaign-placement="demo-resultado">Quero uma página para meu negócio</a></div>\n'
    + ' </div>\n</section>\n';
}

async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes:true});
  return (await Promise.all(entries.map(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }))).flat();
}

const media = join(output, 'media');
await mkdir(media, {recursive:true});
const images = new Map();
const scratch = await mkdtemp(join(tmpdir(), 'caos-acervo-export-'));
try {
  const defaultDeps = join(scratch, 'node_modules');
  const deps = process.env.CAOS_ACERVO_DEPS || defaultDeps;
  if (!process.env.CAOS_ACERVO_DEPS) {
    for (const file of ['package.json', 'package-lock.json']) {
      await copyFile(join(projects, demos[1][0], file), join(scratch, file));
    }
    const installation = spawnSync('npm', ['ci', '--no-audit', '--no-fund', '--prefer-offline'], {
      cwd:scratch, stdio:'inherit', shell:process.platform === 'win32',
    });
    if (installation.status !== 0) throw new Error('Falha ao instalar as dependências para exportação.');
  }
  if (deps !== defaultDeps) {
    const { symlink } = await import('node:fs/promises');
    await symlink(deps, defaultDeps, 'junction');
  }
  const require = createRequire(join(defaultDeps, 'astro', 'package.json'));
  const sharp = require('sharp');

  await Promise.all(demos.map(async ([folder, key, sector, accent, services]) => {
    const original = join(projects, folder);
    const project = join(scratch, key);
    const sitePath = base + '/' + key;
    await mkdir(project);
    await cp(join(original, 'src'), join(project, 'src'), {recursive:true});
    await cp(join(original, 'public'), join(project, 'public'), {recursive:true});
    const imageFolder = join(project, 'public', 'images');
    if (existsSync(imageFolder)) {
      for (const name of await readdir(imageFolder)) {
        if (!name.endsWith('.png')) continue;
        const image = join(imageFolder, name);
        await sharp(image).resize({width:1200, withoutEnlargement:true})
          .webp({quality:name === 'hero.png' ? 85 : 81}).toFile(image.replace(/\.png$/, '.webp'));
        await rm(image);
      }
    }
    await copyFile(join(original, 'package.json'), join(project, 'package.json'));
    let config = await readFile(join(original, 'astro.config.mjs'), 'utf8');
    config = config.replace('defineConfig({', 'defineConfig({ base: ' + JSON.stringify(sitePath + '/') + ',');
    await writeFile(join(project, 'astro.config.mjs'), config);

    for (const file of await walk(join(project, 'src'))) {
      if (!file.endsWith('.astro')) continue;
      let source = await readFile(file, 'utf8');
      source = source.replace(/"\/images\/([^"]+)\.png"/g, '"' + sitePath + '/images/$1.webp"')
        .replaceAll('"/favicon.svg"', '"' + sitePath + '/favicon.svg"')
        .replace(/^\s*import (?:Testimonials|SafeSpace) from [^\n]+\n/gm, '')
        .replace(/^\s*<(?:Testimonials|SafeSpace) \/>/gm, '');
      for (const [before, after] of phrases) source = source.replaceAll(before, after);
      if (key === 'dentista') {
        source = source.replace(/https:\/\/images\.unsplash\.com\/photo-1597764690523-15bea4c581c9\?[^"]+/g, base + '/media/dentista-consultorio.jpg')
          .replace('alt="Pessoa sorrindo, em imagem ilustrativa"', 'alt="Imagem ilustrativa de um consultório odontológico"')
          .replace('alt="Experience Smile"', 'alt="Consultório odontológico em imagem ilustrativa"');
      }
      if (key === 'biomedicina' && file.endsWith('About.astro')) {
        source = source.replace('absolute -inset-4 border border-[#C5A059]/30 rounded-3xl -z-10 translate-x-4 translate-y-4', 'hidden lg:block absolute -inset-4 border border-[#C5A059]/30 rounded-3xl -z-10 translate-x-4 translate-y-4');
      }
      for (const found of source.matchAll(/https:\/\/images\.unsplash\.com\/(photo-[^?"\s]+)\?[^"\s]+/g)) {
        const id = photoReplacements.get(found[1]) || found[1];
        source = source.replaceAll(found[0], base + '/media/' + id + '.jpg');
        if (!images.has(id)) {
          const file = join(media, id + '.jpg');
          if (existsSync(file)) continue;
          const cached = process.env.CAOS_ACERVO_IMAGE_CACHE && join(process.env.CAOS_ACERVO_IMAGE_CACHE, id + '.jpg');
          images.set(id, cached && existsSync(cached) ? copyFile(cached, file) :
            fetch('https://images.unsplash.com/' + id + '?auto=format&fit=crop&q=75&w=1000').then(async response => {
              if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Imagem indisponível: ' + id);
              await writeFile(file, Buffer.from(await response.arrayBuffer()));
            }));
        }
      }
      if (file.endsWith('BaseLayout.astro')) {
        source = source.replace('</head>', [
          ' <meta name="robots" content="noindex,nofollow" />',
          ' <link rel="stylesheet" href="' + base + '/demo.css" />',
          ' <script is:inline src="/assets/campanha.js" defer></script>',
          ' <script is:inline src="' + base + '/demo.js" defer></script>',
          '</head>',
        ].join('\n')).replace(/<body\b([^>]*)>/, '<body$1 data-campaign-demo="' + key + '">\n'
          + ' <aside class="portfolio-demo-bar" aria-label="Sobre a demonstração"><a href="/exemplos.html?tipo=orcamento">← Ver outros exemplos</a><span>Projeto demonstrativo</span></aside>');
      }
      if (file.endsWith('Navbar.astro')) {
        source = source.replaceAll('href="/"', 'href="' + sitePath + '/" aria-label="Início da demonstração"')
          .replace(/<button\b[\s\S]*?<\/button>/, '<a class="portfolio-mobile-request" href="#contato">Testar atendimento</a>')
          .replace(/<a\b[^>]*href="#(?:especialistas|sobre|galeria)"[^>]*>[^<]*<\/a>/g, (link) => {
            if ((key === 'salao' && link.includes('#especialistas')) || (key === 'barbearia' && link.includes('#sobre'))) return '';
            return link;
          });
      }
      if (file.endsWith('Footer.astro')) {
        source = '---\n---\n<footer class="portfolio-demo-footer"><a href="/exemplos.html?tipo=orcamento">Voltar aos exemplos</a><p>Exemplo fictício criado pelo Caos Domado.</p></footer>\n';
      }
      if (file.endsWith('FinalCTA.astro')) source = '---\n---\n' + requestMarkup(sector, accent, services);
      if (/[\\/]pages[\\/]index\.astro$/.test(file)) {
        source = source.replace(/description: "[^"\n]*"/, 'description: "Demonstração de uma página de serviços de ' + sector + ' criada pelo Caos Domado."');
        if (key === 'biomedicina') source = source.replace(/<section id="resultados"[\s\S]*?<\/section>/, '');
      }
      if (key === 'biomedicina' && file.endsWith('Navbar.astro')) {
        source = source.replace(/<a\b[^>]*href="#resultados"[^>]*>[^<]*<\/a>/g, '');
      }
      if (key === 'psicologia') source = source.replace(/<div class="absolute inset-0 bg-\[url\('[^']+'\)\][^>]*><\/div>/g, '');
      await writeFile(file, source);
    }
    const { stdout } = await run(process.execPath, [
      join(defaultDeps, 'astro', 'bin', 'astro.mjs'), 'build',
    ], {cwd:project, env:{...process.env, ASTRO_TELEMETRY_DISABLED:'1'}});
    const dist = join(project, 'dist');
    const html = await readFile(join(dist, 'index.html'), 'utf8');
    const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]));
    const safeHtml = html.replace(/<a\b[^>]*href="#([^"]+)"[^>]*>[\s\S]*?<\/a>/g, (anchor, id) => ids.has(id) ? anchor : '');
    await writeFile(join(dist, 'index.html'), safeHtml);
    const target = resolve(output, key);
    if (dirname(target) !== resolve(output)) throw new Error('Destino de exportação inesperado.');
    await rm(target, {recursive:true, force:true});
    await cp(dist, target, {recursive:true});
    console.log(key + ' · ' + stdout.split('\n').find(line => /page\(s\) built/.test(line))?.trim());
  }));
  await Promise.all(images.values());
  if (!existsSync(join(media, 'dentista-consultorio.jpg'))) throw new Error('Imagem editorial do consultório ausente em app/exemplos/sites/media.');
} finally {
  if (!scratch.startsWith(join(tmpdir(), 'caos-acervo-export-'))) throw new Error('Diretório temporário inesperado.');
  await rm(scratch, {recursive:true, force:true});
}
