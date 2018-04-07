const http = require('../modules/http')


async function getbalances(data) {
    const uri = '/api/2/account/balance'
    const balances = await requestToHitbtc(uri, data, {})

    const result = {}

    if(balances.error === undefined) { 
        const hitbtcObject = result['hitbtc'] = {}

        for(let i = 0; i < tokens.length; i++) {
            const token = tokens[i]

            hitbtcObject[token.currency] = {
                available: parseFloat(token.available),
                balance: parseFloat(token.available),
                pending: 0
            }
        }
    }
    
    return result
}

async function getaddress(data) {
    const uri = `/api/2/account/crypto/address/${data.currency}`
    const addresses = await requestToHitbtc(uri, data, {})

    const result = {}
    
    if(addresses.error === undefined) {
        result['hitbtc'] = {}
        result.hitbtc[data.currency] = addresses.address
    }

    return result
}

async function requestToHitbtc(uri, data, requestBody) {
    const host = 'https://api.hitbtc.com'
    const auth = {
        username: data.hitbtc.apiKey,
        password: data.hitbtc.secretKey
    }

    const response = await http.request(host + uri, 'GET', {}, requestBody, auth)

    return response
}


exports.getbalances = getbalances
exports.getaddress = getaddress