const db = require('../../../common/modules/db')


async function selectUser(email, password) {
    const rows = await db('usUserMaster')
    .select(['userStatus'])
    .where({
        email: email
    })

    return rows
}


exports.selectUser = selectUser