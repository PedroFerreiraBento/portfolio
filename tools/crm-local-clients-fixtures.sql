-- Fill the approved example only when its fictional contact still has no activity.
INSERT INTO crm_preview.activities (id,reference,kind,outcome,occurred_at,notes,actor_id)
SELECT item.id,o.reference,item.kind,item.outcome,
       (COALESCE(o.due_on,current_date)-item.days_back+time '10:00') AT TIME ZONE 'America/Sao_Paulo',
       item.notes,'30000000-0000-4000-8000-000000000001'::uuid
FROM crm_preview.opportunities o
CROSS JOIN (VALUES
  ('20000000-0000-4000-8000-000000000021'::uuid,'call','connected',2,'Confirmou o escopo e pediu a proposta.'),
  ('20000000-0000-4000-8000-000000000022'::uuid,'whatsapp','connected',6,'Enviou referências do projeto.')
) AS item(id,kind,outcome,days_back,notes)
WHERE o.reference='CD-100000000003' AND o.campaign='demonstracao' AND o.name='Camila Santos'
  AND NOT EXISTS (SELECT 1 FROM crm_preview.activities a WHERE a.reference=o.reference)
ON CONFLICT (id) DO NOTHING;
