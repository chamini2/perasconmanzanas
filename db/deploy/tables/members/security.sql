-- Deploy i:tables/members/security to pg

BEGIN;

ALTER TABLE app.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON app.members
    FOR SELECT TO web_user
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY user_delete ON app.members
    FOR DELETE TO web_user
    USING (
        account_id = current_setting('request.jwt.claim.account', true)
        AND user_id::text = current_setting('request.jwt.claim.user', true)
    );

CREATE POLICY admin_insert ON app.members
    FOR INSERT TO web_admin
    WITH CHECK (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY admin_update ON app.members
    FOR UPDATE TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY admin_delete ON app.members
    FOR DELETE TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));

COMMIT;
