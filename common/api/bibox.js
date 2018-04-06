const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring')


async function getbalances(data) {
    const url = 'https://api.bibox.com/v1/transfer'
    const cmds = [{
        cmd: "transfer/assets",
        body: {
            select: 1
        }
    }]
    const requestBody = {
        cmds: JSON.stringify(cmds),
        apikey: data.bibox.apiKey,
        sign: crypto.hmac('md5', data.bibox.secretKey, JSON.stringify(cmds))
    }

    const response = await http.request(url, 'POST', {}, requestBody)

    return response.error === undefined ? makeResult(response.result[0].result.assets_list) : {}
}

function makeResult(assetsList) {
    const result = {}
    const biboxObject = result['bibox'] = {}

    for(let i = 0 ;  i < assetsList.length ; i++) {
        const coin = assetsList[i]

        biboxObject[coin.coin_symbol.toLowerCase()] = {
            available: coin.balance,
            balance: coin.balance,
            pending: 0,
            address: null
        }
    }

    return result
}

exports.getbalances = getbalances