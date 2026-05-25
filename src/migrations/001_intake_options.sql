-- Run on existing DB: npx wrangler d1 execute listfast-db --remote --file=src/migrations/001_intake_options.sql
ALTER TABLE listings ADD COLUMN intake_options_json TEXT;
