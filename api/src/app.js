const express = require('express')
const bearerToken = require('express-bearer-token')
const morgan = require('morgan')
const cors = require('cors')
const asyncHandler = require('express-async-handler')
const Joi = require('joi')
const { celebrate, errors: celebrateErrors } = require('celebrate');

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
    express.json(),
    verifyNoToken,
    celebrate({
        body: Joi.object({
            email: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
            full_name: Joi.string().required()
        })
    }),
    asyncHandler(async function(req, res) {
        const data = await service.register(req.body)
        const token = jwtSign(data)
        res.status(201).send(token)
    })
)

app.post(
    '/api/authenticate',
    express.json(),
    verifyNoToken,
    celebrate({
        body: Joi.object({
            identifier: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    asyncHandler(async function(req, res) {
        const data = await service.signIn(req.body)
        const token = jwtSign(data)
        res.status(200).send(token)
    })
)

app.post(
    '/api/password',
    express.json(),
    verifyToken,
    celebrate({
        body: Joi.object({
            old_password: Joi.string().required(),
            new_password: Joi.string().required()
        })
    }),
    asyncHandler(async function(req, res) {
        const data = await service.changePassword(req.decoded, req.body)
        res.status(204).send()
    })
)

app.put(
    '/api/account',
    express.json(),
    verifyToken,
    celebrate({
        body: Joi.object({
            account: Joi.string().required()
        })
    }),
    asyncHandler(async function(req, res) {
        const data = await service.selectAccount(req.decoded, req.body.account)
        const token = jwtSign(data)
        res.status(200).send(token)
    })
)

app.get(
    '/api/accounts/:account/invites/:invite',
    asyncHandler(async function(req, res) {
        const data = await service.findInvite(req.params.account, req.params.invite)
        res.status(200).send(data)
    })
)

app.post(
    '/api/accounts/:account/invites/:invite',
    verifyToken,
    asyncHandler(async function(req, res) {
        await service.claimInvite(req.decoded, req.params.account, req.params.invite)
        res.status(204).send()
    })
)

app.use(celebrateErrors())
app.use(handlePostgresErrors)
app.use(handleHttpErrors)

app.listen(API_PORT, API_HOST)
console.log(`Running on http://${API_HOST}:${API_PORT}`)
