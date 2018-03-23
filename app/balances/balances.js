const exchanges = require('./exchanges');

async function getBalances(ctx, next) {
    const request = ctx.request.query;

    // TODO: 계정으로 DB에서 거래소 정보(apikey, secretkey ...) 조회
    const testData = {
        bittrex: {
            apiKey: '4f4f65118cb14a7e9efa8cc421ca5196',
            secretKey: 'b8c3460146fe415787460cd6174c7288'
        }
    };

    const exchangeFunctions = [];

    for(const exchange in exchanges) {
        exchangeFunctions.push(exchanges[exchange].getBalances(testData));
    }
    
    const exchangeResults = await Promise.all(exchangeFunctions);
    ctx.body = makeResponse(exchangeResults);
}

function makeResponse(exchangeResults) {
    const response = {};

    for(let i = 0; i < exchangeResults.length; i++) {
        const exchangeName = Object.keys(exchangeResults[i])[0];
        const exchange = exchangeResults[i][exchangeName];

        for(const tokenName in exchange) {
            if(response.tokenName === undefined) {
                response[tokenName] = {}
            }
            
            response[tokenName][exchangeName] = exchange[tokenName];
        }
    }

    return response;
}

exports.getBalances = getBalances;