BEGIN;
SELECT plan(1);

SELECT has_role('authenticator');

SELECT finish();
ROLLBACK;
