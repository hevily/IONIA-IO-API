const request = require('request');
const sha512 = require('sha512');

function viewBalance(request, response) {
    requestToBittrex = makeRequestBody(request);
    responseBody = getResponse(requestToBittrex);
}

function makeRequest(request) {
    const hasher = sha512.hmac(secretKey);
    const nonce = new Date().getTime();
    const uri = 'https://bittrex.com/api/v1.1/account/getbalances?apikey=' + apiKey + '&nonce=' + nonce;

    return {}
}

function getResponse(requestBody) {
    // TODO: timestamp -> millisecond
    // 실패 시 두 번 정도는 재요청 돼야 함
    const hasher = sha512.hmac(secretKey);
    const nonce = new Date().getTime();
    const uri = 'https://bittrex.com/api/v1.1/account/getbalances?apikey=' + apiKey + '&nonce=' + nonce;
    
    const options = {
        'uri': uri,
        'method': 'GET',
        'qs': {
            apikey: apiKey,
            nonce: nonce
        },
        'headers': {
            'apisign': hasher.finalize(uri).toString('hex')
        }
    };

    let response = request.post(options, function(error, response, html) {

    });
}