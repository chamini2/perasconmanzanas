-- Deploy i:tables/users/create to pg

BEGIN;

CREATE TABLE app.users (
    username citext
             PRIMARY KEY,
    CONSTRAINT valid_username CHECK (username ~ '^[a-z0-9_.]*$'),
    email citext
          NOT NULL
          UNIQUE,
    first_name text
               NOT NULL,
    last_name text
              NOT NULL,
    created_at timestamp with time zone
               DEFAULT now()
               NOT NULL
);

COMMIT;
