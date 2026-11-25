export default [
  {
    "slug": "agencia-conteudo",
    "brand": "Linha de Pauta",
    "sector": "Agência de conteúdo",
    "short": "Da ideia à entrega",
    "desc": "Planeje o que entra na semana, controle revisões e deixe as peças prontas para o calendário.",
    "mark": "LP",
    "pages": [
      {
        "file": "index.html",
        "title": "Pauta da semana",
        "intro": "Veja o que já tem dono, o que está em produção e o que pode entrar em revisão.",
        "view": "board",
        "labels": [
          "Ideia",
          "Em produção",
          "Em revisão"
        ],
        "noun": "peças",
        "action": "Atualizar a pauta",
        "result": "Etapa atualizada",
        "detail": "Escolha o responsável e a próxima etapa. A peça muda de coluna ao salvar.",
        "fields": [
          [
            "etapa",
            "Próxima etapa",
            [
              "Em produção",
              "Em revisão"
            ]
          ],
          [
            "dono",
            "Responsável",
            [
              "Redação",
              "Design",
              "Vídeo"
            ]
          ]
        ],
        "data": [
          [
            "LP-214",
            "Carrossel de lançamento",
            "Social · 6 telas",
            "Ideia",
            "Coleção Horizonte",
            "Falar com quem está conhecendo a coleção pela primeira vez. A pauta deve terminar com uma instrução clara de onde ver os produtos."
          ],
          [
            "LP-219",
            "Newsletter de domingo",
            "E-mail · 1 edição",
            "Em produção",
            "Livraria de bairro",
            "Selecionar 3 títulos e propor uma ordem de leitura."
          ],
          [
            "LP-225",
            "Cortes do depoimento",
            "Vídeo · 3 cortes",
            "Em revisão",
            "Casa de criação",
            "As legendas precisam ser conferidas junto ao arquivo final."
          ],
          [
            "LP-227",
            "Guia do mês",
            "Editorial · 1 artigo",
            "Em produção",
            "Revista Arco",
            "A matéria depende do retorno da pesquisa de imagem."
          ]
        ]
      },
      {
        "file": "revisao.html",
        "title": "Mesa de revisão",
        "intro": "Reúna o retorno por peça e mostre à criação exatamente o que falta.",
        "view": "review",
        "labels": [
          "A revisar",
          "Ajuste solicitado",
          "Aprovada"
        ],
        "noun": "peças",
        "action": "Registrar revisão",
        "result": "Revisão registrada",
        "detail": "A aprovação exige as duas conferências. Para devolver, escolha a razão do ajuste.",
        "fields": [
          [
            "decisao",
            "Decisão",
            [
              "Aprovada",
              "Ajuste solicitado"
            ]
          ],
          [
            "motivo",
            "Ponto de revisão",
            [
              "Texto ou legenda",
              "Identidade visual",
              "Exportação"
            ]
          ]
        ],
        "checks": [
          "Texto e datas conferidos",
          "Versão visual conferida"
        ],
        "data": [
          [
            "LP-219",
            "Newsletter de domingo",
            "Versão 2 · E-mail",
            "A revisar",
            "Livraria de bairro",
            "Assunto: O tempo que cabe num livro. Abertura: Três leituras para um domingo sem pressa. Botão: Ver a seleção da semana."
          ],
          [
            "LP-225",
            "Cortes do depoimento",
            "Versão 3 · Vídeo",
            "Ajuste solicitado",
            "Casa de criação",
            "Ajustar legenda até o segundo 12 e conferir o nome exibido na cartela final."
          ],
          [
            "LP-226",
            "Caderno do lançamento",
            "Versão 1 · Carrossel",
            "A revisar",
            "Coleção Horizonte",
            "A capa apresenta a linha de cerâmica. As últimas telas detalham cores e acabamentos."
          ],
          [
            "LP-224",
            "Boletim de quinta",
            "Versão 4 · E-mail",
            "Aprovada",
            "Revista Arco",
            "Revisões concluídas. O texto contempla a data e o link do evento."
          ]
        ]
      },
      {
        "file": "publicacao.html",
        "title": "Pronto para publicar",
        "intro": "Encaixe peças aprovadas no calendário e veja se já há outra entrega no mesmo canal e horário.",
        "view": "schedule",
        "labels": [
          "Liberada",
          "Programada"
        ],
        "noun": "publicações",
        "action": "Programar simulação",
        "result": "Publicação programada na demo",
        "detail": "Apenas peças liberadas entram na programação. O envio para os canais é simulado.",
        "fields": [
          [
            "canal",
            "Canal",
            [
              "Instagram",
              "Newsletter",
              "LinkedIn"
            ]
          ],
          [
            "horario",
            "Janela",
            [
              "Terça · 09h",
              "Quarta · 12h",
              "Quinta · 18h"
            ]
          ]
        ],
        "data": [
          [
            "LP-230",
            "Bastidores da campanha",
            "Vídeo · 25 segundos",
            "Liberada",
            "Coleção Horizonte",
            "Escolha a janela depois de conferir o canal e as entregas programadas."
          ],
          [
            "LP-229",
            "Convite do evento",
            "Card e legenda",
            "Programada",
            "Revista Arco",
            "Programação já ocupada para ajudar a testar o conflito.",
            {
              "canal": "Instagram",
              "horario": "Terça · 09h"
            }
          ],
          [
            "LP-231",
            "Guia de sábado",
            "E-mail com 3 links",
            "Liberada",
            "Livraria de bairro",
            "Material da sequência de leitura do mês."
          ],
          [
            "LP-228",
            "Retrato do estúdio",
            "Post de imagem",
            "Programada",
            "Casa de criação",
            "Peça liberada pela equipe de criação.",
            {
              "canal": "LinkedIn",
              "horario": "Quinta · 18h"
            }
          ]
        ]
      }
    ]
  },
  {
    "slug": "clinica-vet",
    "brand": "Recepção Andorinha",
    "sector": "Clínica veterinária",
    "short": "Balcão e continuidade",
    "desc": "Concentre a chegada, os avisos de retorno e a passagem de turno. Os animais e atendimentos são fictícios.",
    "mark": "RA",
    "pages": [
      {
        "file": "index.html",
        "title": "Fila do dia",
        "intro": "Saiba quem chegou, quanto ainda está aguardando e para qual sala encaminhar.",
        "view": "queue",
        "labels": [
          "Aguardando",
          "Em sala",
          "Encerrado"
        ],
        "noun": "atendimentos",
        "action": "Chamar para atendimento",
        "result": "Encaminhamento registrado",
        "detail": "A chamada é administrativa. Escolha uma sala livre para mover o cartão da fila.",
        "fields": [
          [
            "sala",
            "Sala de atendimento",
            [
              "Sala 1",
              "Sala 2",
              "Sala 3"
            ]
          ]
        ],
        "data": [
          [
            "RA-051",
            "Duna",
            "14h02 · Chegada",
            "Aguardando",
            "Gata · cadastro conferido",
            "A recepção já conferiu o cadastro. Encaminhe o cartão para uma sala livre."
          ],
          [
            "RA-054",
            "Pingo",
            "14h09 · Chegada",
            "Aguardando",
            "Cão · cadastro conferido",
            "O atendimento consta na agenda do dia."
          ],
          [
            "RA-052",
            "Jasmim",
            "14h04 · Encaminhada",
            "Em sala",
            "Gata · Sala 2",
            "Atendimento em andamento.",
            {
              "sala": "Sala 2"
            }
          ],
          [
            "RA-048",
            "Bolota",
            "13h35 · Encerrado",
            "Encerrado",
            "Cão · Saída registrada",
            "Atendimento encerrado no quadro."
          ]
        ]
      },
      {
        "file": "retornos.html",
        "title": "Retornos a confirmar",
        "intro": "Organize a lista de retornos previstos e registre o resultado de cada tentativa de contato.",
        "view": "ledger",
        "labels": [
          "A confirmar",
          "Confirmado",
          "Recontatar"
        ],
        "noun": "retornos",
        "action": "Salvar contato",
        "result": "Retorno atualizado",
        "detail": "A data veio da agenda fictícia. Registre a resposta do responsável sem disparar mensagens.",
        "fields": [
          [
            "resposta",
            "Resultado",
            [
              "Confirmado",
              "Recontatar"
            ]
          ],
          [
            "origem",
            "Canal registrado",
            [
              "Telefone",
              "WhatsApp",
              "Presencial"
            ]
          ]
        ],
        "data": [
          [
            "RA-063",
            "Cora",
            "Hoje · 16h20",
            "A confirmar",
            "Agenda de retornos",
            "A recepção ainda não registrou um contato."
          ],
          [
            "RA-066",
            "Nico",
            "Amanhã · 09h",
            "Recontatar",
            "Agenda de retornos",
            "Primeira tentativa sem resposta. O registro anterior segue na ficha."
          ],
          [
            "RA-060",
            "Mila",
            "Hoje · 15h10",
            "Confirmado",
            "Agenda de retornos",
            "Contato confirmado na recepção.",
            {
              "resposta": "Confirmado",
              "origem": "Presencial"
            }
          ],
          [
            "RA-067",
            "Bento",
            "Amanhã · 14h",
            "A confirmar",
            "Agenda de retornos",
            "Confirme se a família consegue comparecer na janela agendada."
          ]
        ]
      },
      {
        "file": "turno.html",
        "title": "Passagem de turno",
        "intro": "Quem assume o balcão vê quais tarefas administrativas ficaram abertas e o que já foi repassado.",
        "view": "handover",
        "labels": [
          "A repassar",
          "Repassado"
        ],
        "noun": "pendências",
        "action": "Confirmar passagem",
        "result": "Tarefa repassada",
        "detail": "Confirme responsável e leitura da pendência antes de concluir.",
        "fields": [
          [
            "equipe",
            "Equipe que assume",
            [
              "Recepção da tarde",
              "Recepção da noite"
            ]
          ]
        ],
        "checks": [
          "Equipe recebeu a pendência"
        ],
        "data": [
          [
            "RA-071",
            "Balcão · resposta pendente",
            "Hoje · 13h52",
            "A repassar",
            "Retornos",
            "Checar a tentativa de contato de Nico e confirmar se a família respondeu."
          ],
          [
            "RA-072",
            "Agenda · nova janela",
            "Hoje · 14h13",
            "A repassar",
            "Agendamentos",
            "Uma pessoa pediu troca de horário. Verificar disponibilidade antes de confirmar."
          ],
          [
            "RA-070",
            "Caixa · comprovante",
            "Hoje · 13h31",
            "Repassado",
            "Recepção",
            "Recepção da tarde recebeu a tarefa de arquivamento.",
            {
              "equipe": "Recepção da tarde"
            }
          ],
          [
            "RA-073",
            "Recepção · sala liberada",
            "Hoje · 14h20",
            "A repassar",
            "Fila",
            "Atualizar o quadro da recepção quando a Sala 3 estiver disponível."
          ]
        ]
      }
    ]
  },
  {
    "slug": "pousada-operacao",
    "brand": "Estada de Dentro",
    "sector": "Pousada",
    "short": "Da chegada à próxima estada",
    "desc": "Antecipe a fila de chegadas, acompanhe a virada dos quartos e encaminhe chamados da operação.",
    "mark": "ED",
    "pages": [
      {
        "file": "index.html",
        "title": "Chegadas",
        "intro": "Prepare o balcão antes da hora do check-in e registre as chegadas quando o quarto estiver liberado.",
        "view": "arrivals",
        "labels": [
          "Prevista",
          "Chegou"
        ],
        "noun": "chegadas",
        "action": "Registrar chegada",
        "result": "Chegada registrada",
        "detail": "A chave só pode ser entregue se o quarto estiver liberado e a conferência do balcão estiver marcada.",
        "checks": [
          "Cadastro de demonstração conferido"
        ],
        "fields": [
          [
            "chave",
            "Entrega da chave",
            [
              "Balcão principal",
              "Recepção lateral"
            ]
          ]
        ],
        "data": [
          [
            "ED-156",
            "Reserva Jacarandá",
            "14h30 · 2 hóspedes",
            "Prevista",
            "Quarto 05 · Liberado",
            "Chegada prevista para a metade da tarde.",
            {
              "liberado": true
            }
          ],
          [
            "ED-159",
            "Reserva Caju",
            "15h30 · 2 hóspedes",
            "Prevista",
            "Quarto 02 · Em limpeza",
            "A chave ainda deve permanecer com a equipe de recepção.",
            {
              "liberado": false
            }
          ],
          [
            "ED-161",
            "Reserva Lua",
            "18h00 · 3 hóspedes",
            "Prevista",
            "Quarto 08 · Liberado",
            "Chegada planejada para o fim do dia.",
            {
              "liberado": true
            }
          ],
          [
            "ED-150",
            "Reserva Chuva",
            "13h50 · 1 hóspede",
            "Chegou",
            "Quarto 04 · Liberado",
            "Chegada conferida às 13h50.",
            {
              "liberado": true,
              "chave": "Balcão principal"
            }
          ]
        ]
      },
      {
        "file": "quartos.html",
        "title": "Quarto pronto",
        "intro": "Veja quais quartos esperam limpeza, estão em conferência ou já podem receber hóspedes.",
        "view": "roommap",
        "labels": [
          "Em limpeza",
          "Conferência",
          "Liberado"
        ],
        "noun": "quartos",
        "action": "Liberar o quarto",
        "result": "Quarto liberado",
        "detail": "Antes de liberar, confira as três etapas. A mudança aparece no painel de quartos.",
        "checks": [
          "Enxoval trocado",
          "Banheiro conferido",
          "Chave devolvida"
        ],
        "fields": [],
        "data": [
          [
            "ED-Q05",
            "Quarto 05",
            "Térreo · Duplo",
            "Conferência",
            "Jacarandá · Próxima chegada 14h30",
            "A equipe sinalizou que a limpeza terminou. Faça a última conferência."
          ],
          [
            "ED-Q02",
            "Quarto 02",
            "Térreo · Duplo",
            "Em limpeza",
            "Caju · Próxima chegada 15h30",
            "Conclua as etapas do quarto antes de marcar como liberado."
          ],
          [
            "ED-Q08",
            "Quarto 08",
            "Piso 1 · Triplo",
            "Liberado",
            "Lua · Próxima chegada 18h00",
            "O quarto está liberado no quadro."
          ],
          [
            "ED-Q04",
            "Quarto 04",
            "Térreo · Individual",
            "Conferência",
            "Próxima chegada amanhã",
            "Aguardar a devolução da chave antes de liberar."
          ]
        ]
      },
      {
        "file": "manutencao.html",
        "title": "Chamados de manutenção",
        "intro": "Separe o que impede uso do quarto e encaminhe os chamados para a equipe certa.",
        "view": "tickets",
        "labels": [
          "Aberto",
          "Em execução",
          "Resolvido"
        ],
        "noun": "chamados",
        "action": "Atualizar chamado",
        "result": "Chamado atualizado",
        "detail": "O registro distingue urgência de andamento. A resolução exige confirmação da verificação final.",
        "checks": [
          "Verificação final feita"
        ],
        "fields": [
          [
            "prioridade",
            "Prioridade",
            [
              "Urgente",
              "Rotina"
            ]
          ],
          [
            "andamento",
            "Andamento",
            [
              "Em execução",
              "Resolvido"
            ]
          ]
        ],
        "data": [
          [
            "ED-082",
            "Fechadura presa",
            "Quarto 03 · Acesso",
            "Aberto",
            "Urgente · Quarto bloqueado",
            "A recepção não consegue abrir a porta. Encaminhe antes de liberar nova chegada.",
            {
              "prioridade": "Urgente"
            }
          ],
          [
            "ED-084",
            "Luminária intermitente",
            "Área comum · Elétrica",
            "Aberto",
            "Rotina · Área em uso",
            "A luminária do corredor pisca quando acionada.",
            {
              "prioridade": "Rotina"
            }
          ],
          [
            "ED-081",
            "Registro do chuveiro",
            "Quarto 02 · Hidráulica",
            "Em execução",
            "Urgente · Quarto 02",
            "Equipe está verificando a solicitação.",
            {
              "prioridade": "Urgente",
              "andamento": "Em execução"
            }
          ],
          [
            "ED-077",
            "Suporte de toalha solto",
            "Quarto 08 · Fixação",
            "Resolvido",
            "Rotina · Revisado",
            "A inspeção final já está registrada.",
            {
              "prioridade": "Rotina",
              "andamento": "Resolvido"
            }
          ]
        ]
      }
    ]
  }
];
