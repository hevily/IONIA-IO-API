const exchanges = require('../../common/api')


async function getaddresses(params) {
    // TODO: 계정으로 DB에서 거래소 정보(apikey, secretkey ...) 조회
    const testData = {
        bittrex: {
            apiKey: '',
            secretKey: ''
        },
        poloniex: {
            apiKey: '',
            secretKey: ''
        },
        livecoin: {
            apiKey: '',
            secretKey: ''
        },
        bitthumb: {
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
        huobi: {
            userId: '',
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
        bitmex: {
            apiKey: '',
            secretKey: ''
        },
        okex: {
            apiKey: '',
            secretKey: ''
        },
        qryptos :{
            apiKey: '',
            secretKey: ''
        }
    }

    testData.currency = params.currency
    
    const exchangeFunctions = []
    
    for(const exchange in exchanges) {
        exchangeFunctions.push(exchanges[exchange].getaddresses(testData))
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