const http = require('../modules/http')
const crypto = require('../modules/crypto')


async function getbalances(data) {
    const uri = '/accounts/balance'

    const balances = await requestToQryptos(uri, data)
    
    const result = {}

    if(balances.length > 0) {
        const qryptosObject = result['qryptos'] = {};

        for(let i = 0; i < balances.length; i++) {
            const currencyObject = balances[i];

            qryptosObject[currencyObject.currency] = {
                balance: parseFloat(currencyObject.balance),
                available: parseFloat(currencyObject.balance),
                pending: 0
            }
        }
    }

    return result
}

async function getaddress(data) {
    const uri = '/crypto_accounts'

    const addresses = await requestToQryptos(uri, data)
    // TODO: test
    for(let i = 0; i < addresses.length; i++) {
        if(addresses[i].currnecy === data.currency) {
            return {
                qryptos: addresses[i].address
            }
        }
    }

    return {}
}

async function requestToQryptos(uri, data) {
    const host = 'https://api.quoine.com'
    const payload = {
        path: uri,
        nonce: new Date().getTime(),
        token_id: data.qryptos.apiKey
    };
    const headers = {
        'X-Quoine-API-Version': '2',
        'X-Quoine-Auth': crypto.hmac('hs256', data.qryptos.secretKey, payload),
        'Content-Type': 'application/json'
    }

    const response = await http.request(host + uri, 'GET', headers)

    return response
}


exports.getbalances = getbalances;
exports.getaddress = getaddress;