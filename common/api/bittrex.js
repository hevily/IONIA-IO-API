const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')


async function getbalances(data) {
    const requestBody = {
        apikey: data.bittrex.apiKey,
        nonce: new Date().getTime()
    }
    const uri = '/api/v1.1/account/getbalances'

    const response = await requestToBittrex(uri, data, requestBody)

    const result = {}

    if(response.success === true) {
        const bittrexObject = result['bittrex'] = {}
        
        for(let i = 0; i < bittrexResult.length; i++) {
            const currencyObject = bittrexResult[i]
            const currencyName = currencyObject['Currency'].toLowerCase()
            
            bittrexObject[currencyName] = {
                available: currencyObject['Available'],
                pending: currencyObject['Pending'],
                balance: currencyObject['Balance'],
                address: currencyObject['CryptoAddress']
            }
        }
    }

    return result
}

async function getaddress(data) {
    const requestBody = {
        apikey: data.bittrex.apiKey,
        nonce: new Date().getTime(),
        currency: data.currency
    }
    const uri = '/api/v1.1/account/getbalance'

    const response = await requestToBittrex(uri, data, requestBody)

    const result = {}

    if(response.success === true) {
        result['bittrex'] = {}
        result.bittrex[data.currency] = response.result.CryptoAddress
    }

    return result
}

async function requestToBittrex(uri, data, requestBody) {
    const host = 'https://bittrex.com'
    const headers = {
        apisign: crypto.hmac('sha512', data.bittrex.secretKey, host + uri + '?' + querystring.stringify(requestBody))
    }

    const response = await http.request(host + uri, 'GET', headers, requestBody)

    return response
}


exports.getbalances = getbalances
exports.getaddress = getaddress