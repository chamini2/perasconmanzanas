-- Deploy i:tables/invites/trigger_add_member_when_invite_claimed to pg

BEGIN;

CREATE TRIGGER add_member_when_invite_claimed
  AFTER UPDATE OF claimed_by_id ON app.invites
  FOR EACH ROW
  EXECUTE FUNCTION auth.add_member_when_invite_claimed();

COMMIT;
