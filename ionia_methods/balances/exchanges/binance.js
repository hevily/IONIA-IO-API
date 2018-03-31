const http = require('../../../ionia_modules/http');
const crypto = require('../../../ionia_modules/crypto');

async function getbalances(data) {
    const requestBody = {
        timestamp: new Date().getTime()
    }

    const signature = crypto.hmac('sha256', data.binance.secretKey, requestBody);

    const url = `https://api.binance.com/api/v3/account?timestamp=${requestBody.timestamp}&signature=${signature}`;

    const headers = {
        'X-MBX-APIKEY': data.binance.apiKey
    };

    const response = await http.request(url, 'GET', headers);

    return makeResult(response.balances);
}

function makeResult(balances) {
    const result = {};
    const binanceObject = result['binance'] = {};

    for(let i = 0; i < balances.length; i++) {
        const balanceInformation = balances[i];
    
        binanceObject[balanceInformation.asset] = {
            available: parseFloat(balanceInformation.asset),
            pending: parseFloat(balanceInformation.free),
            balance: parseFloat(balanceInformation.asset) + parseFloat(balanceInformation.free),
            address: null
        }
    }

    return result;
}

exports.getbalances = getbalances;