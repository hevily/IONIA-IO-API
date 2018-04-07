const http = require('../modules/http')
const crypto = require('../modules/crypto')


async function getbalances(data) {
    const uri = '/v1/balances'
    const requestBody = {
        request: serviceUri,
        nonce: Date.now().toString()
    }

    const balances = await requestToBitfinex(uri, data, requestBody)

    const result = {}

    if(response.message === undefined) {
        const bitfinexObject = result['bitfinex'] = {}

        for(let i = 0; i < tokens.length; i++) {
            const token = tokens[i]

            if(token.type === 'deposit' && token.name !== 'usd') {
                bitfinexObject[token.currency] = {
                    available: parseFloat(token.available),
                    balance: parseFloat(token.amount),
                    pending: 0
                }
            }
        }
    }

    return result
}

async function getaddress(data) {
    const uri = '/v1/deposit/new'
    const requestBody = {
        request: uri,
        nonce: Date.now().toString(),
        method: changeSymbolToMethod(data.currency),
        wallet_name: 'deposit'
    }

    const addresses = await requestToBitfinex(uri, data, requestBody)
    
    const result = {}

    if(addresses.result === 'success') {
        result['bitfinex'] = {}
        result.bitfinex[data.currency] = addresses.address
    }

    return result
}

async function requestToBitfinex(uri, data, requestBody) {
    const host = 'https://api.bitfinex.com'

    const payload = crypto.encode('base64', JSON.stringify(requestBody))
    const signature = crypto.hmac('sha384', data.bitfinex.secretKey, payload)

    const headers = {
        'X-BFX-APIKEY': data.bitfinex.apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature
    }

    const response = await http.request(host + uri, 'POST', headers, requestBody)

    return response
}

function changeSymbolToMethod(currency) {
    return {
        BTC: 'bitcoin',
        LTC: 'litecoin',
        ETH: 'ethereum',
        ETC: 'ethereumc',
        ZEC: 'zcash',
        XMR: 'monero',
        IOTA: 'iota',
        BCH: 'bcash'
        // tetheruso - ?
    }[currency]
}

exports.getbalances = getbalances
exports.getaddress = getaddress