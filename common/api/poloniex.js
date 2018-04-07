const http = require('../modules/http')
const crypto = require('../modules/crypto')

const url = 'https://poloniex.com/tradingApi'

async function getbalances(data) {
    const balances = await requestToPoloniex(data, 'returnBalances')
    
    const result = {}

    if(balances.error === undefined) {
        const poloniexObject = result['poloniex'] = {}
        
        for(const tokenName in balances) {
            poloniexObject[tokenName.toLowerCase()] = {
                available: parseFloat(balances[tokenName]),
                balance: parseFloat(balances[tokenName]),
                pending: 0,
                address: depositAddresses[tokenName] === undefined ? null : depositAddresses[tokenName]
            }
        }
    }

    return result
}

async function getaddress(data) {
    const addresses = await requestToPoloniex(data, 'returnDepositAddresses')

    const result = {}

    if(addresses.error === undefined) {
        const poloniexObject = result['poloniex'] = {}
        poloniexObject[data.currency] = addresses[data.currency]
    }

    return result
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

exports.getbalances = getbalances
exports.getaddress = getaddress