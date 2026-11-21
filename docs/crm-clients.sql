-- Requires crm-team.sql and crm-team-assignment.sql. Apply before enabling CRM_CLIENTS_ENABLED.
DO $clients$
DECLARE
  namespace text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    EXECUTE format('ALTER TABLE %1$I.opportunities
      ADD COLUMN IF NOT EXISTS client_reference text REFERENCES %1$I.opportunities(reference),
      ADD COLUMN IF NOT EXISTS project_name text NOT NULL DEFAULT '''' CHECK (char_length(project_name) <= 120)', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_opportunities_client_idx ON %I.opportunities(client_reference)
      WHERE client_reference IS NOT NULL', namespace);

    EXECUTE format($definition$
      CREATE OR REPLACE FUNCTION %I.sync_client_opportunities() RETURNS trigger LANGUAGE plpgsql AS $function$
      BEGIN
        EXECUTE format('UPDATE %%I.opportunities
          SET name=$1, company=$2, email=$3, owner_id=$4, revision=revision+1, updated_at=now()
          WHERE client_reference=$5 AND
          ROW(name,company,email,owner_id) IS DISTINCT FROM ROW($1,$2,$3,$4)', TG_TABLE_SCHEMA)
          USING NEW.name, NEW.company, NEW.email, NEW.owner_id, NEW.reference;
        RETURN NEW;
      END
      $function$
    $definition$, namespace);
    EXECUTE format('DROP TRIGGER IF EXISTS crm_sync_client_opportunities ON %I.opportunities', namespace);
    EXECUTE format('CREATE TRIGGER crm_sync_client_opportunities
      AFTER UPDATE OF name,company,email,owner_id ON %1$I.opportunities
      FOR EACH ROW WHEN (NEW.client_reference IS NULL AND
        ROW(OLD.name,OLD.company,OLD.email,OLD.owner_id) IS DISTINCT FROM ROW(NEW.name,NEW.company,NEW.email,NEW.owner_id))
      EXECUTE FUNCTION %1$I.sync_client_opportunities()', namespace);
  END LOOP;
END
$clients$;
