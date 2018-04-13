const auth = require('../../common/modules/auth')
const dao = require('./dao/findPasswordByEmailDAO')
const moduleEmail = require('../../common/modules/mailService')


async function findPWbyEmail(params) {
    const isValidUser = await dao.isValidUser(params.email)

    if(!isValidUser) {
        throw 'User not found!'
    }

    const resetPasswordToken = auth.issueToken({email: params.email}, 60)
    const resetPasswordUrl = 'http://url?accessToken=' + resetPasswordToken

    await moduleEmail.sendEmail(params.email, '[IONIA] 비밀번호 재설정', resetPasswordUrl)

    return {
        'resetPasswordUrl': resetPasswordUrl
    }
}


exports.findPWbyEmail = findPWbyEmail