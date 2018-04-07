const apis = require('../../common/api')


async function getaddresses(params) {
    // TODO: 계정으로 DB에서 거래소 정보(apikey, secretkey ...) 조회
    const testData = {
        bittrex: {
            apiKey: '',
            secretKey: ''
        },
        bitthumb: {
            apiKey: '',
            secretKey: ''
        },
        livecoin: {
            apiKey: '',
            secretKey: ''
        },
        poloniex: {
            apiKey: '',
            secretKey: ''
        },
        coinone: {
            apiKey: '',
            secretKey: ''
        },
        binance: {
            apiKey: '',
            secretKey: ''
        },
        bitfinex: {
            apiKey: '',
            secretKey: ''
        },
        kucoin: {
            apiKey: '',
            secretKey: ''
        },
        yobit: {
            apiKey: '',
            secretKey: ''
        },
        hitbtc: {
            apiKey: '',
            secretKey: ''
        },
        bibox: {
            apiKey: '',
            secretKey: ''
        },
        qryptos :{
            apiKey: '',
            secretKey: ''
        }
    }

    testData.currency = params.currency

    const apisExchangeName = []

    for(const exchange in apis) {
        apisExchangeName.push(exchange)
    }
    
    const exchangeNames = params.exchanges !== undefined && params.exchanges.length > 0 ? params.exchanges : apisExchangeName
    const exchangeFunctions = []

    for(const exchangeName of exchangeNames) {
        if(apis[exchangeName].getaddress !== undefined) {
            exchangeFunctions.push(apis[exchaexchangeNamenge].getaddress(testData))
        }
    }
    
    const exchangeResults = await Promise.all(exchangeFunctions)

    return makeResponse(exchangeResults)
}

function makeResponse(exchangeResults) {
    const response = {}

    for(let i = 0 ; i < exchangeResults.length ; i++) {
        const exchangeName = Object.keys(exchangeResults[i])[0]
        const exchange = exchangeResults[i][exchangeName]

        for(const tokenName in exchange) {
            if(response[tokenName] === undefined) {
                response[tokenName] = {}
            }
            
            response[tokenName][exchangeName] = exchange[tokenName]
        }
    }

    return response
}

exports.getaddresses = getaddresses