const dao = require('./dao/registerDAO')
const crypto = require('../../common/modules/crypto')
const date = require('../../common/modules/date')
const privacy = require('../../privacy.json')
const knex = require('knex')


async function register(params) {
    const emailAuthCode = makeAuthCode()
    const hashedPassword = crypto.hmac('SHA256', privacy.SECRET_KEY, params.password)

    const isInserted = await dao.insertUser(params.email, hashedPassword, emailAuthCode)

    if(isInserted === false) {
        throw 'Error to create user'
    }

    const authExpiredTime = date.operateDate(date.convertDateToString(new Date()), {hours:1})
    const isUpdated = await dao.updateAuthExpiredTime(params.email, authExpiredTime)

    if(isUpdated === false) {
        throw 'Error to update Auth Expired Time'
    }

    const createdTime = await dao.selectCreatedTime(params.email)

    return {
        registeredTime: createdTime
    }
}

function makeAuthCode() {
    const ALPHABET = 0, NUMBER = 1
    let authCode = ''

    for(let i = 0; i < 6; i++) {
        const alphabetOrNumber = Math.floor((Math.random() * 2))

        if(alphabetOrNumber === ALPHABET) {
            authCode += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))
        }
        else {
            authCode += Math.floor(Math.random() * 10)
        }
    }

    return authCode
}


exports.register = register