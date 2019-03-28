-- Verify i:tables/members/trigger_account_has_at_least_one_member on pg

BEGIN;

SELECT 1/count(*)
FROM information_schema.triggers
WHERE trigger_name = 'account_has_at_least_one_member'
  AND event_object_table = 'members'
  AND event_manipulation = 'DELETE';

ROLLBACK;
