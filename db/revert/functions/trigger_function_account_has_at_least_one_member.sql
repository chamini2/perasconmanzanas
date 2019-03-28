-- Revert i:functions/trigger_function_account_has_at_least_one_member from pg

BEGIN;

DROP FUNCTION account_has_at_least_one_member();

COMMIT;
