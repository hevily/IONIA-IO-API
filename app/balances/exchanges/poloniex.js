const http = require('../../common/module/http');
const crypto = require('../../common/module/crypto');
const url = 'https://poloniex.com/tradingApi';

async function getBalances(data) {
    const requestBody = {
        command: 'returnDepositAddresses',
        nonce: new Date().getTime() * 100
    };

    const headers = {
        Key: data.poloniex.apiKey,
        Sign: crypto.sha512(data.poloniex.secretKey, `command=${requestBody.command}&nonce=${requestBody.nonce}`)
    }

    const response = await http.request(url, 'POST', headers, requestBody);

    return response;
}

exports.getBalances = getBalances;