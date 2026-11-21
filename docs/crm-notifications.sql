-- Run after docs/crm-intake-followup.sql.
DO $migration$
DECLARE
  namespace text;
  runtime_role text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    runtime_role := namespace || '_runtime';
    EXECUTE format($table$
      CREATE TABLE IF NOT EXISTS %1$I.notification_outbox (
        reference text PRIMARY KEY REFERENCES %1$I.opportunities(reference) ON DELETE CASCADE,
        available_at timestamptz NOT NULL DEFAULT now(),
        attempts smallint NOT NULL DEFAULT 0,
        first_attempt_at timestamptz,
        lease_token uuid,
        payload jsonb,
        sent_at timestamptz,
        provider_id text,
        failed_at timestamptz,
        last_error text,
        CHECK (attempts >= 0),
        CHECK (sent_at IS NULL OR failed_at IS NULL),
        CHECK ((sent_at IS NULL) = (provider_id IS NULL))
      )
    $table$, namespace);
    EXECUTE format($index$
      CREATE INDEX IF NOT EXISTS notification_outbox_ready_idx
      ON %I.notification_outbox (available_at, reference)
      WHERE sent_at IS NULL AND failed_at IS NULL
    $index$, namespace);

    EXECUTE format($function$
      CREATE OR REPLACE FUNCTION %1$I.enqueue_opportunity_notification()
      RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $trigger$
      BEGIN
        INSERT INTO %1$I.notification_outbox (reference) VALUES (NEW.reference)
        ON CONFLICT (reference) DO NOTHING;
        RETURN NEW;
      END
      $trigger$
    $function$, namespace);
    EXECUTE format('REVOKE ALL ON FUNCTION %I.enqueue_opportunity_notification() FROM PUBLIC', namespace);
    EXECUTE format($wire$
      CREATE OR REPLACE TRIGGER opportunity_notification_after_insert
      AFTER INSERT ON %1$I.opportunities FOR EACH ROW
      WHEN (NEW.channel = 'site' AND NEW.intake_hash IS NOT NULL)
      EXECUTE FUNCTION %1$I.enqueue_opportunity_notification()
    $wire$, namespace);

    EXECUTE format('GRANT SELECT ON %I.notification_outbox TO %I', namespace, runtime_role);
    EXECUTE format($grants$
      GRANT UPDATE (available_at, attempts, first_attempt_at, lease_token, payload,
                    sent_at, provider_id, failed_at, last_error)
      ON %I.notification_outbox TO %I
    $grants$, namespace, runtime_role);
  END LOOP;
END
$migration$;
