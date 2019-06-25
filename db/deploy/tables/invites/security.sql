-- Deploy server:tables/invites/security to pg

BEGIN;

ALTER TABLE app.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY api_all ON app.invites
    FOR ALL TO api
    USING (true);

CREATE POLICY admin_select ON app.invites
    FOR SELECT TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY admin_insert ON app.invites
    FOR INSERT TO web_admin
    WITH CHECK (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY admin_update ON app.invites
    FOR UPDATE TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY admin_delete ON app.invites
    FOR DELETE TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));

COMMIT;
