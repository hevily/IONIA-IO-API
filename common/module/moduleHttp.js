const axios = require('axios');

async function requestHttp(url, method='GET', headers={}, params={}) {
    const options = {
        params: params,
        headers: headers
    }

    const response = {};

    if(method === 'GET') {
        response = await axios.get(url, options);
    }
    else if(method == 'POST') {
        response = await axios.post(url, options);
    }
    else {
        throw method + ' is Not found!';
    }

    return response.data;
}

exports.requestHttp = requestHttp;