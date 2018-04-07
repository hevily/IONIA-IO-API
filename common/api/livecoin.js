const http = require('../modules/http')
const crypto = require('../modules/crypto')


async function getbalances(data) {
    const uri = '/payment/balances'
    const response = await requestToLivecoin(uri, data, {})
    
    const result = {}
    if(response.fault === null) {
        result = makeBalancesResult(response)
    }

    return result
}

async function getaddress(data) {
    const uri = '/payment/get/address'
    const requestBody = {
        currency: data.currency
    }

    const response = await requestToLivecoin(uri, data, requestBody)
    const result = {}

    if(response.fault === null) {
        result['livecoin'] = {}
        result.livecoin[data.currency] = response.wallet
    }

    return result
}

async function requestToLivecoin(uri, data, requestBody) {
    const host = 'https://api.livecoin.net'
    const headers = {
        'Api-Key': data.livecoin.apiKey,
        'Sign': crypto.hmac('sha256', data.livecoin.secretKey, requestBody).toUpperCase()
    }

    const response = await http.request(host + uri, 'GET', headers, requestBody)
    
    return response
}

function makeBalancesResult(response) {
    const result = {}
    const livecoinObject = result['livecoin'] = {}

    for(let i = 0 ; i < response.length ; i++) {
        const currencyObject = response[i]
        const currencyName = currencyObject.currency.toLowerCase()
        
        if(['usd', 'rur', 'eur'].indexOf(currencyName) > -1) {
            continue
        }

        if(livecoinObject[currencyName] === undefined) {
            livecoinObject[currencyName] = {}
            livecoinObject[currencyName].address = null
        }

        if(currencyObject.type === 'total') {
            livecoinObject[currencyName]['balance'] = currencyObject.value
        }
        else if(currencyObject.type === 'available') {
            livecoinObject[currencyName]['available'] = currencyObject.value
        }
        else if(currencyObject.type === 'trade') {
            livecoinObject[currencyName]['pending'] = currencyObject.value
        }
    }

    return result
}

function sortObjectByKey(requestBody) {
    const keys = []

    for(const key in requestBody) {
        keys.push(key)
    }

    keys.sort()

    const sortedObject = {}

    for(const key in keys) {
        sortedObject[key] = requestBody[key]
    }

    return sortedObject
}

exports.getbalances = getbalances
exports.getaddress = getaddress