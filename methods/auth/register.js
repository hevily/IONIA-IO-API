const knex = require('knex')
const dao = require('./dao/registerDAO')
const crypto = require('../../common/modules/crypto')
const date = require('../../common/modules/date')
const auth = require('../../common/modules/auth')
const makeAuthCode = require('../../common/modules/auth').makeAuthCode
const sendVerifyEmailAddressUrl = require('./sendVerifyEmailAddressUrl').sendVerifyEmailAddressUrl


async function register(params) {
    const emailAuthCode = makeAuthCode()
    const encryptedPassword = auth.encryptPassword(params.password)

    const isInserted = await dao.insertUser(params.email, encryptedPassword)

    if(isInserted === false) {
        throw 'Error to create user'
    }

    const createdTime = await dao.selectCreatedTime(params.email)

    sendVerifyEmailAddressUrl(params)

    return {
        registeredTime: date.convertDateToString(createdTime)
    }
}


exports.register = register