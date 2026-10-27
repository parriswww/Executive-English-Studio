-- For a NEW, user-managed PostgreSQL database outside Replit.
-- Replit-managed production schema changes are applied by Publish.
CREATE TABLE IF NOT EXISTS executive_studio_leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  line_id TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
