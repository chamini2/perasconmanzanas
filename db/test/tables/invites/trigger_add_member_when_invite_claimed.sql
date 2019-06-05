BEGIN;
SELECT plan(6);

SELECT has_trigger('app', 'invites', 'add_member_when_invite_claimed'::name);
SELECT trigger_is('app', 'invites', 'add_member_when_invite_claimed', 'auth', 'add_member_when_invite_claimed');

-- TODO: test by doing INSERTs, UPDATEs and DELETEs in the appropriate tables

SELECT finish();
ROLLBACK;
