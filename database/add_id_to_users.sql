-- Add identificacion column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS identificacion VARCHAR(50) UNIQUE;

-- We keep email as it might be useful, but login will use identificacion
