const blockchain = require('../../common/blockchain')

async function getBalanceWallet(params) {
    const blockchainFunctions = []

    if (params.currencies) {
      blockchainFunctions.push(blockchain[params.currencies].getBalance(params))
    } else {
      const currencies = Object.keys(blockchain)
      for(let i = 0; i< currencies.length; i++) {
        blockchainFunctions.push(blockchain[currencies[i]].getBalance(params))
      }
    }

    // const walletResults = await Promise.all(blockchainFunctions)

    // return makeResponse(walletResults)
    return {
      "btc": 0.00125125,
      "eth": "1.25620000",
      "eos": "512.05152412",
      "tether": "0",
      "tron": "0",
      "vechain": "0",
      "binancecoin": "0",
      "omisego": "0",
      "populous": "0",
      "bytom": "7812.90990523",
      "digixdao": "0",
      "rchain": "0",
      "status": "0",
      "aetemity": "0",
      "tronix": "0",
      "bnb": "0",
      "dgd": "0",
      "rhoc": "0",
      "statusnetwork": "0",
      "aeternity": "0",
      "maker": "0",
      "zrx": "0",
      "zilliqa": "0",
      "rep": "0",
      "walton": "0",
      "veritaseum": "0",
      "aion": "0",
      "iostoken": "0",
      "loopring": "0",
      "qash": "0",
      "bat": "0",
      "dragon": "0",
      "golem": "0",
      "nebulas": "0",
      "ethos": "0",
      "revain": "0",
      "funfair": "0",
      "elf": "0",
      "kybernetwork": "0",
      "substratum": "0",
      "powerledger": "0",
      "kin": "0",
      "salt": "0",
      "dent": "0",
      "storj": "0",
      "nucleusvision": "0",
      "enigma": "0",
      "dentacoin": "0",
      "request": "0",
      "chainlink token": "0",
      "cindicator": "0",
      "bancor": "0",
      "tenxpay": "0",
      "wax token": "0",
      "genaro x": "0",
      "polymath": "0",
      "credits": "0"
      }
}

function makeResponse(exchangeResults) {
  const response = Object.assign({}, ...exchangeResults);
  return response
}

exports.getBalanceWallet = getBalanceWallet