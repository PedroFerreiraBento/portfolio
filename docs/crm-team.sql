DO $team$
DECLARE
  namespace text;
  runtime_role text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    runtime_role := namespace || '_runtime';

    EXECUTE format($table$
      CREATE TABLE IF NOT EXISTS %I.team_members (
        id uuid PRIMARY KEY,
        name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
        email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 3 AND 254 AND lower(email) = email),
        role text NOT NULL CHECK (role IN ('admin', 'member')),
        active boolean NOT NULL DEFAULT true,
        password_hash text NOT NULL CHECK (char_length(password_hash) = 161),
        session_version integer NOT NULL DEFAULT 1 CHECK (session_version > 0),
        created_at timestamptz NOT NULL DEFAULT now()
      )
    $table$, namespace);

    EXECUTE format($sessions$
      CREATE TABLE IF NOT EXISTS %1$I.team_sessions (
        token_hash text PRIMARY KEY CHECK (token_hash ~ '^[0-9a-f]{64}$'),
        member_id uuid NOT NULL REFERENCES %1$I.team_members(id),
        member_version integer NOT NULL,
        expires_at timestamptz NOT NULL
      )
    $sessions$, namespace);

    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_team_session_expiry_idx ON %I.team_sessions (expires_at)', namespace);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE ON %I.team_members TO %I', namespace, runtime_role);
    EXECUTE format('GRANT SELECT, INSERT, DELETE ON %I.team_sessions TO %I', namespace, runtime_role);
  END LOOP;
END;
$team$;
