const http = require('../../ionia_modules/http');
const host = 'https://shapeshift.io'

async function getexchangeablecoins(params) {
    const uri = '/getcoins';

    const response = await http.request(host + uri, 'GET');

    for(const coinName in response) {
        const coin = response[coinName];

        if(coin.status === 'unavailable') {
            delete response[coinName];
        }
        else {
            delete coin.image;
            delete coin.imageSmall;
            delete coin.status;
        }
    }
    return response;
}

exports.getexchangeablecoins = getexchangeablecoins;