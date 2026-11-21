-- Attribute only the preloaded fictional records. Keep records made in the preview intact.
WITH ownership(reference, owner_id) AS (
  VALUES
    ('CD-100000000001','30000000-0000-4000-8000-000000000001'::uuid),
    ('CD-100000000002','30000000-0000-4000-8000-000000000002'::uuid),
    ('CD-100000000003','30000000-0000-4000-8000-000000000001'::uuid),
    ('CD-100000000004','30000000-0000-4000-8000-000000000002'::uuid),
    ('CD-100000000011','30000000-0000-4000-8000-000000000001'::uuid),
    ('CD-100000000012','30000000-0000-4000-8000-000000000002'::uuid),
    ('CD-100000000013','30000000-0000-4000-8000-000000000001'::uuid)
)
UPDATE crm_preview.opportunities o
SET owner_id=m.owner_id,
    won_by_id=CASE WHEN o.stage='ganho' THEN coalesce(o.won_by_id,m.owner_id) ELSE o.won_by_id END
FROM ownership m
WHERE o.reference=m.reference AND o.owner_id IS NULL AND o.campaign='demonstracao';

UPDATE crm_preview.appointments a
SET assignee_id=o.owner_id
FROM crm_preview.opportunities o
WHERE a.reference=o.reference AND a.assignee_id IS NULL AND o.owner_id IS NOT NULL
  AND a.id IN (
    '10000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000011',
    '10000000-0000-4000-8000-000000000012',
    '10000000-0000-4000-8000-000000000013'
  );

UPDATE crm_preview.activities a
SET actor_id=o.owner_id
FROM crm_preview.opportunities o
WHERE a.reference=o.reference AND a.actor_id IS NULL AND o.owner_id IS NOT NULL
  AND a.id IN (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000011',
    '20000000-0000-4000-8000-000000000012',
    '20000000-0000-4000-8000-000000000013',
    '20000000-0000-4000-8000-000000000014',
    '20000000-0000-4000-8000-000000000015',
    '20000000-0000-4000-8000-000000000016',
    '20000000-0000-4000-8000-000000000017'
  );
