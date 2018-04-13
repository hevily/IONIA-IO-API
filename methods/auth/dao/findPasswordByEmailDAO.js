const db = require('../../../common/modules/db')


async function isValidUser(email) {
    const rows = await db('usUserMaster')
    .select(['userStatus'])
    .where({
        email: email,
        userStatus: 'VERIFIED'
    })

    return rows.length > 0
}


exports.isValidUser = isValidUser