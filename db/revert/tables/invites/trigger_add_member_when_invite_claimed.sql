-- Revert i:tables/invites/trigger_add_member_when_invite_claimed from pg

BEGIN;

DROP TRIGGER add_member_when_invite_claimed ON app.invites;

COMMIT;
