const jwt = require('jsonwebtoken')

const JWT_SECRET = 'key' // TODO: change for real key
const JWT_EXPIRATION = '7d'

function verifyHasToken(req, res, next) {
    if (req.token) {
        next()
    } else {
        res.send(401)
    }
}

function verifyNoToken(req, res, next) {
    if (req.token) {
        res.send(403, 'Already logged in')
    } else {
        next()
    }
}

function jwtSign(data) {
    jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
}

function handlePostgresErrors(err, req, res, next) {
    if (err.hasOwnProperty('schema')) {
        // Postgres error
        switch (err.code) {
            case "23505": {
                res.status(409).send(err.message)
                break
            }
            default: {
                // TODO: catch more codes
                res.status(400).send(`${err.code}: ${err.message}`)
                break
            }
        }
        return
    } else {
        next(err)
        return
    }
}

module.exports = {
    verifyHasToken,
    verifyNoToken,
    jwtSign,
    handlePostgresErrors
}
