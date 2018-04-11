const knex = require('knex')
const db = require('../../../common/modules/db')


async function selectCreatedTime(email) {
    const rows = await db('usUserMaster')
    .select(['createdTime'])
    .where({
        email: email
    })

    return rows[0].createdTime
}

async function insertUser(email, password) {
    const rows = await db('usUserMaster')
    .insert({
        email: email,
        password: password
    })

    return rows[0] > 0 ? true : false
}

async function updateAuthExpiredTime(email, time) {
    const updateCount = await db('usUserMaster')
    .update({
        emailAuthExpiredTime: time
    })
    .where({
        email: email
    })

    return updateCount > 0 ? true : false
}


exports.selectCreatedTime = selectCreatedTime
exports.insertUser = insertUser
exports.updateAuthExpiredTime = updateAuthExpiredTime