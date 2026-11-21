-- Extra projects belong only to the local sample portfolio. No existing record is changed.
WITH local_day AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.opportunities
  (reference,client_reference,project_name,origin,campaign,channel,name,company,email,message,
   stage,next_step,due_on,value_cents,proposal_on,stage_changed_at,owner_id,created_at)
SELECT fixture.reference,parent.reference,fixture.project,parent.origin,parent.campaign,parent.channel,
  parent.name,parent.company,parent.email,'Projeto da amostra local da Caos Domado.',
  fixture.stage,fixture.next_step,local_day.day+fixture.due,fixture.cents,
  CASE WHEN fixture.stage IN ('proposta','negociacao') THEN local_day.day-3 END,
  ((local_day.day-1)+time '10:00') AT TIME ZONE 'America/Sao_Paulo',parent.owner_id,
  ((local_day.day-8)+time '09:00') AT TIME ZONE 'America/Sao_Paulo'
FROM (VALUES
  ('CD-100000000021','CD-100000000002','Integração de pedidos','novo','Confirmar demanda',1,NULL::integer),
  ('CD-100000000022','CD-100000000001','Novo site institucional','proposta','Confirmar recebimento',0,720000),
  ('CD-100000000023','CD-100000000003','Painel de operações','negociacao','Ajustar condições',-1,960000),
  ('CD-100000000024','CD-100000000004','Agenda integrada','negociacao','Validar prazo',4,640000)
) AS fixture(reference,parent_reference,project,stage,next_step,due,cents)
JOIN crm_preview.opportunities parent ON parent.reference=fixture.parent_reference
CROSS JOIN local_day
WHERE parent.campaign='demonstracao' AND parent.client_reference IS NULL
ON CONFLICT (reference) DO NOTHING;
