-- Revert access:config/role_metabase from pg

BEGIN;

DROP OWNED BY metabase;
DROP ROLE metabase;

COMMIT;
