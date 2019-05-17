const httpErrors = require('http-errors')
const jwt = require('jsonwebtoken')

const JWT_SECRET = '7a42166a63c5747b6e94bea42d5821b1' // TODO: change for real key
const JWT_EXPIRATION = '7d' // 7 days

function verifyToken(req, res, next) {
    if (req.token) {
        try {
            req.decoded = jwt.verify(req.token, JWT_SECRET)
            next()
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                next(httpErrors.Unauthorized('JWT Expired'))
            } else {
                next(httpErrors.Unauthorized('Invalid token'))
            }
        }
    } else {
        next(httpErrors.Unauthorized('No token'))
    }
}

function verifyNoToken(req, res, next) {
    if (req.token) {
        next(httpErrors.Forbidden('Already logged in'))
    } else {
        next()
    }
}

function jwtSign(data) {
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
}

function handlePostgresErrors(err, req, res, next) {
    function code2Http(code) {
        // Taken from https://github.com/PostgREST/postgrest/blob/673aa25082cde4e6c5a9631e1d4ee0d9f4335cf8/src/PostgREST/Error.hs#L162-L195
        switch (code) {
            case '23503': return 409    // foreign_key_violation
            case '23505': return 409    // unique_violation
            case 'P0001': return 400    // default code for "raise"
            case '42883': return 404    // undefined function
            case '42P01': return 404    // undefined table
            case '42501': return 403    // insufficient privilege
            default: {
                if (/^08/.test(code)) return 503    // pg connection err
                if (/^09/.test(code)) return 500    // triggered action exception
                if (/^0L/.test(code)) return 403    // invalid grantor
                if (/^0P/.test(code)) return 403    // invalid role specification
                if (/^25/.test(code)) return 500    // invalid tx state
                if (/^28/.test(code)) return 403    // invalid auth specification
                if (/^2D/.test(code)) return 500    // invalid tx termination
                if (/^38/.test(code)) return 500    // external routine exception
                if (/^39/.test(code)) return 500    // external routine invocation
                if (/^3B/.test(code)) return 500    // savepoint exception
                if (/^40/.test(code)) return 500    // tx rollback
                if (/^53/.test(code)) return 503    // insufficient resources
                if (/^54/.test(code)) return 413    // too complex
                if (/^55/.test(code)) return 500    // obj not on prereq state
                if (/^57/.test(code)) return 500    // operator intervention
                if (/^58/.test(code)) return 500    // system error
                if (/^F0/.test(code)) return 500    // conf file error
                if (/^HV/.test(code)) return 500    // foreign data wrapper error
                if (/^P0/.test(code)) return 500    // PL/pgSQL Error
                if (/^XX/.test(code)) return 500    // internal Error
            }
        }
    }

    if (err.hasOwnProperty('schema')) {
        // Postgres error
        const httpCode = code2Http(err.code)
        if (httpCode) {
            next(httpErrors[httpCode](err.message))
        } else {
            console.error(err)
            next(httpErrors.BadRequest(`${err.code}: ${err.message}`))
        }
    } else {
        next(err)
    }
}

function handleHttpErrors(err, req, res, next) {
    if (err instanceof httpErrors.HttpError) {
        res.status(err.status).send(err.message)
    } else {
        res.status(500).send(err.message)
    }
}

module.exports = {
    verifyToken,
    verifyNoToken,
    jwtSign,
    handlePostgresErrors,
    handleHttpErrors
}
