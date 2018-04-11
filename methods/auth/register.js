const knex = require('knex')
const dao = require('./dao/registerDAO')
const crypto = require('../../common/modules/crypto')
const date = require('../../common/modules/date')
const privacy = require('../../privacy.json')
const makeAuthCode = require('../../common/modules/auth').makeAuthCode
const sendVerifyEmailAddressUrl = require('./sendVerifyEmailAddressUrl').sendVerifyEmailAddressUrl


async function register(params) {
    const emailAuthCode = makeAuthCode()
    const hashedPassword = crypto.hmac('SHA256', privacy.SECRET_KEY, params.password)

    const isInserted = await dao.insertUser(params.email, hashedPassword)

    if(isInserted === false) {
        throw 'Error to create user'
    }

    const createdTime = await dao.selectCreatedTime(params.email)

    sendVerifyEmailAddressUrl(params)

    return {
        registeredTime: createdTime
    }
}


exports.register = register