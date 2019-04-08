-- Deploy i:config/role_api to pg

BEGIN;

CREATE ROLE api WITH NOINHERIT LOGIN PASSWORD 'password';
-- XXX: set password manually

GRANT USAGE ON SCHEMA auth TO api;
GRANT SELECT ON TABLE auth.users TO api;
GRANT INSERT ON TABLE auth.users TO api;

GRANT USAGE ON SCHEMA app TO api;
GRANT SELECT ON TABLE app.users TO api;
GRANT INSERT ON TABLE app.users TO api;

COMMIT;
