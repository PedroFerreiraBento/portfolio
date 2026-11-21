-- Apply after the team and clients migrations, before enabling CRM_PIPELINE_ENABLED.
DO $pipeline$
DECLARE
  namespace text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint c
      JOIN pg_class t ON t.oid=c.conrelid
      JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE n.nspname=namespace AND t.relname='opportunities'
        AND c.conname='crm_opportunities_pipeline_stage_check'
    ) THEN
      EXECUTE format($stage$
        ALTER TABLE %I.opportunities
        DROP CONSTRAINT IF EXISTS opportunities_stage_check,
        ADD CONSTRAINT crm_opportunities_pipeline_stage_check CHECK
          (stage IN ('novo','conversa','proposta','negociacao','ganho','perdido'))
      $stage$, namespace);
    END IF;

    EXECUTE format($columns$
      ALTER TABLE %I.opportunities
      ADD COLUMN IF NOT EXISTS proposal_on date,
      ADD COLUMN IF NOT EXISTS closed_on date,
      ADD COLUMN IF NOT EXISTS loss_reason text,
      ADD COLUMN IF NOT EXISTS stage_changed_at timestamptz
    $columns$, namespace);

    EXECUTE format($events$
      CREATE TABLE IF NOT EXISTS %1$I.pipeline_events (
        reference text NOT NULL REFERENCES %1$I.opportunities(reference),
        revision integer NOT NULL,
        from_stage text NOT NULL,
        to_stage text NOT NULL,
        actor_id uuid NOT NULL REFERENCES %1$I.team_members(id),
        won_by_id uuid REFERENCES %1$I.team_members(id),
        previous_won_by_id uuid REFERENCES %1$I.team_members(id),
        previous_value_cents integer,
        previous_closed_on date,
        reason text,
        value_cents integer,
        proposal_on date,
        closed_on date,
        next_step text NOT NULL,
        due_on date,
        occurred_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY(reference, revision)
      )
    $events$, namespace);

    EXECUTE format('GRANT SELECT, INSERT ON %I.pipeline_events TO %I', namespace, namespace || '_runtime');
  END LOOP;
END $pipeline$;
