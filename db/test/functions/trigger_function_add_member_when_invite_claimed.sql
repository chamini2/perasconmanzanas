BEGIN;
SELECT plan(3);

SELECT has_function('auth', 'add_member_when_invite_claimed', ARRAY[]::text[]);
SELECT function_lang_is('auth', 'add_member_when_invite_claimed', ARRAY[]::text[], 'plpgsql');
SELECT function_returns('auth', 'add_member_when_invite_claimed', ARRAY[]::text[], 'trigger');

SELECT finish();
ROLLBACK;
