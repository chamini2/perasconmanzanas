-- Deploy i:config/role_api to pg

BEGIN;

CREATE ROLE api WITH NOINHERIT LOGIN PASSWORD 'password';
-- XXX: set password manually

GRANT USAGE ON SCHEMA auth TO api;

GRANT SELECT ON TABLE auth.users TO api;
GRANT INSERT ON TABLE auth.users TO api;
GRANT UPDATE ON TABLE auth.users TO api;

GRANT USAGE ON SCHEMA app TO api;

GRANT SELECT ON TABLE app.users TO api;
GRANT INSERT ON TABLE app.users TO api;
GRANT ALL ON SEQUENCE app.users_id_seq TO api;

GRANT SELECT ON TABLE app.accounts TO api;

GRANT SELECT ON TABLE app.members TO api;
GRANT INSERT ON TABLE app.members TO api; -- trigger function auth.add_member_when_invite_claimed

GRANT SELECT ON TABLE app.invites TO api;
GRANT UPDATE ON TABLE app.invites TO api;

COMMIT;
