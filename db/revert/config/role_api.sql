-- Revert i:config/role_api from pg

BEGIN;

DROP OWNED BY api;
DROP ROLE api;

COMMIT;
