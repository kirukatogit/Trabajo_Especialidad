-- Schema + example data (2 tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- seed two tenants
INSERT INTO tenants (name) VALUES ('Tenant A') ON CONFLICT DO NOTHING;
INSERT INTO tenants (name) VALUES ('Tenant B') ON CONFLICT DO NOTHING;

-- example users
INSERT INTO users (tenant_id, email, name)
SELECT t.id, concat(t.name, '@example.com'), concat(t.name, ' User')
FROM tenants t
ON CONFLICT DO NOTHING;