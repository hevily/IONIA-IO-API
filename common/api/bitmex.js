const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring');


async function getbalances(data) {
    const httpMethod = 'GET';
    const path = '/api/v1/user/walletSummary';
    const expires = new Date().getTime() + (60 * 1000);
    const reqData = {currency: 'btc'};
    const postBody = JSON.stringify(reqData);

    const headers = {
        'content-type' : 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'api-expires': expires,
        'api-key': data.bitmex.apiKey,
        'api-signature': crypto.hmac('sha256', data.bitmex.secretKey, `${httpMethod}${path}?${querystring.stringify(reqData)}${expires}`)
    };
    console.log(`${httpMethod}${path}${querystring.stringify(reqData)}${expires}`)

    const url = `https://www.bitmex.com/api/v1/user/walletSummary?${querystring.stringify(reqData)}`;

    console.log(url);

    const response = await http.request(url, httpMethod, headers);
    console.log(response);
    return {};

    return response.error === undefined ? makeResult(response.result[0].result.assets_list) : {};
}

// async function getbalances(testData) {
//     var verb = 'POST',
//         path = '/api/v1/order',
//         nonce = new Date().getTime() + (60 * 1000), // 1 min in the future
//         data = {symbol:"XBTUSD",orderQty:1,price:590,ordType:"Limit"};

//     var postBody = JSON.stringify(data);

//     var signature = crypto.hmac('sha256', testData.bitmex.secretKey, `${verb}${path}${nonce}${postBody}`);
//     console.log(`${verb}${path}${nonce}${postBody}`);
//     var headers = {
//         'content-type' : 'application/json',
//         'Accept': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest',
//         'api-expires': nonce,
//         'api-key': testData.bitmex.apiKey,
//         'api-signature': signature
//     };
//     console.log(headers);
//     const url = `https://www.bitmex.com${path}`;
//     const response = await http.request(url, verb, headers, postBody);
//     console.log(url);
//     console.log(response);
//     return {};
// }

function makeResult(assetsList) {
    const result = {};
    const bitmexObject = result['bitmex'] = {};

    for(let i = 0; i < assetsList.length; i++) {
        const coin = assetsList[i];

        biboxObject[coin.coin_symbol.toLowerCase()] = {
            available: coin.balance,
            balance: coin.balance,
            pending: 0,
            address: null
        }
    }

    return result;
}

exports.getbalances = getbalances;