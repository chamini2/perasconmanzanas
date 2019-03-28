-- Revert i:tables/members/trigger_account_has_at_least_one_member from pg

BEGIN;

DROP TRIGGER account_has_at_least_one_member ON app.members;

COMMIT;
