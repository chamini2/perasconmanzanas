-- Deploy i:tables/products/create to pg

BEGIN;

CREATE TABLE app.products (
    PRIMARY KEY (sku, account_id),
    sku         citext
                NOT NULL,
    account_id  citext
                NOT NULL
                REFERENCES app.accounts (id)
                  ON UPDATE CASCADE
                  ON DELETE CASCADE,
    description text
                NOT NULL,
    created_at  timestamp with time zone
                DEFAULT now()
                NOT NULL
);

COMMIT;
