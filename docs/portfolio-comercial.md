# Publicação do portfólio comercial

A Vercel publica a pasta `app/` deste repositório. Ela contém a versão estática
do portfólio, incluindo página inicial, contato, imagens em português e inglês
e demonstrações. A versão anterior fica disponível no histórico do Git.

1. Faça as alterações em uma branch e valide o deploy de prévia.
2. Teste a página inicial, a página de contato e as demonstrações. Confira a
   alternância de idioma e tema e os links de contato.
3. Após aprovar a prévia, integre na branch principal e confira a publicação
   no domínio real. Em caso de regressão, promova novamente o último deploy
   estável e reverta a alteração no Git.

## Campanhas e CRM

Use `publico=agencias` ou `publico=prestadores` e acrescente `utm_source`,
`utm_medium` e `utm_campaign`. Prefira identificadores curtos em minúsculas,
como `linkedin/prospeccao-agencias`. Tanto o WhatsApp quanto o e-mail
incluem a referência, a campanha e a origem, no formato usado no painel
privado em `/crm/` do próprio portfólio. Os pedidos enviados em
`/contato.html` aparecem automaticamente como novos contatos. Para uma
conversa que chegou diretamente pelo WhatsApp ou e-mail, use **Novo contato**
e **Trazer do WhatsApp ou e-mail**. O painel abre o contato existente se a
referência já estiver cadastrada. Atualize a etapa e registre o valor real
ao fechar a venda. A seção **Campanhas e vendas** reúne entradas, demos, cliques, contatos,
propostas abertas e valor fechado por período. A visualização também agrupa
por meio e criativo. Cliques registram intenção. Pedidos enviados são
oportunidades gravadas no CRM, e vendas usam a data de fechamento.
A coleta do painel começa no primeiro evento gravado após a ativação.
O histórico anterior permanece na Vercel Analytics. Identificadores de teste
reservados: origem `verificacao` ou campanha com prefixo `qa-`.

Na Vercel, os eventos `portfolio_entrada`, `portfolio_demo_aberta`,
`portfolio_whatsapp_clique`, `portfolio_email_clique` e
`portfolio_projeto_enviado` usam as propriedades
`campanha` (origem/campanha) e `cta` (página de entrada, demo ou posição
do botão, conforme o evento). A entrada é contada uma vez por sessão e
referência da campanha. Clique é um sinal de intenção, enquanto o CRM
registra conversas recebidas, propostas e vendas.

Guarde nomes, e-mails e telefones apenas no CRM privado. O repositório
público é destinado ao código e aos arquivos publicados.

## Operação do CRM

A hospedagem está no projeto Vercel `portfolio`, na equipe
`pedrobentos-projects`. O projeto de banco exclusivo do CRM pertence à
conta Neon `caosdomado@gmail.com`. Na Vercel, configure as variáveis
sensíveis `CRM_DB_DATABASE_URL`, `CRM_ACCESS_KEY_HASH` e
`CRM_SESSION_SECRET`. Use uma chave aleatória longa para o painel, seu
SHA-256 hexadecimal em `CRM_ACCESS_KEY_HASH` e um segredo aleatório
independente para as sessões. Use chaves e segredos distintos em cada ambiente.

Execute `docs/crm-schema.sql` com a credencial administrativa do banco antes
do primeiro deploy. Use `docs/crm-runtime-role.sql` com duas conexões
de aplicação, uma com acesso apenas ao schema `crm` e outra com acesso apenas
ao schema `crm_preview`. Use a conexão correspondente em cada ambiente.
Mantenha a credencial de migração fora da aplicação. O formulário original do
portfólio continua oferecendo WhatsApp como alternativa quando o envio ao CRM
não é confirmado. O painel não depende de uma planilha para registrar contatos
e vendas.

Para validar uma prévia, abra uma campanha de teste, navegue até o contato,
envie um pedido fictício, confirme a origem no painel e registre uma venda.
Confirme o valor no resumo da campanha depois de recarregar a página. Teste
também o retorno de acesso não autorizado ao consultar o painel sem sessão.

### Evolução da operação comercial

Aplique estas migrações na ordem, com a credencial administrativa. Elas são
aditivas em `crm` e `crm_preview`, com permissões de runtime restritas ao
schema de cada ambiente.

1. `docs/crm-intake-followup.sql` adiciona a data de retorno e distingue a
   referência do pedido da referência da visita. O formulário conserva a
   referência do pedido para uma repetição após falha de rede.
2. `docs/crm-funnel.sql` adiciona os dados de meio e criativo e a coleta
   agregada no painel. A API valida os eventos e deduplica por visita, ação
   e posição. O identificador de visita da coleta é diferente da referência
   exibida no contato e não contém e-mail, nome ou mensagem.
3. `docs/crm-notifications.sql` enfileira o aviso junto com a gravação de um
   pedido novo do formulário. O worker recebe o segredo `CRON_SECRET` pela
   Vercel, usa uma chave de envio `CRM_RESEND_API_KEY`, `CRM_NOTIFICATION_FROM` e
   `CRM_NOTIFICATION_TO` e faz novas tentativas com idempotência. A agenda
   de produção é executada a cada cinco minutos. O aviso contém a referência
   e o link privado, com os detalhes disponíveis dentro do CRM.
   Falhas definitivas aparecem no contato. O campo `sent_at` significa
   aceitação pelo Resend.

Use **Para hoje** e **Atrasados** para ver as oportunidades abertas que
precisam de retorno. A data segue o fuso de São Paulo. Ao testar a prévia,
simule a perda da resposta depois do primeiro envio, repita o envio e abra
um segundo pedido na mesma aba. Confira as referências distintas, atualize
a data de retorno e marque uma venda. Teste o processamento do aviso na
prévia com destinatário de teste da operação e dados fictícios.
