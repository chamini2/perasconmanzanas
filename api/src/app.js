const express = require('express')
const bearerToken = require('express-bearer-token')
const morgan = require('morgan')
const cors = require('cors')
const asyncHandler = require('express-async-handler')
const Joi = require('joi')
const validator = require('express-joi-validation')({})

const service = require('./service')
const {
    verifyToken,
    verifyNoToken,
    jwtSign,
    handlePostgresErrors,
    handleHttpErrors
} = require('./helpers')

const API_PORT = 5000
const API_HOST = '0.0.0.0'

const app = express()

app.use(bearerToken())
app.use(morgan('combined'))
app.use(cors())

app.post(
    '/api/users',
    verifyNoToken,
    express.json(),
    validator.body(Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        full_name: Joi.string().required()
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
        const data = await service.signIn(req.body)
        const token = jwtSign(data)
        res.status(200).send(token)
    })
)

app.put(
    '/api/account',
    express.json(),
    verifyToken,
    validator.body(Joi.object({
        account: Joi.string().required()
    })),
    asyncHandler(async function(req, res) {
        const data = await service.selectAccount(req.decoded, req.body.account)
        const token = jwtSign(data)
        res.status(200).send(token)
    })
)

app.use(handlePostgresErrors)
app.use(handleHttpErrors)

app.listen(API_PORT, API_HOST)
console.log(`Running on http://${API_HOST}:${API_PORT}`)
