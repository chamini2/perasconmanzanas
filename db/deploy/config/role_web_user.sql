-- Deploy i:config/role_web_user to pg

BEGIN;

CREATE ROLE web_user WITH NOLOGIN;
GRANT web_user TO authenticator;

GRANT USAGE ON SCHEMA app TO web_user;

GRANT SELECT ON TABLE app.users TO web_user;
GRANT UPDATE ON TABLE app.users TO web_user;

GRANT SELECT ON TABLE app.accounts TO web_user;
GRANT INSERT ON TABLE app.accounts TO web_user;
GRANT UPDATE ON TABLE app.accounts TO web_user;
GRANT DELETE ON TABLE app.accounts TO web_user;

GRANT SELECT ON TABLE app.members TO web_user;
GRANT DELETE ON TABLE app.members TO web_user;

GRANT SELECT ON TABLE app.products TO web_user;
GRANT INSERT ON TABLE app.products TO web_user;
GRANT UPDATE ON TABLE app.products TO web_user;

GRANT SELECT ON TABLE app.products_view TO web_user;

GRANT SELECT ON TABLE app.movements TO web_user;
GRANT INSERT ON TABLE app.movements TO web_user;
GRANT UPDATE ON TABLE app.movements TO web_user;
GRANT DELETE ON TABLE app.movements TO web_user;

COMMIT;
