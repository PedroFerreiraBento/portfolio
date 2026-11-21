ALTER TABLE crm.opportunities
  ADD COLUMN IF NOT EXISTS due_on date,
  ADD COLUMN IF NOT EXISTS visit_reference text,
  ADD COLUMN IF NOT EXISTS intake_hash text;

ALTER TABLE crm_preview.opportunities
  ADD COLUMN IF NOT EXISTS due_on date,
  ADD COLUMN IF NOT EXISTS visit_reference text,
  ADD COLUMN IF NOT EXISTS intake_hash text;
