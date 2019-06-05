-- Deploy i:functions/trigger_function_add_member_when_invite_claimed to pg

BEGIN;

CREATE FUNCTION auth.add_member_when_invite_claimed() RETURNS trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    CASE TG_OP
      WHEN 'UPDATE' THEN
        IF NEW.claimed_by_id IS NOT NULL AND OLD.claimed_by_id IS NULL THEN
          INSERT INTO app.members (account_id, user_id)
          SELECT NEW.account_id, NEW.claimed_by_id;
        END IF;
    END CASE;

    RETURN NEW;
  END;
  $$;

COMMIT;
