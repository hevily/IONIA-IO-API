const axios = require('axios')
const querystring = require('querystring')

async function request(url, method='GET', headers={}, dataOrParams={}, auth={}) {
    headers['Connection'] = 'keep-alive'

    const requestOptions = {
        method: method,
        url: url,
        headers: headers
    }

    if(auth.username !== undefined) {
        requestOptions['auth'] = auth
    }

    if(method === 'GET') {
        requestOptions['params'] = dataOrParams
    }
    else if(method === 'POST') {
        requestOptions['data'] = querystring.stringify(dataOrParams)
    }
    else {
        throw 'HTTP Method ' + method + ' is Not found!'
    }

    let response = {}

    try {
        response = await axios(requestOptions)
        response = response.data
    } catch(error) {
        if(error.response !== undefined && error.response['data'] !== undefined) {
            response = error.response.data
        }

        console.log(response)
    }

    return response
}

exports.request = request