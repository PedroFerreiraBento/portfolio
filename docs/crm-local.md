# CRM local para aprovação

A prévia reúne Hoje, Clientes, Agenda, Atendimentos, Oportunidades, Desempenho e Equipe. O servidor usa a API do CRM e um PostgreSQL embarcado neste computador. A amostra inicial é fictícia. Novos registros feitos nesta prévia ficam no banco local mesmo após reiniciar.

## Abrir

No PowerShell, a partir desta pasta:

```powershell
npm --prefix app ci
npm --prefix app run crm:local
```

Abra http://127.0.0.1:4388/crm e entre com uma conta de demonstração.

| Perfil | E-mail | Senha inicial |
|---|---|---|
| Administrador | `pedro@crm.local` | `crm-local-pedro` |
| Atendente | `marina@crm.local` | `crm-local-marina` |

O servidor escuta apenas no próprio computador. Feche a janela do terminal ou pressione Ctrl+C para encerrar.

## Fluxo para testar

Em **Clientes**, filtre a carteira por prazo, responsável ou etapa. Abra a ficha para revisar as interações, remarcar o retorno ou registrar um atendimento. Na aba **Oportunidades**, crie outro projeto para o mesmo cliente e confira se a carteira continua com uma única ficha. Use **Editar** na ficha para alterar os dados de contato ou transferir a carteira. No celular, volte da ficha para conferir que seus filtros foram preservados.

Em **Oportunidades**, crie um projeto em **Novo** e use **Registrar atividade** para confirmar o primeiro contato. Em **Mover etapa**, informe o envio e o próximo retorno da proposta, avance para **Negociação** se necessário e registre o resultado. As abas **Ganhas** e **Perdidas** mostram as oportunidades encerradas, e a ficha do projeto mantém o histórico de mudanças.

Em **Equipe**, selecione uma pessoa para acompanhar sua carteira, conferir os indicadores do período ou gerenciar o acesso. O administrador pode encerrar todas as sessões de um atendente. O atendente pode entrar novamente com a mesma senha se a conta continuar ativa.

1. Entre como Pedro. Na área **Equipe**, adicione uma conta. Em **Clientes**, edite uma oportunidade e escolha quem fica responsável por ela.
2. Agende um compromisso com a pessoa que vai atender. Em **Agenda**, confira o responsável, remarque e registre o resultado.
3. Entre em outra janela como atendente. Confira sua agenda, registre uma atividade e confirme o próximo retorno em **Hoje**.
4. Volte à conta de administração e filtre **Desempenho** pela pessoa. As atividades contam para quem as registrou, a pontualidade para o responsável pelo compromisso e as vendas para o responsável no momento do fechamento.
5. Teste a suspensão ou a redefinição de senha de uma conta de teste. Sessões anteriores da conta são encerradas quando uma senha muda ou a conta é suspensa.

O banco da prévia fica em `%LOCALAPPDATA%\CaosDomado\CRM-local\pgdata`. Para testes isolados use `CRM_LOCAL_DATA_DIR=memory://` com uma porta própria em `CRM_LOCAL_PORT`. Defina `CRM_LOCAL_NO_SEED=1` antes de iniciar uma base nova para criar só a conta administrativa, sem a amostra nem a conta de atendente. Em uma base nova, `CRM_LOCAL_ADMIN_EMAIL` e `CRM_LOCAL_ADMIN_PASSWORD` podem definir seu primeiro acesso; elas não sobrescrevem uma conta existente.

A configuração local não precisa de Neon, Resend nem credenciais de produção. O servidor aplica as migrações no início. O administrador acompanha toda a operação. O atendente trabalha com seus próprios registros. Os registros da amostra têm responsáveis para comparação. Registros anteriores criados nesta prévia continuam sem responsável até serem atribuídos. **No prazo** usa compromissos com horário final já vencido e conclusão registrada até o fim previsto.
