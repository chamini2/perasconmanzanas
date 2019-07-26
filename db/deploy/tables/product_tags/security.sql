-- Deploy access:tables/product_tags/security to pg

BEGIN;

ALTER TABLE app.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_select ON app.product_tags
    FOR SELECT TO web_user
    USING (account_id = current_setting('request.jwt.claim.account', true));

CREATE POLICY admin_all ON app.product_tags
    FOR ALL TO web_admin
    USING (account_id = current_setting('request.jwt.claim.account', true));

COMMIT;
