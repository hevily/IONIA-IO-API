const db = require('../../../common/modules/db')


async function insertUserExchangeAuth(exchanges) {
    const rows = await db('usUserExchangeAuth')
    .insert(exchanges)

    return rows[0] > 0
}

async function updateUserExchangeAuth(userInfo, exchanges) {
    let isUpdated = true

    for(let i = 0; i < exchanges.length; i++) {
        const exchange = exchanges[i]
        const updates = {}
        
        if(exchange.apiKey) {
            updates.apiKey = exchange.apiKey
        }

        if(exchange.apiSecretKey) {
            updates.apiSecretKey = exchange.apiSecretKey
        }

        const updatedCount = await db('usUserExchangeAuth')
        .update(updates)
        .where({
            userId: userInfo.id,
            exchangeName: exchange.exchangeName
        })

        if(updatedCount === 0) {
            isUpdated = false
        }
    }

    return isUpdated
}

async function deleteUserExchangeAuth(userId, exchanges) {
    let isDeleted = true

    for(const exchangeName of exchanges) {
        const deletedCount = await db('usUserExchangeAuth')
        .where({
            userId: userId,
            exchangeName: exchangeName
        })
        .del()
        
        if(deletedCount === 0) {
            isDeleted = false
        }
    }

    return isDeleted
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