const dao = require('./dao/userExchangeAPIAuthInfoDAO')


async function insertUserExchangeAPIAuthInfo(params) {
    for(let i = 0; i < params.exchanges.length; i++) {
        params.exchanges[i].userId = params.userInfo.id
        params.exchanges[i].exchangeAuthName = params.exchanges[i].exchangeName
    }

    const isInserted = await dao.insertUserExchangeAuth(params.userInfo, params.exchanges)

    return isInserted
}

async function updateUserExchangeAPIAuthInfo(params) {
    // const isUpdated = await dao.updateUserExchangeAuth(params.userInfo)

    // return isUpdated
}

async function deleteUserExchangeAPIAuthInfo(params) {
    // const isDeleted = await dao.deleteUserExchangeAuth(params.userInfo)

    // return isDeleted
}

async function getUserExchangeAPIAuthInfo(params) {
    const apis = await dao.selectUserExchangeAuth(params.userInfo)

    return {data: apis}
}


exports.insertUserExchangeAPIAuthInfo = insertUserExchangeAPIAuthInfo
exports.updateUserExchangeAPIAuthInfo = updateUserExchangeAPIAuthInfo
exports.deleteUserExchangeAPIAuthInfo = deleteUserExchangeAPIAuthInfo
exports.getUserExchangeAPIAuthInfo = getUserExchangeAPIAuthInfo