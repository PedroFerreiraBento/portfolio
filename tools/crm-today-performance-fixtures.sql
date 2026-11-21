WITH today AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.opportunities
  (reference,origin,campaign,channel,name,company,email,message,stage,value_cents,created_at,won_at)
SELECT item.reference,'indicacao','demonstracao','outro',item.name,item.company,'',
  'Oportunidade fictícia da demonstração local.','ganho',item.cents,
  ((today.day+item.won_offset-15)+time '09:00') AT TIME ZONE 'America/Sao_Paulo',
  ((today.day+item.won_offset)+time '12:00') AT TIME ZONE 'America/Sao_Paulo'
FROM today CROSS JOIN (VALUES
  ('CD-100000000011','Renata Alves','Vista Sul',480000,-3),
  ('CD-100000000012','Rafael Torres','Linha Clara',720000,-13),
  ('CD-100000000013','Joana Rocha','Campo Vivo',240000,-21)
) AS item(reference,name,company,cents,won_offset)
ON CONFLICT (reference) DO NOTHING;

WITH today AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.appointments
  (id,reference,title,kind,starts_at,duration_minutes,status)
SELECT item.id::uuid,item.reference,'Reunião de escopo','meeting',
  ((today.day+item.day_offset)+time '09:00') AT TIME ZONE 'America/Sao_Paulo',45,'completed'
FROM today CROSS JOIN (VALUES
  ('10000000-0000-4000-8000-000000000011','CD-100000000011',-4),
  ('10000000-0000-4000-8000-000000000012','CD-100000000012',-14),
  ('10000000-0000-4000-8000-000000000013','CD-100000000013',-22)
) AS item(id,reference,day_offset)
ON CONFLICT (id) DO NOTHING;

INSERT INTO crm_preview.activities (id,reference,appointment_id,kind,outcome,occurred_at,notes)
SELECT item.id::uuid,a.reference,a.id,'meeting','completed',a.starts_at + make_interval(mins=>item.minutes),
  'Reunião fictícia da demonstração local.'
FROM (VALUES
  ('20000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000011',37),
  ('20000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000012',63),
  ('20000000-0000-4000-8000-000000000013','10000000-0000-4000-8000-000000000013',40)
) AS item(id,appointment,minutes)
JOIN crm_preview.appointments a ON a.id=item.appointment::uuid
ON CONFLICT (id) DO NOTHING;

WITH today AS (
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS day
)
INSERT INTO crm_preview.activities (id,reference,kind,outcome,occurred_at,notes)
SELECT item.id::uuid,item.reference,'call',item.outcome,
  ((today.day+item.day_offset)+time '13:00') AT TIME ZONE 'America/Sao_Paulo','Ligação fictícia da demonstração local.'
FROM today CROSS JOIN (VALUES
  ('20000000-0000-4000-8000-000000000014','CD-100000000011','connected',-2),
  ('20000000-0000-4000-8000-000000000015','CD-100000000012','connected',-8),
  ('20000000-0000-4000-8000-000000000016','CD-100000000013','no_answer',-16),
  ('20000000-0000-4000-8000-000000000017','CD-100000000013','connected',-24)
) AS item(id,reference,outcome,day_offset)
ON CONFLICT (id) DO NOTHING;
