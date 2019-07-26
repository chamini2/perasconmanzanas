-- Deploy access:config/role_metabase to pg

BEGIN;

CREATE ROLE metabase WITH NOINHERIT BYPASSRLS LOGIN PASSWORD 'password';
-- XXX: set password manually

GRANT USAGE ON SCHEMA app TO metabase;

GRANT SELECT ON TABLE app.users TO metabase;

GRANT SELECT ON TABLE app.accounts TO metabase;

GRANT SELECT ON TABLE app.members TO metabase;

GRANT SELECT ON TABLE app.invites TO metabase;

GRANT SELECT ON TABLE app.products TO metabase;

GRANT SELECT ON TABLE app.movements TO metabase;

GRANT SELECT ON TABLE app.traits TO metabase;

COMMIT;
