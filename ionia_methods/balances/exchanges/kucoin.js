const http = require('../../../ionia_modules/http');
const crypto = require('../../../ionia_modules/crypto');
const querystring = require('querystring');


async function getbalances(data) {
    const host = 'https://api.kucoin.com';
    const uri = '/v1/account/balance';
    
    const requestParams = {
        // max
        limit: 20,
        page: 1
    };
    const headers = {
        'KC-API-KEY': data.kucoin.apiKey,
        'KC-API-NONCE': new Date().getTime()
    }

    const strForSign = crypto.base64.encode(uri + '/' + headers['KC-API-NONCE'] + '/' + querystring.stringify(requestParams));

    headers['KC-API-SIGNATURE'] = crypto.sha256_hmac(data.kucoin.secretKey, strForSign)

    const response = await http.request(host + uri + '?' + querystring.stringify(requestParams), 'GET', headers);
    console.log(response);

    return response.success === true ? makeResult(response.data) : {};
}

function makeResult(data) { 
    const result = {};
    const kucoinObject = result['kucoin'] = {};

    for(let i = 0; i < data.length; i++) {
        const coin = data[i];

        kucoinObject[coin.coinType.toLowerCase()] = {
            available: coin.balance,
            balance: coin.balance,
            pending: 0,
            address: 0
        }
    }

    return result;
}

exports.getbalances = getbalances;