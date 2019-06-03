DELETE FROM app.users
WHERE id IN (100, 200);

INSERT INTO app.users (id, username, email, full_name)
VALUES
    (100, 'jdoe', 'jdoe@example.com', 'John Doe'),
    (200, 'mpatt', 'mpatt@example.com', 'Matt Patt');

-- Passwords are all 'password'
INSERT INTO auth.users(id, password)
VALUES
    (100, '$1$Aae247jU$iZwvrH1eTTVCH.Y.eii4g.'),
    (200, '$1$Aae247jU$iZwvrH1eTTVCH.Y.eii4g.');

INSERT INTO app.accounts (id, name, owner_id)
VALUES
    ('gloves', 'Gloves Store', 100),
    ('puros', 'Tienda de Puros', 200);

INSERT INTO app.members (account_id, user_id, admin)
VALUES
    ('gloves', 100, true),
    ('gloves', 200, false),
    ('puros', 200, true);

INSERT INTO app.products (sku, account_id, description)
VALUES
    ('L-GRAY', 'gloves', 'The gray large ones'),
    ('M-GRAY', 'gloves', 'The gray medium ones'),
    ('S-GRAY', 'gloves', 'The gray small ones'),
    ('L-DOM', 'puros', 'El dominicano'),
    ('M-CUB', 'puros', 'El cubano');

INSERT INTO app.movements (product_sku, account_id, user_id, quantity, description, created_at)
VALUES
    ('L-GRAY', 'gloves', 100, 20, 'Inventory start', CURRENT_TIMESTAMP - interval '1 month'),
    ('M-GRAY', 'gloves', 200, 2, 'Inventory start', CURRENT_TIMESTAMP - interval '1 month'),
    ('M-CUB', 'puros', 200, 204, 'Comienzo de inventario', CURRENT_TIMESTAMP - interval '2 weeks'),
    ('M-CUB', 'puros', 100, -12, 'Venta a Luis', CURRENT_TIMESTAMP - interval '13 days'),
    ('M-CUB', 'puros', 200, -24, 'Venta a José', CURRENT_TIMESTAMP - interval '12 days 20 hours'),
    ('M-CUB', 'puros', 100, -12, 'Venta a Carlos', CURRENT_TIMESTAMP - interval '8 days'),
    ('M-CUB', 'puros', 200, -6, 'Venta a Manuel', CURRENT_TIMESTAMP - interval '20 hours'),
    ('M-CUB', 'puros', 200, -36, 'Venta a Alberto', CURRENT_TIMESTAMP);
