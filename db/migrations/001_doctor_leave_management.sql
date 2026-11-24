-- BHY Hospital: admin accounts, sessions, doctor leave records and their audit trail.
-- Run once on the PostgreSQL database (see docs/ADMIN-SETUP.md). Safe to read before running; it only creates new objects.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Administrators who may sign in to /admin.
CREATE TABLE IF NOT EXISTS admin_users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL,
  display_name    text NOT NULL,
  password_hash   text NOT NULL,
  role            text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  is_active       boolean NOT NULL DEFAULT true,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until    timestamptz,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_key ON admin_users (lower(email));

-- Sign-in sessions. Only a SHA-256 hash of the session token is stored.
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash text PRIMARY KEY,
  admin_id   uuid NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_admin_idx ON admin_sessions (admin_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_idx ON admin_sessions (expires_at);

-- Doctor leave. doctor_slug is the doctor's slug in the website's doctor directory (src/data/doctors.ts); the doctor
-- records live in the website data files, so the link is by slug rather than a foreign key.
-- Dates are calendar dates in hospital time (Asia/Karachi) and both ends are INCLUSIVE.
-- Leaves are never deleted: cancelling sets status = 'cancelled' and the row stays as history.
CREATE TABLE IF NOT EXISTS doctor_leaves (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_slug  text NOT NULL CHECK (doctor_slug ~ '^[a-z0-9-]+$' AND char_length(doctor_slug) <= 100),
  start_date   date NOT NULL,
  end_date     date NOT NULL,
  reason       text CHECK (reason IS NULL OR char_length(reason) <= 300),
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  created_by   uuid NOT NULL REFERENCES admin_users (id),
  updated_by   uuid NOT NULL REFERENCES admin_users (id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  cancelled_by uuid REFERENCES admin_users (id),
  CONSTRAINT doctor_leaves_dates_ordered CHECK (start_date <= end_date),
  -- Two ACTIVE leaves of the same doctor can never overlap, even if two administrators save at the same instant.
  CONSTRAINT doctor_leaves_no_overlap EXCLUDE USING gist (
    doctor_slug WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status = 'active')
);
CREATE INDEX IF NOT EXISTS doctor_leaves_doctor_idx ON doctor_leaves (doctor_slug);
CREATE INDEX IF NOT EXISTS doctor_leaves_dates_idx ON doctor_leaves (end_date, start_date);

-- Audit trail: who created, changed or cancelled which leave, and when.
CREATE TABLE IF NOT EXISTS doctor_leave_audit (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  leave_id    uuid NOT NULL REFERENCES doctor_leaves (id),
  action      text NOT NULL CHECK (action IN ('created', 'updated', 'cancelled')),
  admin_id    uuid NOT NULL REFERENCES admin_users (id),
  admin_email text NOT NULL,
  changed_at  timestamptz NOT NULL DEFAULT now(),
  details     jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS doctor_leave_audit_leave_idx ON doctor_leave_audit (leave_id, changed_at);
