-- Deploy i:tables/movements/security to pg

BEGIN;

ALTER TABLE app.movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON app.movements
    FOR SELECT TO web_user
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY user_insert ON app.movements
    FOR INSERT TO web_user
    WITH CHECK (
        account_id = current_setting('request.jwt.claim.account', true)
        AND user_id::text = current_setting('request.jwt.claim.user', true)
    );
CREATE POLICY user_update ON app.movements
    FOR UPDATE TO web_user
    USING (
        account_id = current_setting('request.jwt.claim.account', true)
        AND user_id::text = current_setting('request.jwt.claim.user', true)
    );
CREATE POLICY user_delete ON app.movements
    FOR DELETE TO web_user
    USING (
        account_id = current_setting('request.jwt.claim.account', true)
        AND user_id::text = current_setting('request.jwt.claim.user', true)
    );

COMMIT;
