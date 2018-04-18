const db = require('../../../common/modules/db')


async function selectUserWallet(userId) {
    const rows = await db('usUserWallet')
    .select(['currency', 'address'])
    .where({
        userId: userId
    })

    return rows
}

async function insertUserWallet(userId, walletInfo) {
    const currencyName = Object.keys(walletInfo)[0]
    const insertedCount = await db('usUserWallet')
    .insert({
        userId: userId,
        currency: currencyName,
        address: walletInfo[currencyName].address
    })

    return insertedCount[0] > 0
}

exports.selectUserWallet = selectUserWallet
exports.insertUserWallet = insertUserWallet