const blockchain = require('../../common/blockchain')

async function getBalanceWallet(params) {
    const blockchainFunctions = []

    if (params.currencies) {
      blockchainFunctions.push(blockchain[params.currencies].getBalance(params))
    } else {
      const currencies = Object.keys(blockchain)
      console.log(currencies);
      for(let i = 0; i< currencies.length; i++) {
        console.log(blockchain[currencies[i]]);
        blockchainFunctions.push(blockchain[currencies[i]].getBalance(params))
      }
    }

    const walletResults = await Promise.all(blockchainFunctions)

    return makeResponse(walletResults)
}

function makeResponse(exchangeResults) {
  const response = Object.assign({}, ...exchangeResults);
  return response
}

exports.getBalanceWallet = getBalanceWallet