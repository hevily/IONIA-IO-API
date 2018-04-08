const http = require('../modules/http')
const crypto = require('../modules/crypto')
const querystring = require('querystring');


async function getbalances(data) {
    const url = `https://api.huobi.pro/v1/account/accounts/${data.userId}/balance`
    const requestBody = {
        'AccessKeyId': data.apiKey,
        'SignatureMethod': 'HmacSHA256',
        'SignatureVersion': 2,
        'Timestamp': getUTCTimestampFromNow(),
        'account-id': data.userId,
    };

    const pars = [];
    for (let item in requestBody) {
        pars.push(item + "=" + requestBody[item]);
    }

    const headers = {
        'Content-type': 'application/json;charset=utf-8'
    }

    var p = pars.sort().join("&");
    var meta = ['GET', 'api.huobi.pro', `/v1/account/accounts/${data.userId}/balance`, p].join('\n');
    
    var hash = crypto.hmac('sha256', data.secretKey, meta);
    requestBody['Signature'] = crypto.encode('base64', hash);

    const response = await http.request(url + '?' + querystring.stringify(requestBody), 'GET', headers);
    console.log(url + '?' + querystring.stringify(requestBody));
    console.log(response);
    return makeResult(response);
}

function getUTCTimestampFromNow() {
    const now = new Date();

    let timestamp = now.getUTCFullYear().toString();
    timestamp += '-'
    timestamp += now.getUTCMonth() < 10 ? '0' + now.getUTCMonth() : now.getUTCMonth();
    timestamp += '-'
    timestamp += now.getUTCDate() < 10 ? '0' + now.getUTCDate() : now.getUTCDate();
    timestamp += 'T';
    timestamp += now.getUTCHours() < 10 ? '0' + now.getUTCHours() : now.getUTCHours();
    timestamp += '-'
    timestamp += now.getUTCMinutes() < 10 ? '0' + now.getUTCMinutes() : now.getUTCMinutes();
    timestamp += '-'
    timestamp += now.getUTCSeconds() < 10 ? '0' + now.getUTCSeconds() : now.getUTCSeconds();

    return timestamp;
}

function makeResult() {
    
}

exports.getbalances = getbalances;