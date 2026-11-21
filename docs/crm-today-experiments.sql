DO $migration$
DECLARE
  namespace text;
  runtime_role text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    runtime_role := namespace || '_runtime';
    EXECUTE format($table$
      CREATE TABLE IF NOT EXISTS %1$I.experiment_assignments (
        reference text PRIMARY KEY REFERENCES %1$I.opportunities(reference),
        variant text NOT NULL CHECK (variant IN ('call', 'whatsapp')),
        assigned_at timestamptz NOT NULL DEFAULT now()
      )
    $table$, namespace);
    EXECUTE format('GRANT SELECT, INSERT ON %I.experiment_assignments TO %I', namespace, runtime_role);
  END LOOP;
END
$migration$;
