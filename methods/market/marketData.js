const http = require('../../common/modules/http')


async function getMarketData(params) {
    const url = 'https://api.coinmarketcap.com/v1/ticker/'
    const markets = await http.request(url)

    const results = []

    for(const market of markets) {
        results.push({
            id: market.id,
            name: market.name,
            symbol: market.symbol,
            rank: parseInt(market.rank),
            priceBTC: parseFloat(market.price_btc),
            percentChange24h: parseFloat(market.percent_change_24h)
        })
    }

    return results
}

exports.getMarketData = getMarketData