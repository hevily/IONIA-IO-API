const http = require('../../common/module/http');
const crypto = require('../../common/module/crypto');

const url = 'https://poloniex.com/tradingApi';

async function getbalances(data) {
    // nonce 이슈로 병렬처리 불가능
    const balances = await requestToPoloniex(data, 'returnBalances');
    const depositAddresses = await requestToPoloniex(data, 'returnDepositAddresses');

    return balances.error === undefined && depositAddresses.error === undefined ? makeResult(balances, depositAddresses) : {};
}

async function requestToPoloniex(data, method) {
    const requestBody = {
        command: method,
        nonce: new Date().getTime() * 100
    };

    const headers = {
        Key: data.poloniex.apiKey,
        Sign: crypto.sha512_hmac(data.poloniex.secretKey, requestBody).toUpperCase()
    }

    const response = await http.request(url, 'POST', headers, requestBody);
    
    return response;
}

function makeResult(balances, depositAddresses) {
    const result = {};
    const poloniexObject = result['poloniex'] = {};

    for(const tokenName in balances) {
        poloniexObject[tokenName.toLowerCase()] = {
            available: parseFloat(balances[tokenName]),
            balance: parseFloat(balances[tokenName]),
            pending: 0,
            address: depositAddresses[tokenName] === undefined ? null : depositAddresses[tokenName]
        }
    }

    return result;
}

exports.getbalances = getbalances;