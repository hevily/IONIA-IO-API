const db = require('../../../common/modules/db')


async function selectUser(email, password) {
    const rows = await db('usUserMaster')
    .select(['email'])
    .where({
        email: email,
        password: password
    })

    return rows
}

async function updateEmailAuth(email, emailAuthCode, emailAuthExpiredTime) {
    const updateCount = await db('usUserMaster')
    .update({
        emailAuthCode: emailAuthCode,
        emailAuthExpiredTime: emailAuthExpiredTime
    })
    .where({
        email: email
    })

    return updateCount > 0 ? true : false
}


exports.selectUser = selectUser
exports.updateEmailAuth = updateEmailAuth