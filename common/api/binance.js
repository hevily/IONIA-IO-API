const http = require('../modules/http')
const crypto = require('../modules/crypto')

async function getbalances(data) {
    const uri = '/api/v3/account'
    const requestBody = {
        timestamp: new Date().getTime()
    }
    
    const balances = await requestToBinance(uri, data, requestBody)

    const result = {}

    if(balances.success === false) {
        const binanceObject = result['binance'] = {}

        for(let i = 0 ;i < balances.length; i++) {
            const balanceInformation = balances[i]
    
            binanceObject[balanceInformation.asset] = {
                available: parseFloat(balanceInformation.asset),
                pending: parseFloat(balanceInformation.free),
                balance: parseFloat(balanceInformation.asset) + parseFloat(balanceInformation.free),
                address: null
            }
        }
    }

    return result
}

async function getaddress(data) {
    const uri = '/wapi/v3/depositAddress.html'
    const requestBody = {
        timestamp: new Date().getTime(),
        asset: data.currency
    }

    const addresses = await requestToBinance(uri, data, requestBody)

    const result = {}
    
    if(addresses.success !== false) {
        result['binance'] = {}
        result.binance[data.currency] = addresses.address
    }

    return result
}

async function requestToBinance(uri, data, requestBody) {
    const host = 'https://api.binance.com'
    const headers = {
        'X-MBX-APIKEY': data.binance.apiKey
    }
    
    requestBody.signature = crypto.hmac('sha256', data.binance.secretKey, requestBody)

    const response = await http.request(host + uri, 'GET', headers, requestBody)

    return response
}

exports.getbalances = getbalances
exports.getaddress = getaddress