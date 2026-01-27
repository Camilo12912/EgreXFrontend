-- Seed Data
-- Note: The password_hash values below are placeholders. 
-- In a real scenario, you should generate these using bcrypt.hashSync('password123', 10).
-- Placeholder hash for 'password123': $2b$10$YourGeneratedHashHere...

INSERT INTO users (id, email, password_hash, role) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@example.com', '$2b$10$X7./..', 'admin'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'student@example.com', '$2b$10$X7./..', 'egresado')
ON CONFLICT (email) DO NOTHING;

INSERT INTO egresados_profiles (user_id, nombre, telefono, profesion, empresa) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Juan Perez', '555-0123', 'Software Engineer', 'Tech Corp')
ON CONFLICT DO NOTHING;
