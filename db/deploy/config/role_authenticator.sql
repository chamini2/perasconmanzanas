-- Deploy i:config/role_authenticator to pg

BEGIN;

CREATE ROLE authenticator WITH NOINHERIT LOGIN PASSWORD 'password';
-- XXX: set password manually

COMMIT;
