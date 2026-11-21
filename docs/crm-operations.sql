DO $operations$
DECLARE
  namespace text;
  runtime_role text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    runtime_role := namespace || '_runtime';

    EXECUTE format($table$
      CREATE TABLE IF NOT EXISTS %1$I.appointments (
        id uuid PRIMARY KEY,
        reference text NOT NULL REFERENCES %1$I.opportunities(reference),
        title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
        kind text NOT NULL CHECK (kind IN ('meeting', 'call', 'review')),
        starts_at timestamptz NOT NULL,
        duration_minutes integer NOT NULL CHECK (duration_minutes BETWEEN 5 AND 480),
        notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
        status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
        revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
        request_hash text,
        last_patch_hash text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (id, reference)
      )
    $table$, namespace);

    EXECUTE format($table$
      CREATE TABLE IF NOT EXISTS %1$I.activities (
        id uuid PRIMARY KEY,
        reference text NOT NULL REFERENCES %1$I.opportunities(reference),
        appointment_id uuid UNIQUE,
        kind text NOT NULL,
        outcome text NOT NULL,
        occurred_at timestamptz NOT NULL,
        notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
        request_hash text,
        created_at timestamptz NOT NULL DEFAULT now(),
        FOREIGN KEY (appointment_id, reference) REFERENCES %1$I.appointments(id, reference),
        CHECK (
          (kind = 'call' AND outcome IN ('connected', 'no_answer')) OR
          (kind IN ('whatsapp', 'email') AND outcome IN ('sent', 'connected')) OR
          (kind = 'meeting' AND outcome IN ('completed', 'no_show')) OR
          (kind = 'note' AND outcome = 'recorded')
        )
      )
    $table$, namespace);

    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_appointments_starts_idx ON %I.appointments (starts_at, id)', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_appointments_reference_idx ON %I.appointments (reference)', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_activities_recency_idx ON %I.activities (occurred_at DESC, id)', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_activities_reference_idx ON %I.activities (reference, occurred_at DESC)', namespace);
    EXECUTE format($index$
      CREATE INDEX IF NOT EXISTS crm_activities_last_contact_idx ON %I.activities (reference, occurred_at DESC)
      WHERE outcome IN ('connected', 'sent', 'completed')
    $index$, namespace);

    EXECUTE format('GRANT SELECT, INSERT, UPDATE ON %I.appointments TO %I', namespace, runtime_role);
    EXECUTE format('GRANT SELECT, INSERT ON %I.activities TO %I', namespace, runtime_role);
  END LOOP;
END
$operations$;
