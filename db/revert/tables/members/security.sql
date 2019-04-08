-- Revert i:tables/members/security from pg

BEGIN;

ALTER TABLE app.members DISABLE ROW LEVEL SECURITY;

COMMIT;
