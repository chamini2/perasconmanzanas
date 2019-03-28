-- Verify i:functions/trigger_function_account_has_at_least_one_member on pg

BEGIN;

SELECT 'account_has_at_least_one_member()'::regprocedure;

ROLLBACK;
