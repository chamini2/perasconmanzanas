-- Deploy i:tables/users/create to pg

BEGIN;

CREATE TABLE app.users (
    id         serial
               PRIMARY KEY,
    username   citext
               NOT NULL,
    CONSTRAINT valid_username CHECK (username ~ '^[a-z0-9_.]+$'),
    CONSTRAINT unique_username UNIQUE (username),
    email      citext
               NOT NULL,
    CONSTRAINT unique_email UNIQUE (email),
    first_name text
               NOT NULL,
    last_name  text
               NOT NULL,
    created_at timestamp with time zone
               DEFAULT now()
               NOT NULL
);

COMMIT;
