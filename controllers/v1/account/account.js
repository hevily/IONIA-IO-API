const exchangeApi = require('../../../common/exchange/exchange');
const btcExchangeRate = require('../../../common/btcExchangeRate');
const coinMarketCap = require('../../../common/coinMarketCap');

function getbalances(request, callback) {
    var returnResult = {
        "success": true,
        "message": null,
        'result': {
            'currencies': {},
            "exchangeRate": {}
        }
    };

    var callback2 = function(balances) {
        var callback3 = function(btcRate) {
            returnResult.result.exchangeRate = {
                'btc-usd': btcRate['USD']['last'],
                'btc-krw': btcRate['KRW']['last'],
                'btc-jpy': btcRate['JPY']['last'],
                'btc-cny': btcRate['CNY']['last'],
                'btc-eur': btcRate['EUR']['last'],
                'btc-cad': btcRate['CAD']['last'],
            }

            var callback4 = function(marketData) {
                returnResult.result.currencies = balances;

                marketData.forEach(item => {
                    let currency = item['symbol'].toLowerCase();
                    let btcValue = Number(item['price_btc']);

                    if(returnResult.result.currencies[currency]) {
                        returnResult.result.currencies[currency].btcValue = btcValue;
                    }
                });

                callback(returnResult);
            };

            coinMarketCap.getTicker(callback4);
        };
        btcExchangeRate.getTicker(callback3);
    };

    exchangeApi.getBalanceExchanges(request, callback2);
}


exports.getbalances = getbalances;