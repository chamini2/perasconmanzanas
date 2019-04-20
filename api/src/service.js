const httpErrors = require('http-errors')
const { pool, transacting } = require('./db')

const USER_ROLE = 'web_user'
const ADMIN_ROLE = 'web_admin'

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
            VALUES ($1, crypt($2, gen_salt('md5')))
            `, [user.id, password])
    });

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

function tokenData(user, account, admin = false) {
    return {
        role: admin ? ADMIN_ROLE : USER_ROLE,
        user,
        account
    }
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
    selectAccount
}
