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
incluem a referência, a campanha e a origem. Cole o texto com a referência
no CRM privado e atualize a etapa até registrar a venda e o valor.

Na Vercel, os eventos `portfolio_entrada`, `portfolio_demo_aberta`,
`portfolio_whatsapp_clique` e `portfolio_email_clique` usam as propriedades
`campanha` (origem/campanha) e `cta` (página de entrada, demo ou posição
do botão, conforme o evento). A entrada é contada uma vez por sessão e
referência da campanha. Clique é um sinal de intenção, enquanto o CRM
registra conversas recebidas, propostas e vendas.

Guarde nomes, e-mails e telefones apenas no CRM privado. O repositório
público é destinado ao código e aos arquivos publicados.
