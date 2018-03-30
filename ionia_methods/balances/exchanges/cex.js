const http = require('../../../ionia_modules/http');
const crypto = require('../../../ionia_modules/crypto');

async function getbalances(data) {
    const url = 'https://cex.io/api/balance/';
    const nonce = new Date().getTime();

    const requestBody = {
        key: data.cex.apiKey,
        signature: crypto.sha256_hmac(data.cex.secretKey, `${nonce}${data.cex.id}${data.cex.apiKey}`).toUpperCase(),
        nonce: nonce
    }

    const response = await http.request(url, 'POST', {}, requestBody);
    
    return response.error === undefined ? makeResult(response) : {};
}

function makeResult(response) {
    const result = {};
    const cexObject = result['cex'] = {};

    delete response['timestamp'];
    delete response['username'];

    for(const coinName in response) {
        cexObject[coinName.toLowerCase()] = {
            available: parseFloat(response[coinName].available),
            balance: parseFloat(response[coinName].available),
            pending: 0,
            address: null
        }
    }

    return result;
}

exports.getbalances = getbalances;