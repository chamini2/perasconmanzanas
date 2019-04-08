-- Deploy i:config/role_web_admin to pg

BEGIN;

CREATE ROLE web_admin WITH NOLOGIN;
GRANT web_admin TO authenticator;

GRANT web_user TO web_admin;

GRANT INSERT ON TABLE app.members TO web_admin;
GRANT UPDATE ON TABLE app.members TO web_admin;

COMMIT;
