const http = require('../modules/http')
const crypto = require('../modules/crypto')


async function getbalances(data) {
    const uri = '/api/v1/userinfo.do'

    const requestBody = {
        api_key: data.apiKey
    }
    requestBody.sign = crypto.hash('md5', `api_key=${requestBody.api_key}&secret_key=${data.secretKey}`).toUpperCase()

    const response = await requestToOkex(uri, data, requestBody)

    const result = {}

    if(response.result === true) {
        const okexObject = result['okex'] = {}

        const availableCoins = funds.free

        for(const coinName in availableCoins) {
            okexObject[coinName] = {
                available: parseFloat(availableCoins[coinName]),
                balance: parseFloat(availableCoins[coinName]),
                pending: 0
            }
        }
    }

    return result
}

async function requestToOkex(uri, data, requestBody) {
    const host = 'https://www.okex.com'
    const headers = {
        'Content-type' : 'application/x-www-form-urlencoded',
    }

    const response = await http.request(host + uri, 'POST', headers, requestBody)

    return response
}


exports.getbalances = getbalances