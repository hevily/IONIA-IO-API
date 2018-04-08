const http = require('../../common/modules/http')


async function getExchangeRate(params) {
    const url = 'https://blockchain.info/ticker'
    const response = await http.request(url)
    
    return response
}

exports.getExchangeRate = getExchangeRate