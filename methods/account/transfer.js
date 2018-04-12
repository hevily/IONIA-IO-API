const blockchain = require('../../common/blockchain')

async function transfer(params) {
  const sendHash = await blockchain[params.currency].sendTransaction(params)
  return sendHash
}

exports.transfer = transfer