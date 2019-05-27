-- Deploy i:tables/movements/create to pg

BEGIN;

CREATE TABLE app.movements (
    id          serial
                PRIMARY KEY,
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
    user_id     integer
                NOT NULL
                REFERENCES app.users (id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
    quantity    integer
                NOT NULL
                CHECK (quantity <> 0),
    description text
                NOT NULL,
    created_at  timestamp with time zone
                DEFAULT now()
                NOT NULL
);

COMMIT;
