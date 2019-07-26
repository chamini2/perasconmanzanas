-- Deploy i:config/role_web_admin to pg

BEGIN;

CREATE ROLE web_admin WITH NOLOGIN;
GRANT web_admin TO authenticator;

-- For row level security
GRANT web_user TO web_admin;

GRANT USAGE ON SCHEMA app TO web_admin;

GRANT SELECT ON TABLE app.users TO web_admin;
GRANT UPDATE ON TABLE app.users TO web_admin;

GRANT SELECT ON TABLE app.accounts TO web_admin;
GRANT INSERT ON TABLE app.accounts TO web_admin;
GRANT UPDATE ON TABLE app.accounts TO web_admin;
GRANT DELETE ON TABLE app.accounts TO web_admin;

GRANT SELECT ON TABLE app.members TO web_admin;
GRANT INSERT ON TABLE app.members TO web_admin;
GRANT UPDATE ON TABLE app.members TO web_admin;
GRANT DELETE ON TABLE app.members TO web_admin;

GRANT SELECT ON TABLE app.products TO web_admin;
GRANT INSERT ON TABLE app.products TO web_admin;
GRANT UPDATE ON TABLE app.products TO web_admin;
GRANT DELETE ON TABLE app.products TO web_admin;

GRANT SELECT ON TABLE app.movements TO web_admin;
GRANT INSERT ON TABLE app.movements TO web_admin;
GRANT UPDATE ON TABLE app.movements TO web_admin;
GRANT DELETE ON TABLE app.movements TO web_admin;

GRANT SELECT ON TABLE app.invites TO web_admin;
GRANT INSERT ON TABLE app.invites TO web_admin;
GRANT UPDATE ON TABLE app.invites TO web_admin;
GRANT DELETE ON TABLE app.invites TO web_admin;

GRANT SELECT ON TABLE app.traits TO web_admin;
GRANT INSERT ON TABLE app.traits TO web_admin;
GRANT UPDATE ON TABLE app.traits TO web_admin;
GRANT DELETE ON TABLE app.traits TO web_admin;

GRANT SELECT ON TABLE app.products_view TO web_admin;

COMMIT;
