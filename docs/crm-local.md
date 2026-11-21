# CRM local para aprovação

A primeira etapa reúne Hoje, Agenda e Atendimentos. O servidor usa a API do CRM e um PostgreSQL embarcado neste computador. A amostra inicial é fictícia. Novos registros feitos nesta prévia ficam no banco local mesmo após reiniciar.

## Abrir

No PowerShell, a partir desta pasta:

```powershell
npm --prefix app ci
npm --prefix app run crm:local
```

Abra http://127.0.0.1:4388/crm e use a chave local `crm-local`. O servidor escuta apenas no próprio computador. Feche a janela do terminal ou pressione Ctrl+C para encerrar.

## Fluxo para testar

1. Em Hoje, confira a agenda, os retornos de hoje e os atrasados.
2. Use Agendar para criar um compromisso associado a um contato. Confira o mesmo compromisso na Agenda, mude o horário e registre o resultado.
3. Use Registrar atividade para registrar uma ligação ou outro atendimento. Defina a próxima ação e a data de retorno, confira a pendência em Hoje e o histórico em Atendimentos.
4. Role a página Hoje até **Desempenho** e **Testes de atendimento**. Alterne o período das métricas e atribua um contato a uma abordagem. As respostas e reuniões vêm das atividades registradas após essa atribuição.
5. Recarregue para confirmar que o estado foi mantido. Os controles de idioma, tema e saída seguem o header do CRM.

O banco da prévia fica em `%LOCALAPPDATA%\CaosDomado\CRM-local\pgdata`. Para testes isolados use `CRM_LOCAL_DATA_DIR=memory://` com uma porta própria em `CRM_LOCAL_PORT`. Defina `CRM_LOCAL_NO_SEED=1` antes de iniciar uma base nova para começar vazia.

A configuração local não precisa de Neon, Resend nem credenciais de produção. O servidor aplica as migrações de operações e testes no início. A visão por responsável reúne os registros do único operador local. O indicador **No prazo** usa os compromissos cujo horário já venceu, com conclusão até o fim previsto. Contas individuais e atribuição por membro da equipe ficam para a etapa de equipe.
