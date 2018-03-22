bittrex = require('./bittrex.js');

function getBalanceExchanges(request, callback) {
    // top 150 from coinmarketcap
    var currencyList = [
        'btc', 'eth', 'xrp', 'bch', 'ltc', 'ada', 'eos', 'neo', 'xlm', 'miota', 'xmr', 'dash', 'xem', 'trx', 'usdt',
        'etc', 'ven', 'qtum', 'icx', 'lsk', 'omg', 'nano', 'btg', 'bnb', 'zec', 'dgd', 'ppt', 'steem', 'strat', 'xvg',
        'bcn', 'waves', 'sc', 'mkr', 'rhoc', 'bts', 'doge', 'ae', 'snt', 'rep', 'aion', 'dcr', 'btm', 'wtc', 'ont',
        'zil', 'kmd', 'zrx', 'ardr', 'hsr', 'ark', 'kcs', 'cnx', 'dgb', 'lrc', 'qash', 'gas', 'veri', 'pivx', 'sys',
        'mona', 'fct', 'nas', 'ethos', 'drgn', 'bat', 'gnt', 'etn', 'r', 'fun', 'knc', 'xzc', 'iost', 'salt', 'elf',
        'gxs', 'req', 'rdd', 'link', 'emc', 'poly', 'nxt', 'gbyte', 'maid', 'kin', 'powr', 'ncash', 'dcn', 'part',
        'bnt', 'cnd', 'eng', 'pay', 'nebl', 'nxs', 'storm', 'dent', 'smart', 'nuls', 'tky',

        'icn', 'storj', 'vtc', 'ant', 'mtl', 'act', 'btcd', 'sub', 'plr', 'srn', 'block', 'qsp', 'mana', 'gno',
        'agi', 'gvt', 'game', 'btx', 'tnb', 'cvc', 'enj', 'mco', 'dtr', 'theta', 'san', 'cs', 'rlc', 'rdn', 'sky',
        'gnx', 'ignis', 'wax', 'poe', 'bix', 'nav', 'ubq', 'hpb', 'abt', 'xpa', 'bos', 'dew', 'ppp', 'zen', 'sls',
        'edg', 'pura', 'xas', 'prl', 'poa'
    ];

    var API_KEY = '4f4f65118cb14a7e9efa8cc421ca5196';
    var API_SECRET = 'b8c3460146fe415787460cd6174c7288';

    var callback2 = function(bittrexResult) {
        var result = {};

        currencyList.forEach(function(currency) {
            if(bittrexResult[currency]) {
                result[currency] = bittrexResult[currency];
                result[currency]['btcValue'] = 0;
            }
        });
    
        callback(result);
    };

    bittrex.getbalances(API_KEY, API_SECRET, callback2);
}

exports.getBalanceExchanges = getBalanceExchanges;