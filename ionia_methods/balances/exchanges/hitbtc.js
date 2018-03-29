const http = require('../../../ionia_modules/http');
const crypto = require('../../../ionia_modules/crypto');


async function getbalances(data) {
    const url = 'https://api.hitbtc.com/api/2/account/balance';

    const auth = {
        username: data.hitbtc.apiKey,
        password: data.hitbtc.secretKey
    }

    const response = await http.request(url, 'GET', {}, {}, auth);

    return makeResult(response);
}

function makeResult(tokens) {
    const result = {};
    const hitbtcObject = result['hitbtc'] = {};

    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        hitbtcObject[token.currency] = {
            available: parseFloat(token.available),
            balance: parseFloat(token.available),
            pending: 0,
            address: null
        }
    }

    return result;
}

exports.getbalances = getbalances;