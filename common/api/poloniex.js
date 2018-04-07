const http = require('../modules/http')
const crypto = require('../modules/crypto')

const url = 'https://poloniex.com/tradingApi'

async function getbalances(data) {
    // nonce 이슈로 병렬처리 불가능
    const balances = await requestToPoloniex(data, 'returnBalances')

    return balances.error === undefined ? makeResult(balances) : {}
}

async function requestToPoloniex(data, method) {
    const requestBody = {
        command: method,
        nonce: new Date().getTime() * 100
    }

    const headers = {
        Key: data.poloniex.apiKey,
        Sign: crypto.hmac('sha512', data.poloniex.secretKey, requestBody).toUpperCase()
    }

    const response = await http.request(url, 'POST', headers, requestBody)
    
    return response
}

function makeResult(balances) {
    const result = {}
    const poloniexObject = result['poloniex'] = {}

    for(const tokenName in balances) {
        poloniexObject[tokenName.toLowerCase()] = {
            available: parseFloat(balances[tokenName]),
            balance: parseFloat(balances[tokenName]),
            pending: 0
        }
    }

    return result
}

exports.getbalances = getbalances