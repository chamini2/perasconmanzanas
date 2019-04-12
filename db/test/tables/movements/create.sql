BEGIN;
SELECT plan(37);

SELECT has_table('app'::name, 'movements'::name);
SELECT has_pk('app'::name, 'movements'::name, 'Table app.movements should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'movements'::name, 'id'::name, 'Column app.movements.id should be the PRIMARY KEY');

SELECT has_column('app'::name, 'movements'::name, 'id'::name, 'Column app.movements.id should exist');
SELECT col_type_is('app'::name, 'movements'::name, 'id'::name, 'integer'::name);
SELECT col_not_null('app'::name, 'movements'::name, 'id'::name, 'Column app.movements.id should be NOT NULL');
SELECT col_has_default('app'::name, 'movements'::name, 'id'::name, 'Column app.movements.id should have a DEFAULT');

SELECT has_column('app'::name, 'members'::name, 'user_id'::name, 'Column app.members.user_id should exist');
SELECT col_type_is('app'::name, 'members'::name, 'user_id'::name, 'integer'::name);
SELECT col_not_null('app'::name, 'members'::name, 'user_id'::name, 'Column app.members.user_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'members'::name, 'user_id'::name, 'Column app.members.user_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'members'::name, 'user_id'::name, 'app'::name, 'users'::name, 'id'::name);

SELECT has_column('app'::name, 'movements'::name, 'account_id'::name, 'Column app.movements.account_id should exist');
SELECT col_type_is('app'::name, 'movements'::name, 'account_id'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'movements'::name, 'account_id'::name, 'Column app.movements.account_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'movements'::name, 'account_id'::name, 'Column app.movements.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'movements'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'movements'::name, 'product_sku'::name, 'Column app.movements.product_sku should exist');
SELECT col_type_is('app'::name, 'movements'::name, 'product_sku'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'movements'::name, 'product_sku'::name, 'Column app.movements.product_sku should be NOT NULL');
SELECT col_is_fk('app'::name, 'movements'::name, ARRAY['product_sku', 'account_id']::name[], 'Columns (app.movements.product_sku, app.movements.account_id) should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'movements'::name, ARRAY['product_sku', 'account_id']::name[], 'app'::name, 'products'::name, ARRAY['sku', 'account_id']::name[]);

SELECT has_column('app'::name, 'movements'::name, 'quantity'::name, 'Column app.movements.quantity should exist');
SELECT col_type_is('app'::name, 'movements'::name, 'quantity'::name, 'integer'::name);
SELECT col_not_null('app'::name, 'movements'::name, 'quantity'::name, 'Column app.movements.quantity should be NOT NULL');
SELECT col_has_check('app'::name, 'movements'::name, 'quantity'::name, 'Column should have CHECK constraint');
SELECT throws_ok(
    $$
        INSERT INTO app.movements (account_id, product_sku, quantity, description)
        VALUES ('shorts', 'L-GRAY', 0, '')
    $$,
    23514
);
SELECT throws_ok(
    $$
        INSERT INTO app.movements (account_id, product_sku, quantity, description)
        VALUES ('shorts', 'L-GRAY', 1, '')
    $$,
    23503 -- FOREIGN KEY fails instead of CHECK
);
SELECT throws_ok(
    $$
        INSERT INTO app.movements (account_id, product_sku, quantity, description)
        VALUES ('shorts', 'L-GRAY', -1, '')
    $$,
    23503 -- FOREIGN KEY fails instead of CHECK
);

SELECT has_column('app'::name, 'movements'::name, 'description'::name, 'Column app.movements.description should exist');
SELECT col_type_is('app'::name, 'movements'::name, 'description'::name, 'text'::name);
SELECT col_not_null('app'::name, 'movements'::name, 'description'::name, 'Column app.movements.description should be NOT NULL');

SELECT has_column('app'::name, 'movements'::name, 'created_at'::name, 'Column app.movements.created_at should exist');
SELECT col_type_is('app'::name, 'movements'::name, 'created_at'::name, 'timestamp with time zone'::name);
SELECT col_not_null('app'::name, 'movements'::name, 'created_at'::name, 'Column app.movements.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'movements'::name, 'created_at'::name, 'Column app.movements.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'movements'::name, 'created_at'::name, 'now()', 'Column app.movements.created_at should set DEFAULT to now()')::name;

SELECT finish();
ROLLBACK;
