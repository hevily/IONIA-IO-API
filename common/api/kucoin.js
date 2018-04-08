const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')


async function getbalances(data) {
    const uri = '/v1/account/balance'
    const requestParams = {
        // max
        limit: 20,
        page: 1
    }

    const balances = await requestToKucoin(uri, data, requestParams)

    const result = {}

    if(balances.success === true) {
        const kucoinObject = result['kucoin'] = {}

        for(let i = 0 ; i < data.length ; i++) {
            const coin = data[i]

            kucoinObject[coin.coinType.toLowerCase()] = {
                available: coin.balance,
                balance: coin.balance,
                pending: 0
            }
        }
    }

    return result
}

async function getaddress(data) {
    const uri = `/v1/account/${data.currency}/wallet/address`
    const requestParams = {}

    const addresses = await requestToKucoin(uri, data, requestParams)

    const result = {}

    if(addresses.success === true) {
        result['kucoin'] = {}
        result.kucoin[data.currency] = addresses.data.address
    }
    
    return result
}

async function requestToKucoin(uri, data, requestParams) {
    const host = 'https://api.kucoin.com'
    const headers = {
        'KC-API-KEY': data.apiKey,
        'KC-API-NONCE': new Date().getTime()
    }
    const strForSign = crypto.encode('base64', uri + '/' + headers['KC-API-NONCE'] + '/' + querystring.stringify(requestParams))
    headers['KC-API-SIGNATURE'] = crypto.hmac('sha256', data.secretKey, strForSign)
    const response = await http.request(host + uri, 'GET', headers, requestParams)

    return response
}


exports.getbalances = getbalances
exports.getaddress = getaddress