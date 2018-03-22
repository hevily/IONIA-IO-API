const request = require('request');

function getTicker(callback) {
    request.get('https://blockchain.info/ticker', function(error, response, body) {
        callback(JSON.parse(body));
    });
}

exports.getTicker = getTicker;