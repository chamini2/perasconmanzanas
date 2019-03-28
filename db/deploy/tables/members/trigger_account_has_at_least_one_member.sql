-- Deploy i:tables/members/trigger_account_has_at_least_one_member to pg

BEGIN;

CREATE TRIGGER account_has_at_least_one_member
  AFTER DELETE ON app.members
  FOR EACH ROW
  EXECUTE PROCEDURE account_has_at_least_one_member();

COMMIT;
