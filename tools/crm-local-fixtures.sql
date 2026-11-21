WITH today AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.opportunities
  (reference,origin,campaign,channel,name,company,email,message,next_step,stage,due_on,created_at)
SELECT fixture.reference,fixture.origin,'demonstracao','outro',fixture.name,fixture.company,'',
  fixture.message,fixture.next_step,fixture.stage,
  CASE WHEN fixture.due IS NOT NULL THEN today.day+fixture.due END,
  ((today.day+fixture.age)+time '09:00') AT TIME ZONE 'America/Sao_Paulo'
FROM today CROSS JOIN (VALUES
  ('CD-100000000001','indicacao','Luiza Almeida','Estúdio Horizonte','Revisão da proposta de site institucional.','Revisar proposta','proposta',0,-4),
  ('CD-100000000002','linkedin','Marcos Silva','Casa Cedro','Primeira conversa sobre página de captação.','Confirmar escopo','conversa',0,-6),
  ('CD-100000000003','indicacao','Camila Santos','Oficina Norte','Aguardando retorno sobre a manutenção do site.','Enviar proposta','conversa',-1,-12),
  ('CD-100000000004','direto','Fernanda Costa','Ateliê Supra','Contato inicial para reorganização do catálogo.','Retomar contato','conversa',NULL,-46),
  ('CD-100000000005','linkedin','Caio Martins','Construir Mais','Solicitou informações sobre uma página para orçamentos.','','novo',NULL,-1)
) AS fixture(reference,origin,name,company,message,next_step,stage,due,age);

WITH today AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.appointments (id,reference,title,kind,starts_at,duration_minutes,notes)
SELECT fixture.id::uuid,fixture.reference,fixture.title,fixture.kind,
  ((today.day+fixture.offset_day)+fixture.hour::time) AT TIME ZONE 'America/Sao_Paulo',
  fixture.duration,fixture.notes
FROM today CROSS JOIN (VALUES
  ('10000000-0000-4000-8000-000000000001','CD-100000000001','Reunião','meeting',0,'09:30',45,'Revisar o andamento do projeto.'),
  ('10000000-0000-4000-8000-000000000002','CD-100000000002','Ligação','call',0,'11:00',30,'Confirmar os requisitos de captação.'),
  ('10000000-0000-4000-8000-000000000003','CD-100000000003','Revisão do site','review',0,'15:00',45,'Checar os ajustes de navegação.'),
  ('10000000-0000-4000-8000-000000000004','CD-100000000005','Apresentar escopo','meeting',1,'10:00',45,'Mostrar a proposta inicial.')
) AS fixture(id,reference,title,kind,offset_day,hour,duration,notes);

WITH today AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.activities (id,reference,kind,outcome,occurred_at,notes)
SELECT fixture.id::uuid,fixture.reference,fixture.kind,fixture.outcome,
  ((today.day+fixture.offset_day)+time '10:00') AT TIME ZONE 'America/Sao_Paulo',fixture.notes
FROM today CROSS JOIN (VALUES
  ('20000000-0000-4000-8000-000000000001','CD-100000000001','call','connected',-1,'Validei o prazo com a Luiza.'),
  ('20000000-0000-4000-8000-000000000002','CD-100000000002','whatsapp','sent',-2,'Enviei o resumo da primeira conversa.'),
  ('20000000-0000-4000-8000-000000000003','CD-100000000004','meeting','completed',-42,'Reunião inicial concluída.')
) AS fixture(id,reference,kind,outcome,offset_day,notes);
