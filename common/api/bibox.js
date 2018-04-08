const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')


async function getbalances(data) {
    const uri = '/v1/transfer'
    const cmds = [{
        cmd: "transfer/assets",
        body: {
            select: 1
        }
    }]
    const requestBody = {
        cmds: JSON.stringify(cmds),
        apikey: data.apiKey,
        sign: crypto.hmac('md5', data.secretKey, JSON.stringify(cmds))
    }

    const balances = await requestToBibox(uri, data, requestBody)

    const result = {}

    if(balances.error === undefined) {
        const assetsList = balances.result[0].result.assets_list
        const biboxObject = result['bibox'] = {}

        for(let i = 0 ;  i < assetsList.length ; i++) {
            const coin = assetsList[i]

            biboxObject[coin.coin_symbol.toLowerCase()] = {
                available: coin.balance,
                balance: coin.balance,
                pending: 0
            }
        }
    }

    return result
}

async function getaddress(data) {
    const uri = '/v1/transfer'
    const cmds = [{
        cmd: "transfer/transferIn",
        body: {
            coin_symbol: data.currency
        }
    }]
    const requestBody = {
        cmds: JSON.stringify(cmds),
        apikey: data.apiKey,
        sign: crypto.hmac('md5', data.secretKey, JSON.stringify(cmds))
    }

    const addresses = await requestToBibox(uri, data, requestBody)

    const result = {}

    if(addresses.error === undefined) {
        result['bibox'] = {}
        result.bibox[data.currency] = addresses.result[0].result
    }

    return result
}

async function requestToBibox(uri, data, requestBody) {
    const host = 'https://api.bibox.com'

    const response = await http.request(host + uri, 'POST', {}, requestBody)

    return response
}


exports.getbalances = getbalances
exports.getaddress = getaddress