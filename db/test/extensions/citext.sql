BEGIN;
SELECT plan(1);

SELECT has_extension('public', 'citext', 'Extension citext should exist');

SELECT finish();
ROLLBACK;
