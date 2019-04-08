-- Revert i:config/role_web_admin from pg

BEGIN;

DROP OWNED BY web_admin;
DROP ROLE web_admin;

COMMIT;
