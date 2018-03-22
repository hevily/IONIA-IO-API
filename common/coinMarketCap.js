const request = require('request');

function getTicker(callback) {
    request.get('https://api.coinmarketcap.com/v1/ticker/', function(error, response, body) {
        callback(JSON.parse(body));
    });
}

exports.getTicker = getTicker;