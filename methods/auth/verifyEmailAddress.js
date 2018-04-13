const dao = require('./dao/verifyEmailAddressDAO')
const date = require('../../common/modules/date')


async function verifyEmailAddress(params) {
    const user = await dao.selectEmailAuthCode(params.email)

    if(params.emailAuthCode !== user.emailAuthCode) {
        throw 'AuthCode is incorrect!'
    }

    const isUpdated = await dao.updateUserStatus(params.email)

    if(!isUpdated) {
        throw 'Failed update user status'
    }

    return {
        emailAuthTime: date.convertDateToString(new Date())
    }
}


exports.verifyEmailAddress = verifyEmailAddress