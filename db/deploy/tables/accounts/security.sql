-- Deploy i:tables/accounts/security to pg

BEGIN;

ALTER TABLE app.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON app.accounts
    FOR SELECT TO web_user
    USING (
        owner_id::text = current_setting('request.jwt.claim.user', true)
        OR (
            SELECT bool_or(m.user_id::text = current_setting('request.jwt.claim.user', true))
            FROM app.members m
            WHERE m.account_id = id
        )
    );
CREATE POLICY user_insert ON app.accounts
    FOR INSERT TO web_user
    WITH CHECK (owner_id::text = current_setting('request.jwt.claim.user', true));

CREATE POLICY admin_update ON app.accounts
    FOR UPDATE TO web_admin
    USING (id = current_setting('request.jwt.claim.account', true));
CREATE POLICY admin_delete ON app.accounts
    FOR DELETE TO web_admin
    USING (id = current_setting('request.jwt.claim.account', true));

COMMIT;
