-- ListFast D1 schema — already applied to listfast-db
-- Re-run via: npx wrangler d1 execute listfast-db --remote --file=src/schema.sql
-- Migration for existing DBs: src/migrations/001_intake_options.sql

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  edit_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  plan TEXT,
  template TEXT NOT NULL DEFAULT 'swft',
  goal TEXT,
  property_name TEXT,
  address_line TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  price_cents INTEGER,
  price_unit TEXT DEFAULT 'monthly',
  bedrooms REAL,
  bathrooms REAL,
  sqft INTEGER,
  property_type TEXT,
  description TEXT,
  features_json TEXT,
  schedule_json TEXT,
  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  images_json TEXT,
  files_json TEXT,
  features_options_json TEXT,
  intake_options_json TEXT,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'form',
  prospect_name TEXT,
  prospect_email TEXT,
  prospect_phone TEXT,
  message TEXT,
  preferred_showing TEXT,
  reva_transcript TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(listing_id) REFERENCES listings(id)
);

CREATE TABLE IF NOT EXISTS showings (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  prospect_name TEXT,
  prospect_email TEXT,
  prospect_phone TEXT,
  scheduled_for TEXT,
  status TEXT DEFAULT 'requested',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(listing_id) REFERENCES listings(id)
);

CREATE INDEX IF NOT EXISTS idx_inq_listing ON inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_showings_listing ON showings(listing_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
