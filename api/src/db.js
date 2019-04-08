const { Pool } = require('pg')

const pool = new Pool()

// the pool emits errors on behalf of any idle clients
pool.on('error', function(err, client) {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

async function transacting(callback) {
    const client = await pool.connect()
    let result = null

    try {
        client.query('BEGIN')

        result = await callback(client)

        client.query('COMMIT')
        client.release()
    } catch (e) {
        await client.query('ROLLBACK')
        client.release()
        throw e
    }

    return result
}

module.exports = {
  pool,
  transacting
}
