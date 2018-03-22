const request = require('request');

function getTicker(callback) {
    request.get('https://api.coinmarketcap.com/v1/ticker/', function(res, error) {
        callback(res);
    });
}

exports.getTicker = getTicker;