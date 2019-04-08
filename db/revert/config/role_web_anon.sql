-- Revert i:config/role_web_anon from pg

BEGIN;

DROP OWNED BY web_anon;
DROP ROLE web_anon;

COMMIT;
