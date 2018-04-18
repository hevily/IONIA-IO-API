const blockchain = require('../../common/blockchain')

async function transfer(params) {
  return await blockchain[params.currency].sendTransaction(params)
}

exports.transfer = transfer