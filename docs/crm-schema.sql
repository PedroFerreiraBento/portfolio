CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS crm_preview;

DO $$
DECLARE
  namespace text;
BEGIN
  FOREACH namespace IN ARRAY ARRAY['crm', 'crm_preview'] LOOP
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I.opportunities (
      reference text PRIMARY KEY CHECK (reference ~ ''^CD-[A-Z0-9]{12}$''),
      origin text NOT NULL,
      campaign text NOT NULL,
      channel text NOT NULL CHECK (channel IN (''site'', ''whatsapp'', ''email'', ''outro'')),
      name text NOT NULL,
      company text NOT NULL,
      email text NOT NULL,
      message text NOT NULL,
      next_step text NOT NULL DEFAULT '''',
      stage text NOT NULL DEFAULT ''novo'' CHECK (stage IN (''novo'', ''conversa'', ''proposta'', ''ganho'', ''perdido'')),
      value_cents integer CHECK (value_cents > 0),
      won_at timestamptz,
      revision integer NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CHECK ((stage = ''ganho'') = (won_at IS NOT NULL)),
      CHECK (stage <> ''ganho'' OR value_cents IS NOT NULL)
    )', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_opportunity_updated_idx
      ON %I.opportunities (updated_at DESC, reference ASC)', namespace);
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I.rate_limits (
      bucket text PRIMARY KEY,
      hits integer NOT NULL,
      expires_at timestamptz NOT NULL
    )', namespace);
    EXECUTE format('CREATE INDEX IF NOT EXISTS crm_rate_expiry_idx
      ON %I.rate_limits (expires_at)', namespace);
  END LOOP;
END $$;
