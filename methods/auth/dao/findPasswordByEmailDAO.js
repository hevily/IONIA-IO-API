const db = require('../../../common/modules/db')


async function selectUser(email) {
    const rows = await db('usUserMaster')
    .select(['email', 'userStatus'])
    .where({
        email: email,
        userStatus: 'VERIFIED'
    })

    return rows
}


exports.selectUser = selectUser