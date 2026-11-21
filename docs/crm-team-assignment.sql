DO $assignments$
DECLARE
  namespace text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    EXECUTE format('ALTER TABLE %1$I.opportunities ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES %1$I.team_members(id), ADD COLUMN IF NOT EXISTS won_by_id uuid REFERENCES %1$I.team_members(id)', namespace);
    EXECUTE format('ALTER TABLE %1$I.appointments ADD COLUMN IF NOT EXISTS assignee_id uuid REFERENCES %1$I.team_members(id)', namespace);
    EXECUTE format('ALTER TABLE %1$I.activities ADD COLUMN IF NOT EXISTS actor_id uuid REFERENCES %1$I.team_members(id)', namespace);

    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_opportunities_owner_idx ON %I.opportunities (owner_id, reference)', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_opportunities_won_by_idx ON %I.opportunities (won_by_id, won_at) WHERE stage = ''ganho''', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_appointments_assignee_idx ON %I.appointments (assignee_id, starts_at)', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_activities_actor_idx ON %I.activities (actor_id, occurred_at DESC, id)', namespace);
  END LOOP;
END
$assignments$;
