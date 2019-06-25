const httpErrors = require('http-errors')
const { pool, transacting } = require('./db')

const USER_ROLE = 'web_user'
const ADMIN_ROLE = 'web_admin'

/** @param {number} arg */
function salting(arg) {
    return `crypt($${arg}, gen_salt('md5'))`;
}

async function register(data) {
    const { email, username, password, full_name } = data
    let user

    await transacting(async function(client) {
        const { rows } = await client.query(`
            INSERT INTO app.users (username, email, full_name)
            VALUES ($1, $2, $3)
            RETURNING *
            `, [username, email, full_name])

        user = rows[0]

        await client.query(`
            INSERT INTO auth.users (id, password)
            VALUES ($1, ${salting(2)})
            `, [user.id, password])
    })

    return tokenData(user.id)
}

async function signIn(credentials) {
    const { identifier, password } = credentials

    let user = await findUserByUsernamePassword(identifier, password)

    if (!user) {
        user = await findUserByEmailPassword(identifier, password)
    }

    if (!user) {
        throw httpErrors.Unauthorized('Wrong credentials')
    }

    return tokenData(user.id)
}

async function changePassword(decodedToken, passwordData) {
    const userId = decodedToken.user
    const { old_password, new_password } = passwordData

    const user = await findUserByUserIdPassword(userId, old_password)

    if (!user) {
        throw httpErrors.Unauthorized('Wrong password')
    }

    const { rows } = await pool.query(`
            UPDATE auth.users SET
                password = ${salting(2)}
            WHERE id = $1
            RETURNING id
        `, [userId, new_password])

    console.log(rows, rows.count);
    if (!rows) {
        throw httpErrors.InternalServerError('Password not updated, try again')
    }
}


async function selectAccount(decodedToken, accountId) {
    const userId = decodedToken.user

    const { rows } = await pool.query(`
            SELECT a.owner_id AS user_id, a.id AS account_id, true AS admin
            FROM app.accounts a
            WHERE a.owner_id = $1 AND a.id = $2
            UNION
            SELECT m.user_id, m.account_id, m.admin
            FROM app.users u
            INNER JOIN app.members m ON (u.id = m.user_id)
            WHERE u.id = $1 AND m.account_id = $2
            LIMIT 1
        `, [userId, accountId])

    const member = rows[0]

    if (!member) {
        throw httpErrors.Forbidden('Not member of account')
    }

    return tokenData(member.user_id, member.account_id, member.admin)
}

async function findInvite(accountId, inviteId, client = pool) {

    const { rows } = await client.query(`
            SELECT i.*
            FROM app.invites i
            WHERE i.id = $1
                AND i.account_id = $2
                AND i.claimed_at IS NULL
        `, [inviteId, accountId])

    const invite = rows[0]

    if (!invite) {
        throw httpErrors.NotFound('Invite not found. It may have expired or been claimed')
    }

    return invite
}

async function claimInvite(decodedToken, accountId, inviteId) {
    const userId = decodedToken.user

    await transacting(async function(client) {
        await findInvite(accountId, inviteId, client)

        // Trigger automatically adds user as member
        await client.query(`
                UPDATE app.invites SET
                    claimed_by_id = $1,
                    claimed_at = CURRENT_TIMESTAMP
                WHERE id = $2
            `, [userId, inviteId])
    })
}

function tokenData(user, account, admin = false) {
    return {
        role: admin ? ADMIN_ROLE : USER_ROLE,
        user,
        account
    }
}

async function findUserByUserIdPassword(userId, password) {
    const { rows } = await pool.query(`
        SELECT u.*
        FROM app.users u
        INNER JOIN auth.users a USING (id)
        WHERE u.id = $1 AND a.password = crypt($2, a.password)
        `, [userId, password])

    return rows[0] || null
}

async function findUserByUsernamePassword(username, password) {
    const { rows } = await pool.query(`
        SELECT u.*
        FROM app.users u
        INNER JOIN auth.users a USING (id)
        WHERE u.username = $1 AND a.password = crypt($2, a.password)
        `, [username, password])

    return rows[0] || null
}

async function findUserByEmailPassword(email, password) {
    const { rows } = await pool.query(`
        SELECT u.*
        FROM app.users u
        INNER JOIN auth.users a USING (id)
        WHERE u.email = $1 AND a.password = crypt($2, a.password)
        `, [email, password])

    return rows[0] || null
}

module.exports = {
    register,
    signIn,
    changePassword,
    selectAccount,
    findInvite,
    claimInvite
}
