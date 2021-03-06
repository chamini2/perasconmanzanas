-- Deploy i:tables/members/create to pg

BEGIN;

CREATE TABLE app.members (
    PRIMARY KEY (user_id, account_id),
    user_id    integer
               NOT NULL
               REFERENCES app.users (id)
                   ON UPDATE CASCADE
                   ON DELETE CASCADE,
    account_id citext
               NOT NULL
               REFERENCES app.accounts (id)
                   ON UPDATE CASCADE
                   ON DELETE CASCADE,
    admin      boolean
               DEFAULT false
               NOT NULL,
    created_at timestamp with time zone
               DEFAULT now()
               NOT NULL
);

COMMIT;
