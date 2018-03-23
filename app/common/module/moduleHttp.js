const axios = require('axios');

async function requestHttp(url, method='GET', headers={}, params={}) {
    const options = {
        params: params,
        headers: headers
    }

    let responseBody = '';

    try {
        if(method === 'GET') {
            response = await axios.get(url, options);
        }
        else if(method === 'POST') {
            response = await axios.post(url, options);
        }
        else {
            throw method + ' is Not found!';
        }

        responseBody = response.data;
    } catch(error) {
        console.log('http error');
    }

    return responseBody;
}

exports.requestHttp = requestHttp;