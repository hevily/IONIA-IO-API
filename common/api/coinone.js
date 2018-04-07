const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')

const url = 'https://api.coinone.co.kr/v2/account/balance/'


async function getbalances(data) {
    const uri = '/v2/account/balance/'
    const requestBody = {
        access_token: data.coinone.apiKey,
        nonce: new Date().getTime()
    }

    const balances = await requestToCoinone(uri, data, requestBody)

    const result = {}

    if(balances.result === 'success') {
        const coinoneObject = result['coinone'] = {}

        for(const tokenName in tokens) {
            if(tokenName === 'result') {
                continue
            }

            coinoneObject[tokenName] = {
                balance: parseFloat(tokens[tokenName].balance),
                available: parseFloat(tokens[tokenName].avail),
                pending: 0
            }
        }
    }

    return result
}

async function getaddress(data) {
    const uri = '/v2/account/deposit_address/'
    const requestBody = {
        access_token: data.coinone.apiKey,
        nonce: new Date().getTime()
    }

    const addresses = await requestToCoinone(uri, data, requestBody)

    const result = {}

    if(addresses.result === 'success' && addresses.walletAddress[data.currency.toLowerCase()] !== undefined) {
        result['coinone'] = {}
        result.coinone[data.currency] = addresses.walletAddress[data.currency.toLowerCase()]
    }

    return result
}

async function requestToCoinone(uri, data, requestBody) {
    const host = 'https://api.coinone.co.kr'

    const payload = crypto.encode('base64', JSON.stringify(requestBody))

    const headers = {
        'Content-type': 'application-json',
        'X-COINONE-PAYLOAD': payload,
        'X-COINONE-SIGNATURE': crypto.hmac('sha512', data.coinone.secretKey.toUpperCase(), payload)
    }

    const response = await http.request(host + uri, 'POST', headers, payload)

    return response
}

function makeResponse(tokens) {
    const result = {}
    const coinoneObject = result['coinone'] = {}

    for(const tokenName in tokens) {
        if(tokenName === 'result') {
            continue
        }

        coinoneObject[tokenName] = {
            balance: parseFloat(tokens[tokenName].balance),
            available: parseFloat(tokens[tokenName].avail),
            pending: 0,
            address: null
        }
    }

    return result
}

exports.getbalances = getbalances
exports.getaddress = getaddress