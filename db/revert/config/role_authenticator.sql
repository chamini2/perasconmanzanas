-- Revert i:config/role_authenticator from pg

BEGIN;

DROP OWNED BY authenticator;
DROP ROLE authenticator;

COMMIT;
