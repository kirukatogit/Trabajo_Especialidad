-- Additional seed file (can be applied after init.sql)
INSERT INTO tenants (name) VALUES ('Tenant C') ON CONFLICT DO NOTHING;