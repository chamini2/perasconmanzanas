-- Revert i:functions/trigger_function_add_member_when_invite_claimed from pg

BEGIN;

DROP FUNCTION auth.add_member_when_invite_claimed();

COMMIT;
