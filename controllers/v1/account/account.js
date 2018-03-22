function getbalances(request, response) {
    var result = {
        "success": true,
        "message": null,
        "result": {
            "currencies": {
                "btc": {
                    "btcValue": 1.00000000,
                    "bittrex": {
                        "available": 0.00000000,
                        "balance": 2.00000000,
                        "pending": 1.00000000,
                        "address" : "19YqztHmspv2egyD6jQM3yn81x5t5krVdJ"
                    },
                    "coinone": {
                        "available": 0.00000000,
                        "balance": 2.00000000,
                        "pending": 0.00000000,
                        "address" : "LPgf9kjv9H1Vuh4XSaKhzBe8JHdou1WgUB"
                    }
                },
                "eth": {
                    "btcValue": 0.063459,
                    "bittrex": {
                        "available": 2.00000000,
                        "balance": 5.00000000,
                        "pending": 0.00000000,
                        "address" : "19YqztHmspv2egyD6jQM3yn81x5t5krVdJ"
                    },
                    "coinone": {
                        "available": 0.00000000,
                        "balance": 20.00000000,
                        "pending": 0.00000000,
                        "address" : "LPgf9kjv9H1Vuh4XSaKhzBe8JHdou1WgUB"
                    }
                }
            },
            "exchangeRate": {
                "btc-usd": 9036.20,
                "btc-krw": 9657975.58,
                "btc-jpy": 954951.49,
                "btc-cny": 57097.91,
            }
        }
    };
    
    return result;
}


exports.getbalances = getbalances;