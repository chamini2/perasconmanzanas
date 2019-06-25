-- Deploy i:tables/products/security to pg

BEGIN;

ALTER TABLE app.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON app.products
    FOR SELECT TO web_user
    USING (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY user_insert ON app.products
    FOR INSERT TO web_user
    WITH CHECK (account_id = current_setting('request.jwt.claim.account', true));
CREATE POLICY user_update ON app.products
    FOR UPDATE TO web_user
    USING (account_id = current_setting('request.jwt.claim.account', true));

CREATE POLICY admin_all ON app.products
    FOR ALL TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));

COMMIT;
