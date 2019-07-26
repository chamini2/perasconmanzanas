-- Deploy schema:tables/product_tags/create to pg

BEGIN;

CREATE TABLE app.product_tags (
    PRIMARY KEY (name, product_sku, account_id),
    name        citext
                NOT NULL,
    account_id  citext
                NOT NULL
                REFERENCES app.accounts (id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
    product_sku citext
                NOT NULL,
    FOREIGN KEY (product_sku, account_id)
        REFERENCES app.products (sku, account_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
    created_at  timestamp with time zone
                DEFAULT now()
                NOT NULL
);

COMMIT;
