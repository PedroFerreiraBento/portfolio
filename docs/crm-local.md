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

## Atribuição da visita e entrada do projeto

Em **Oportunidades**, use **Trazer do WhatsApp ou e-mail** e cole o texto com a referência. Também é possível informar a **Referência da visita** ao cadastrar ou editar. Quando o CRM encontra uma visita compatível com a referência e o canal, usa a campanha observada e inclui os eventos na seção **Visita e campanha**. A pessoa responsável ainda precisa registrar a atividade da conversa. Referências sem correspondência mantêm os dados de campanha informados. Eventos antigos sem referência continuam nos relatórios agregados. Se os eventos passam a apontar para visitas diferentes, a ficha sinaliza o conflito e omite a trilha, preservando o vínculo original para auditoria.

Na ficha, use **Registrar entrada**. Informe o valor em reais e salve como **Pendente**, ou selecione **Recebida**, informe a data e confirme. O histórico registra as alterações. O valor da proposta e o fechamento seguem o fluxo de etapas. **Campanhas e vendas** totaliza somente entradas recebidas no intervalo, pela data do recebimento. Sem uma campanha registrada ou uma visita vinculada, o recebimento aparece em **Sem atribuição**.

Para verificar a alteração, instale as dependências com `npm --prefix app ci` e execute `node --test tools/crm-attribution-deposits.test.mjs`. O teste sobe um CRM local com PostgreSQL em memória, valida a migração repetida com dados legados e percorre as APIs com usuários de escopos diferentes.

Na publicação, aplique `docs/crm-attribution-deposits.sql` ao Neon antes de promover a aplicação. A migração é aditiva e compatível com a versão anterior. Em caso de reversão, promova a versão anterior e preserve as colunas e o histórico. `CRM_QA_TRACKING_ENABLED=1` só é reconhecida em `crm_preview`. Use-a com uma ramificação isolada para registrar eventos QA e inspecioná-los pelo relatório autenticado com `qa=1`.
