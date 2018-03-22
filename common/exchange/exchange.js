bittrex = require('./bittrex.js');

function exchangeHandler(request, response) {
    exchange = request.body.exchange;

    switch(exchange) {
        case "bittrex":
            return bittrex.viewBalance(request, response);
        // case "bitthumb":
            // return bitthumb.viewBalance(request, response);
        default:
            throw exchange + " is not found!";
    }
}

exports.exchangeHandler = exchangeHandler;