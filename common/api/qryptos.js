const http = require('../modules/http')
const crypto = require('../modules/crypto')


async function getbalances(data) {
    const host = 'https://api.quoine.com'
    const path = '/crypto_accounts'
    
    const payload = {
        path: path,
        nonce: new Date().getTime(),
        token_id: data.qryptos.apiKey
    };
    
    const headers = {
        'X-Quoine-API-Version': '2',
        'X-Quoine-Auth': crypto.hmac('hs256', data.qryptos.secretKey, payload),
        'Content-Type': 'application/json'
    }

    const response = await http.request(host + path, 'GET', headers)

    return response.length > 0 ? makeResult(response) : {};
}

function makeResult(tokens) {
    const result = {};
    const qryptosObject = result['qryptos'] = {};

    for(let i = 0; i < tokens.length; i++) {
        const currencyObject = tokens[i];

        qryptosObject[currencyObject.currency.toLowerCase()] = {
            address: currencyObject.address,
            balance: parseFloat(currencyObject.balance),
            available: parseFloat(currencyObject.balance),
            pending: 0
        };
    }

    return result;
}

exports.getbalances = getbalances;