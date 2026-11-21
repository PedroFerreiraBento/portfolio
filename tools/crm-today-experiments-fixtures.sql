INSERT INTO crm_preview.experiment_assignments (reference,variant,assigned_at)
SELECT o.reference, fixture.variant, o.created_at
FROM crm_preview.opportunities o JOIN (VALUES
  ('CD-100000000001','call'),
  ('CD-100000000002','whatsapp')
) AS fixture(reference,variant) USING (reference)
WHERE o.campaign='demonstracao'
ON CONFLICT (reference) DO NOTHING;
