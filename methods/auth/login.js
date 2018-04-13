const jwt = require('jsonwebtoken')
const privacy = require('../../privacy.json')
const crypto = require('../../common/modules/crypto')
const date = require('../../common/modules/date')
const auth = require('../../common/modules/auth')
const dao = require('./dao/loginDAO')


async function login(ctx, params) {
    const encryptedPassword = auth.encryptPassword(params.password)
    const users = await dao.selectUser(params.email, encryptedPassword)

    if(users.length === 0) {
        throw 'User not found'
    }

    if(users[0].userStatus === 'NOT_VERIFIED') {
        throw 'User not verified'
    }
    
    const result = {
        loginTime: date.convertDateToString(new Date()),
        accessToken: jwt.sign({email: params.email}, privacy.SECRET_KEY)
    }

    return result
}


exports.login = login