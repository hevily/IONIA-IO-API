const dao = require('./dao/resetPasswordDAO')
const auth = require('../../common/modules/auth')


async function resetPassword(params) {
    const isUpdated = await dao.updatePassword(params.email, auth.encryptPassword(params.password))

    return {
        email: params.email
    }
}


exports.resetPassword = resetPassword