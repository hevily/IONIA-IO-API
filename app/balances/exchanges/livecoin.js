const http = require('../../common/module/http');
const crypto = require('../../common/module/crypto');

const url = 'https://api.livecoin.net/payment/balances';

async function getBalances(data) {
    
    const headers = {
        'Api-Key': data.livecoin.apiKey,
        'Sign': crypto.sha256_hmac(data.livecoin.secretKey, {}).toUpperCase()
    }

    const response = await http.request(url, 'GET', headers);

    return makeResult(response);
}

function makeResult(response) {
    const result = {};
    const livecoinObject = result['livecoin'] = {};

    for(let i = 0; i < response.length; i++) {
        const currencyObject = response[i];
        const currencyName = currencyObject.currency.toLowerCase();
        
        if(['usd', 'rur', 'eur'].indexOf(currencyName) > -1) {
            continue;
        }

        if(livecoinObject[currencyName] === undefined) {
            livecoinObject[currencyName] = {};
            livecoinObject[currencyName].address = null;
        }

        if(currencyObject.type === 'total') {
            livecoinObject[currencyName]['balance'] = currencyObject.value;
        }
        else if(currencyObject.type === 'available') {
            livecoinObject[currencyName]['available'] = currencyObject.value;
        }
        else if(currencyObject.type === 'trade') {
            livecoinObject[currencyName]['pending'] = currencyObject.value;
        }
    }

    return result;
}

function sortObjectByKey(requestBody) {
    const keys = [];

    for(const key in requestBody) {
        keys.push(key);
    }

    keys.sort();

    const sortedObject = {};

    for(const key in keys) {
        sortedObject[key] = requestBody[key];
    }

    return sortedObject;
}

exports.getBalances = getBalances;