-- Verify i:tables/invites/trigger_add_member_when_invite_claimed on pg

BEGIN;

SELECT 1/count(*)
FROM information_schema.triggers
WHERE trigger_schema = 'app'
  AND trigger_name = 'add_member_when_invite_claimed'
  AND event_object_schema = 'app'
  AND event_object_table = 'invites'
  AND event_manipulation = 'UPDATE'
  AND action_timing = 'AFTER';

SELECT 1/count(*)
FROM information_schema.triggered_update_columns
WHERE trigger_schema = 'app'
  AND trigger_name = 'add_member_when_invite_claimed'
  AND event_object_schema = 'app'
  AND event_object_table = 'invites'
  AND event_object_column = 'claimed_by_id';

ROLLBACK;
