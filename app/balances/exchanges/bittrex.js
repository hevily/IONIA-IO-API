const http = require('../../common/module/http');
const crypto = require('../../common/module/crypto');

async function getBalances(data) {
    const nonce = new Date().getTime();
    const url = `https://bittrex.com/api/v1.1/account/getbalances?apikey=${data.bittrex.apiKey}&nonce=${nonce}`;
    const headers = {
        apisign: crypto.sha512(data.bittrex.secretKey, url)
    }

    const response = await http.requestHttp(url, 'GET', headers);

    return response.success === true ? makeResult(response.result) : {};
}

function makeResult(bittrexResult) {
    const result = {};
    const bittrexObject = result['bittrex'] = {};

    for(let i = 0; i < bittrexResult.length; i++) {
        const currencyObject = bittrexResult[i];
        const currencyName = currencyObject['Currency'].toLowerCase();

        bittrexObject[currencyName] = {
            available: currencyObject['Available'],
            pending: currencyObject['Pending'],
            balance: currencyObject['Balance'],
            address: currencyObject['CryptoAddress']
        };
    }

    return result;
}

exports.getBalances = getBalances;