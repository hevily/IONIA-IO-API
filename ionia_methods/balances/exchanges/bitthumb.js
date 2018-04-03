const http = require('../../../ionia_modules/http')
const crypto = require('../../../ionia_modules/crypto')
const querystring = require('querystring')

const url = 'https://api.bithumb.com'

async function getbalances(data) {
    // header: Api-Key, Api-Sign, Api-Nonce
    // Api-Sign = base64(sha512(key(secretKey), data(uri + null + senddata + null + nonce)))
    const uri = '/info/balance'
    const nonce = new Date().getTime()
    const requestBody = {
        currency: 'ALL'
    }

    const headers = {
        'Api-Key': data.bitthumb.apiKey,
        'Api-Sign': crypto.encode('base64', crypto.hmac('sha512', data.bitthumb.secretKey, `${uri}\0${querystring.stringify(requestBody)}\0${nonce}`)),
        'Api-Nonce': nonce
    }

    const balances = await http.request(url + uri, 'POST', headers, requestBody)

    return balances.status === '0000' ? makeResult(balances.data) : {}
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