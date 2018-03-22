var bittrex = require('node-bittrex-api');

function getbalances(API_KEY, API_SECRET, callback) {
    bittrex.options({
        'apikey' : API_KEY,
        'apisecret' : API_SECRET,
    });
    
    bittrex.getbalances(function (res, error) {
        var result = {};

        if(!error) {
            var originResult = res.result;
            originResult.forEach(function(item) {
                var currencyCode = item['Currency'];
                var balance = item['Balance'];
                var available = item['Available'];
                var pending = item['Pending'];
                var cryptoAddress = item['CryptoAddress'];

                result[currencyCode.toLowerCase()] = {
                    "bittrex": {
                        "available": available,
                        "balance": balance,
                        "pending": pending,
                        "address" : cryptoAddress,
                    }
                };
            });
        }
        else {
            
        }

        callback(result);
    });
}

exports.getbalances = getbalances;