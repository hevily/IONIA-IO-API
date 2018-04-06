const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')

const url = 'https://api.coinone.co.kr/v2/account/balance/'


async function getbalances(data) {
    const requestBody = {
        access_token: data.coinone.apiKey,
        nonce: new Date().getTime()
    }

    const payload = crypto.encode('base64', JSON.stringify(requestBody))

    const headers = {
        'Content-type': 'application-json',
        'X-COINONE-PAYLOAD': payload,
        'X-COINONE-SIGNATURE': crypto.hmac('sha512', data.coinone.secretKey.toUpperCase(), payload)
    }

    const response = await http.request(url, 'POST', headers, payload)

    return response.result === 'success' ? makeResponse(response) : {}
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