const apis = require('../../common/api')


async function getBalanceWallet(params) {
    const exchangeFunctions = []
    const apiAuth = params.apiAuth

    for(const exchange of apiAuth) {
        const requestData = {
            apiKey: exchange.apiKey,
            secretKey: exchange.apiSecretKey
        }

        exchangeFunctions.push(apis[exchange.name].getbalances(requestData))
    }

    const exchangeResults = await Promise.all(exchangeFunctions)

    return makeResponse(exchangeResults)
}

function makeResponse(exchangeResults) {
    const response = {}

    for(let i = 0 ; i < exchangeResults.length ; i++) {
        const exchangeName = Object.keys(exchangeResults[i])[0]
        const exchange = exchangeResults[i][exchangeName]

        for(const tokenName in exchange) {
            if(response[tokenName] === undefined) {
                response[tokenName] = {}
            }
            
            response[tokenName][exchangeName] = exchange[tokenName]
        }
    }

    return response
}

exports.getBalanceWallet = getBalanceWallet