const dao = require('./dao/resetPasswordDAO')
const auth = require('../../common/modules/auth')


async function resetPassword(params) {
    const isUpdated = await dao.updatePassword(params.userInfo.email, auth.encryptPassword(params.userInfo.password))

    if(!isUpdated) {
        throw 'Failed update password'
    }

    return {
        email: params.userInfo.email
    }
}


exports.resetPassword = resetPassword