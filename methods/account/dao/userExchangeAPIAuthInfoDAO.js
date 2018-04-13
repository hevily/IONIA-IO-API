const db = require('../../../common/modules/db')


async function insertUserExchangeAuth(userInfo, exchanges) {
    const rows = await db('usUserExchangeAuth')
    .insert(exchanges)

    return rows[0] > 0
}

async function updateUserExchangeAuth(userInfo) {

}

async function deleteUserExchangeAuth(userInfo) {

}

async function selectUserExchangeAuth(userInfo) {
    const rows = await db('usUserExchangeAuth')
    .select(['exchangeName', 'apiKey', 'apiSecretKey'])
    .where({
        userId: userInfo.id
    })

    return rows
}


exports.insertUserExchangeAuth = insertUserExchangeAuth
exports.updateUserExchangeAuth = updateUserExchangeAuth
exports.deleteUserExchangeAuth = deleteUserExchangeAuth
exports.selectUserExchangeAuth = selectUserExchangeAuth