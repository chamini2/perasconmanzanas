-- Deploy access:tables/traits/security to pg

BEGIN;

ALTER TABLE app.traits ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON app.traits
    FOR SELECT TO web_user
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY user_insert ON app.traits
    FOR INSERT TO web_user
    WITH CHECK (account_id = current_setting('request.jwt.claim.account', true));

CREATE POLICY admin_all ON app.traits
    FOR ALL TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));

COMMIT;
