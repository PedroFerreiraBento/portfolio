-- Apply as the owner after crm-schema.sql and the runtime role grants.
-- Tracking starts with the first recorded event. The migration imports no estimated traffic.
DO $$
DECLARE
  target text;
  runtime_role text;
BEGIN
  FOREACH target IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    runtime_role := CASE target WHEN 'crm' THEN 'crm_runtime' ELSE 'crm_preview_runtime' END;
    EXECUTE format($ddl$
      ALTER TABLE %I.opportunities
        ADD COLUMN IF NOT EXISTS medium text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS creative text NOT NULL DEFAULT ''
    $ddl$, target);
    EXECUTE format($ddl$
      CREATE TABLE IF NOT EXISTS %I.funnel_events (
        visit_id text NOT NULL CHECK (visit_id ~ '^[a-z0-9-]{12,48}$'),
        kind text NOT NULL CHECK (kind IN ('entry', 'demo', 'whatsapp', 'email')),
        placement text NOT NULL CHECK (placement ~ '^[a-z0-9_-]{1,100}$'),
        origin text NOT NULL CHECK (origin ~ '^[a-z0-9_-]{1,48}$'),
        campaign text NOT NULL CHECK (campaign ~ '^[a-z0-9_-]{1,48}$'),
        medium text NOT NULL DEFAULT '' CHECK (medium ~ '^[a-z0-9_-]{0,48}$'),
        creative text NOT NULL DEFAULT '' CHECK (creative ~ '^[a-z0-9_-]{0,48}$'),
        recorded_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (visit_id, kind, placement)
      )
    $ddl$, target);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_funnel_event_time_idx ON %I.funnel_events (recorded_at)', target);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_opportunity_created_idx ON %I.opportunities (created_at)', target);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_opportunity_won_idx ON %I.opportunities (won_at) WHERE stage = ''ganho''', target);
    EXECUTE format('GRANT SELECT, INSERT ON %I.funnel_events TO %I', target, runtime_role);
  END LOOP;
END $$;
