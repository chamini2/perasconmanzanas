const { Pool } = require('pg')

const USER_ROLE = 'web_user'

const pool = new Pool()

// the pool emits errors on behalf of any idle clients
pool.on('error', function(err, client) {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

async function register(data) {
    const { email, username, password, first_name, last_name } = data
    const client = await pool.connect()
    let user

    try {
        await client.query('BEGIN')

        const { rows } = await client.query(`
            INSERT INTO app.users (username, email, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `, [username, email, first_name, last_name])

        user = rows[0]

        await client.query(`
            INSERT INTO auth.users (id, password)
            VALUES ($1, crypt($2, gen_salt('md5')))
            `, [user.id, password])

        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }

    return token(user)
}

async function signin(credentials) {
    const { identifier, password } = credentials

    let user = await findUserByUsernamePassword(identifier, password)

    if (!user) {
        user = await findUserByEmailPassword(identifier, password)
    }

    if (!user) {
        throw new Error('401')
    }

    return token(user)
}

function token(user) {
    return { role: USER_ROLE, user }
}

async function findUserByUsernamePassword(username, password) {
    const { rows } = await pool.query(`
        SELECT users.*
        FROM app.users users
        INNER JOIN auth.users WITH (id) auth
        WHERE users.username = $1 AND auth.password = crypt($2, auth.password)
        `, [username, password])

    console.log(found)
    return rows[0] || null
}

async function findUserByEmailPassword(email, password) {
    let found
    try {
        const { rows } = await pool.query(`
            SELECT users.*
            FROM app.users users
            INNER JOIN auth.users WITH (id) auth
            WHERE users.email = $1 AND auth.password = crypt($2, auth.password)
            `, [email, password])
        found = rows[0]
    } catch (e) {
        console.error(e.toString())
        return null;
    }

    console.log(found)
    return found || null
}

module.exports = {
    register,
    signin
}
