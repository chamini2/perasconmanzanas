BEGIN;
SELECT plan(1);

SELECT has_extension('public', 'pgcrypto', 'Extension pgcrypto should exist');

SELECT finish();
ROLLBACK;
