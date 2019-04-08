-- Deploy i:config/role_web_anon to pg

BEGIN;

CREATE ROLE web_anon WITH NOLOGIN;
GRANT web_anon TO authenticator;

GRANT USAGE ON SCHEMA app TO web_anon;

COMMIT;
