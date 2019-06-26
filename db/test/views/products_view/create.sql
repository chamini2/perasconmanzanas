BEGIN;
SELECT plan(2);

INSERT INTO app.users (id, username, email, full_name)
VALUES (1, 'john', 'john@example.com', 'John Doe');

INSERT INTO app.accounts (id, name, owner_id)
VALUES ('shorts', 'Shorts Store', 1);

INSERT INTO app.products (sku, account_id, description)
VALUES
    ('L-GRAY', 'shorts', 'The gray large ones'),
    ('M-GRAY', 'shorts', 'The gray medium ones');

INSERT INTO app.movements (product_sku, account_id, user_id, quantity, description)
VALUES
    ('L-GRAY', 'shorts', 1, 20, 'Inventory start');

SELECT has_view('app', 'products_view', 'View products_view should exist');

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$SELECT sku::text, stock::integer FROM app.products_view ORDER BY sku$$,
    $$VALUES ('L-GRAY', 20), ('M-GRAY', 0)$$,
    'Should SELECT products even if no movement is associated'
);

SELECT finish();
ROLLBACK;
