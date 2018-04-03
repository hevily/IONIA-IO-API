const http = require('../../../ionia_modules/http')
const crypto = require('../../../ionia_modules/crypto')


async function getbalances(data) {
    const url = 'https://yobit.net/tapi'

    const requestBody = {
        method: 'getInfo',
        nonce: Math.floor(Date.now() / 1000)
    }

    const headers = {
        Key: data.yobit.apiKey,
        Sign: crypto.hmac('sha512', data.yobit.secretKey, requestBody)
    }

    const response = await http.request(url, 'POST', headers, requestBody)

    return response.success === 1 ? makeResult(response.return) : {}
}

function makeResult(data) {
    const result = {}
    const yobitObject = result['yobit'] = {}

    const funds = data.funds

    for(const token in funds) {
        yobitObject[token] = {
            available: funds[token],
            balance: funds[token],
            address: null,
            pending: 0
        }
    }

    const balances = data.funds_incl_orders

    for(const token in balances) {
        if(yobitObject[token] === undefined) {
            yobitObject[token] = {
                available: balances[token],
                balance: balances[token],
                address: null,
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