const http = require('../../../ionia_modules/http')
const crypto = require('../../../ionia_modules/crypto')

async function getbalances(data) {
    const nonce = new Date().getTime()
    const url = `https://bittrex.com/api/v1.1/account/getbalances?apikey=${data.bittrex.apiKey}&nonce=${nonce}`
    const headers = {
        apisign: crypto.hmac('sha512', data.bittrex.secretKey, url)
    }

    const response = await http.request(url, 'GET', headers)

    return response.success === true ? makeResult(response.result) : {}
}

function makeResult(bittrexResult) {
    const result = {}
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

    return result
}

exports.getbalances = getbalances