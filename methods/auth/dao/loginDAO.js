const db = require('../../../common/modules/db')


async function selectUser(email, password) {
    const rows = await db('usUserMaster')
    .select(['id', 'email', 'userStatus', 'createdTime', 'updatedTime'])
    .where({
        email: email,
        password: password
    })

    return rows
}


exports.selectUser = selectUser