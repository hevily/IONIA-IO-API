const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')

const url = 'https://api.bithumb.com'

async function getbalances(data) {
    const uri = '/info/balance'
    const requestBody = {
        currency: 'ALL'
    }

    const balances = await requestToBitthumb(uri, data, requestBody)

    return balances.status === '0000' ? makeResult(balances.data) : {}
}

async function getaddress(data) {
    const uri = '/info/wallet_address'
    const requestBody = {
        currency: data.currency
    }

    const address = await requestToBitthumb(uri, data, requestBody)

    const result = {}

    if(address.status === '0000') {
        result['bitthumb'] = {}
        result.bitthumb[data.currency] = address.data.wallet_address
    }

    return result
}

async function requestToBitthumb(uri, data, requestBody) {
    const host = 'https://api.bithumb.com'
    const nonce = new Date().getTime()
    const headers = {
        'Api-Key': data.bitthumb.apiKey,
        'Api-Sign': crypto.encode('base64', crypto.hmac('sha512', data.bitthumb.secretKey, `${uri}\0${querystring.stringify(requestBody)}\0${nonce}`)),
        'Api-Nonce': nonce
    }

    const response = await http.request(host + uri, 'POST', headers, requestBody)

    return response
}

function makeResult(balancesData) {
    //available: currencyObject['Available'],
    //pending: currencyObject['Pending'],
    //balance: currencyObject['Balance'],
    //address: currencyObject['CryptoAddress']
    const result = {}
    const bitthumbObject = result.bitthumb = {}

    for(const key in balancesData) {
        if(key.indexOf('krw') > -1) {
            continue
        }

        const tokens = key.split('_')
        const tokenName = tokens[tokens.length - 1]

        if(bitthumbObject[tokenName] === undefined) {
            bitthumbObject[tokenName] = {'address': null}
        }

        if(key.indexOf('total') > -1) {
            bitthumbObject[tokenName]['balance'] = parseFloat(balancesData[key])
        }
        else if(key.indexOf('available') > -1) {
            bitthumbObject[tokenName]['available'] = parseFloat(balancesData[key])
        }
        else if(key.indexOf('in_use') > -1) {
            bitthumbObject[tokenName]['pending'] = parseFloat(balancesData[key])
        }
    }

    return result
}

exports.getbalances = getbalances
exports.getaddress = getaddress