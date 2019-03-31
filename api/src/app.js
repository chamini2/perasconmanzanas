const express = require('express')
const bearerToken = require('express-bearer-token')
const morgan = require('morgan')
const asyncHandler = require('express-async-handler')
const Joi = require('joi')
const validator = require('express-joi-validation')({})

const service = require('./service')
const {
    verifyHasToken,
    verifyNoToken,
    jwtSign,
    handlePostgresErrors
} = require('./helpers')

const API_PORT = 5000
const API_HOST = '0.0.0.0'

const app = express()

app.use(bearerToken())
app.use(morgan('combined'))

app.post(
    '/api/users',
    verifyNoToken,
    express.json(),
    validator.body(Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required()
    })),
    asyncHandler(async function(req, res) {
        const data = await service.register(req.body)
        const token = jwtSign(data)
        res.status(201).send(token)
    })
)

app.post(
    '/api/authenticate',
    verifyNoToken,
    express.json(),
    validator.body(Joi.object({
        identifier: Joi.string().required(),
        password: Joi.string().required()
    })),
    asyncHandler(async function(req, res) {
        let data

        try {
            data = await service.signin(req.body)
        } catch (e) {
            if (e.message == '401') {
                res.status(401).send('Wrong credentials')
                return
            } else {
                throw e
            }
        }

        const token = jwtSign(data)
        res.status(201).send(token)
    })
)

app.patch(
    '/api/account',
    express.json(),
    verifyHasToken,
    validator.body(Joi.object({
        account: Joi.string().required()
    })),
    asyncHandler(async function(req, res) {
        const data = await service.account(req.token, req.body)

        const token = jwtSign(data)
        res.status(200).send(token)
    })
)

app.use(handlePostgresErrors)

app.listen(API_PORT, API_HOST)
console.log(`Running on http://${API_HOST}:${API_PORT}`)
