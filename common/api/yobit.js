const http = require('../modules/http')
const crypto = require('../modules/crypto')


async function getbalances(data) {
    const uri = '/tapi'
    const requestBody = {
        method: 'getInfo',
        nonce: Math.floor(Date.now() / 1000)
    }

    const balances = await requestToYobit(uri, data, requestBody)

    return response.success === 1 ? makeBalancesResult(response.return) : {}
}

async function getaddress(data) {
    const uri = '/tapi'
    const requestBody = {
        coinName: data.currency,
        method: 'GetDepositAddress',
        nonce: Math.floor(Date.now() / 1000)
    }

    const addresses = await requestToYobit(uri, data, requestBody)
    
    const result = {}
    
    if(addresses.success) {
        result['yobit'] = {}
        result.yobit[data.currency] = addresses.return.address
    }

    return result
}

async function requestToYobit(uri, data, requestBody) {
    const host = 'https://yobit.net'
    const headers = {
        Key: data.yobit.apiKey,
        Sign: crypto.hmac('sha512', data.yobit.secretKey, requestBody)
    }

    const response = await http.request(host + uri, 'POST', headers, requestBody)

    return response
}

function makeBalancesResult(data) {
    const result = {}
    const yobitObject = result['yobit'] = {}

    const funds = data.funds

    for(const token in funds) {
        yobitObject[token] = {
            available: funds[token],
            balance: funds[token],
            pending: 0
        }
    }

    const balances = data.funds_incl_orders

    for(const token in balances) {
        if(yobitObject[token] === undefined) {
            yobitObject[token] = {
                available: balances[token],
                balance: balances[token],
                pending: 0
            }
        }
        else {
            yobitObject[token].balance = balances[token]
            yobitObject[token].pending = balances[token] - yobitObject[token].available
        }
    }

    return result
}

exports.getbalances = getbalances
exports.getaddress = getaddress