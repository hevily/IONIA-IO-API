const axios = require('axios');
const querystring = require('querystring');

async function requestHttp(url, method='GET', headers={}, dataOrParams={}) {
    headers['Connection'] = 'keep-alive';
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Accept'] = '*/*';

    const requestOptions = {
        method: method,
        url: url,
        headers: headers,
    }

    if(method === 'GET') {
        requestOptions['params'] = querystring.stringify(dataOrParams);
    }
    else if(method === 'POST') {
        requestOptions['data'] = querystring.stringify(dataOrParams);
    }
    else {
        throw 'HTTP Method ' + method + ' is Not found!';
    }

    let response;

    try {
        response = await axios(requestOptions);
        response = response.data;
    } catch(error) {
        console.log(error);
    }

    return response;
}

exports.requestHttp = requestHttp;