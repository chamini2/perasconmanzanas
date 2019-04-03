BEGIN;
SELECT plan(1);

SELECT has_extension('public'::name, 'pgcrypto'::name);

SELECT finish();
ROLLBACK;
