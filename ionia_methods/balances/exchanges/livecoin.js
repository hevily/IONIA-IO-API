const http = require('../../../ionia_modules/http')
const crypto = require('../../../ionia_modules/crypto')

const url = 'https://api.livecoin.net/payment/balances'

async function getbalances(data) {
    
    const headers = {
        'Api-Key': data.livecoin.apiKey,
        'Sign': crypto.hmac('sha256', data.livecoin.secretKey, {}).toUpperCase()
    }

    const response = await http.request(url, 'GET', headers)

    return makeResult(response)
}

function makeResult(response) {
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