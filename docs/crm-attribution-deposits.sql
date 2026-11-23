-- Additive migration. Old application versions can continue to use existing columns.
DO $$
DECLARE
  target text;
  runtime_role text;
BEGIN
  FOREACH target IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    runtime_role := CASE target WHEN 'crm' THEN 'crm_runtime' ELSE 'crm_preview_runtime' END;
    EXECUTE format($ddl$
      ALTER TABLE %1$I.funnel_events ADD COLUMN IF NOT EXISTS contact_reference text
        CHECK (contact_reference ~ '^CD-[A-Z0-9]{12}$')
    $ddl$, target);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_funnel_contact_reference_idx ON %I.funnel_events (contact_reference) WHERE contact_reference IS NOT NULL', target);

    EXECUTE format($ddl$
      ALTER TABLE %1$I.opportunities
        ADD COLUMN IF NOT EXISTS attributed_visit_id text,
        ADD COLUMN IF NOT EXISTS deposit_status text CHECK (deposit_status IN ('pending', 'received')),
        ADD COLUMN IF NOT EXISTS deposit_cents integer,
        ADD COLUMN IF NOT EXISTS deposit_received_on date,
        ADD COLUMN IF NOT EXISTS deposit_updated_at timestamptz
    $ddl$, target);
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'crm_deposit_state_check' AND conrelid = format('%I.opportunities', target)::regclass
    ) THEN
      EXECUTE format($ddl$
        ALTER TABLE %1$I.opportunities ADD CONSTRAINT crm_deposit_state_check CHECK (
          (deposit_status IS NULL AND deposit_cents IS NULL AND deposit_received_on IS NULL AND deposit_updated_at IS NULL)
          OR (deposit_status IS NOT NULL AND deposit_cents IS NOT NULL AND deposit_cents > 0 AND deposit_updated_at IS NOT NULL
            AND ((deposit_status = 'pending' AND deposit_received_on IS NULL)
              OR (deposit_status = 'received' AND deposit_received_on IS NOT NULL)))
        )
      $ddl$, target);
    END IF;
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_deposit_received_idx ON %I.opportunities (deposit_received_on) WHERE deposit_status = ''received''', target);
    EXECUTE format($ddl$
      CREATE TABLE IF NOT EXISTS %1$I.deposit_events (
        reference text NOT NULL REFERENCES %1$I.opportunities(reference) ON DELETE CASCADE,
        revision integer NOT NULL,
        actor_id uuid REFERENCES %1$I.team_members(id) ON DELETE SET NULL,
        status text NOT NULL CHECK (status IN ('pending', 'received')),
        value_cents integer NOT NULL CHECK (value_cents > 0),
        received_on date,
        occurred_at timestamptz NOT NULL,
        PRIMARY KEY (reference, revision),
        CHECK ((status = 'received') = (received_on IS NOT NULL))
      )
    $ddl$, target);
    EXECUTE format('GRANT SELECT, INSERT ON %I.deposit_events TO %I', target, runtime_role);
  END LOOP;
END $$;
