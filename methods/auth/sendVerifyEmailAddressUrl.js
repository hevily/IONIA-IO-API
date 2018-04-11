const crypto = require('../../common/modules/crypto')
const date = require('../../common/modules/date')
const privacy = require('../../privacy.json')
const dao = require('./dao/sendVerifyEmailAddressUrlDAO')
const makeAuthCode = require('../../common/modules/auth').makeAuthCode
const moduleEmail = require('../../common/modules/mailService')


async function sendVerifyEmailAddressUrl(params) {
    const hashedPassword = crypto.hmac('SHA256', privacy.SECRET_KEY, params.password)
    const user = await dao.selectUser(params.email, hashedPassword)

    if(user.length === 0) {
        throw 'Error to certification'
    }

    const emailAuthCode = makeAuthCode()
    const authExpiredTime = date.operateDate(date.convertDateToString(new Date()), {hours:1})
    const isUpdated = await dao.updateEmailAuth(params.email, emailAuthCode, authExpiredTime)

    if(isUpdated === false) {
        throw 'Error to update Auth Expired Time'
    }

    moduleEmail.sendEmail(params.email, '[IONIA] 회원가입 인증 메일', emailAuthCode)

    return {
        success: true
    }
}


exports.sendVerifyEmailAddressUrl = sendVerifyEmailAddressUrl