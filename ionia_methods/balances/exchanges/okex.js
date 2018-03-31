const http = require('../../../ionia_modules/http');
const crypto = require('../../../ionia_modules/crypto');


async function getbalances(data) {
    const url = 'https://www.okex.com/api/v1/userinfo.do';

    const requestBody = {
        api_key: data.okex.apiKey
    };

    const headers = {
        'Content-type' : 'application/x-www-form-urlencoded',
    };

    requestBody.sign = crypto.hash('md5', `api_key=${requestBody.api_key}&secret_key=${data.okex.secretKey}`).toUpperCase();

    const response = await http.request(url, 'POST', headers, requestBody);

    return response.result === true ? makeResult(response.info.funds) : {};
}

function makeResult(funds) {
    const result = {};
    const okexObject = result['okex'] = {};

    const availableCoins = funds.free;

    for(const coinName in availableCoins) {
        okexObject[coinName] = {
            available: parseFloat(availableCoins[coinName]),
            balance: parseFloat(availableCoins[coinName]),
            address: null,
            pending: 0
        };
    }

    return result;
}

exports.getbalances = getbalances;