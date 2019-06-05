-- Verify i:functions/trigger_function_add_member_when_invite_claimed on pg

BEGIN;

SELECT 'auth.add_member_when_invite_claimed()'::regprocedure;

ROLLBACK;
