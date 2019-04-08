-- Revert i:config/role_web_user from pg

BEGIN;

DROP OWNED BY web_user;
DROP ROLE web_user;

COMMIT;
