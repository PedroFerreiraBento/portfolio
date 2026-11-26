DO $$
DECLARE target text;
BEGIN
 FOREACH target IN ARRAY ARRAY['crm','crm_preview'] LOOP
  EXECUTE format('ALTER TABLE %I.funnel_events ADD COLUMN IF NOT EXISTS gallery_label text', target);
  EXECUTE format('ALTER TABLE %I.funnel_events DROP CONSTRAINT IF EXISTS funnel_events_kind_check', target);
  EXECUTE format('ALTER TABLE %I.funnel_events ADD CONSTRAINT funnel_events_kind_check CHECK (kind IN (''entry'',''offer'',''gallery'',''demo'',''whatsapp'',''email''))', target);
 END LOOP;
END $$;
