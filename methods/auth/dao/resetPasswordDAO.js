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

async function updatePassword(email, newPassword) {
    const updateRowCount = await db('usUserMaster')
    .update({
        password: newPassword
    })
    .where({
        email: email
    })

    return updateRowCount > 0
}


exports.selectUser = selectUser
exports.updatePassword = updatePassword