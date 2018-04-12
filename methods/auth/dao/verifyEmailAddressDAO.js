const db = require('../../../common/modules/db')


async function selectEmailAuthCode(email) {
    const rows = await db('usUserMaster')
    .select(['emailAuthCode'])
    .where({
        email: email
    })

    return rows[0]
}

async function updateUserStatus(email) {
    const rows = await db('usUserMaster')
    .update({
        userStatus: 'VERIFIED'
    })
    .where({
        email: email
    })

    return rows[0] > 0
}


exports.selectEmailAuthCode = selectEmailAuthCode
exports.updateUserStatus = updateUserStatus