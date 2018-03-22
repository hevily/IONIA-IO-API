const request = require('request');

function getTicker(callback) {
    request.get('https://blockchain.info/ticker', function(res, error) {
        callback(res);
    });
}

exports.getTicker = getTicker;