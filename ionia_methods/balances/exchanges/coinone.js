const http = require('../../../ionia_modules/http');
const crypto = require('../../../ionia_modules/crypto');
const querystring = require('querystring');

const url = 'https://api.coinone.co.kr/v2/account/balance/';

async function getbalances(data) {
    const requestBody = {
        access_token: data.coinone.apiKey,
        nonce: new Date().getTime()
    };

    const payload = crypto.base64.encode(JSON.stringify(requestBody))

    const headers = {
        'Content-type': 'application-json',
        'X-COINONE-PAYLOAD': payload,
        'X-COINONE-SIGNATURE': crypto.sha512_hmac(data.coinone.secretKey.toUpperCase(), payload)
    }

    const response = await http.request(url, 'POST', headers, payload);

    return response.result === 'success' ? makeResponse(response) : {};
}

function makeResponse(tokens) {
    const result = {};
    const coinoneObject = result['coinone'] = {};

    for(const tokenName in tokens) {
        if(tokenName === 'result') {
            continue;
        }

        coinoneObject[tokenName] = {
            balance: parseFloat(tokens[tokenName].balance),
            available: parseFloat(tokens[tokenName].avail),
            pending: 0,
            address: null
        }
    }

    return result;
}

exports.getbalances = getbalances;