const blockchain = require('../../common/blockchain')
const ERC20_ADDR = require('./../../common/smart_contracts/erc20_address.json')
const ERC20_CONTRACT = require('./../../common/smart_contracts/erc20_contract')

const dao = require('./dao/walletDAO')

async function getBalanceWallet(params) {
    if(params.currencies === null || params.currencies.length === 0) {
        params.currencies = Object.keys(blockchain)
    }

    const userWallets = await dao.selectUserWallet(params.userInfo.id)

    if(userWallets.length === 0) {
        throw 'You need to make a wallet'
    }

    const blockchainFunctions = []

    for(const currency of params.currencies) {
        const currencyRow = userWallets.find((userWallet) => {
            return userWallet.currency === currency
        })

        blockchainFunctions.push(blockchain[currency].getBalance(currencyRow.address))
    }

    const results = await Promise.all(blockchainFunctions)

    return {
        data: results
    }
}

async function createWallet(params) {
    if(params.currencies === undefined || params.currencies.length === 0) {
        params.currencies = Object.keys(blockchain)
    }
    
    const blockchainFunctions = []

    for(const currency of params.currencies) {
        blockchainFunctions.push(blockchain[currency].createAccount())
    }

    const wallets = await Promise.all(blockchainFunctions)
    
    const data = []

    for(const wallet of wallets) {
        const isInserted = await dao.insertUserWallet(params.userInfo.id, wallet)

        if(isInserted) {
            data.push(wallet)
        }
    }

    return {
        data: data
    }
}

async function contractInfo(params) {
  const result = {}
  result.abi = ERC20_CONTRACT[params.tokenName]
  result.contractAddress = ERC20_ADDR[params.tokenName]

  if (isEmpty(result)) {
    return null
  } else {
    return result
  }
}


function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

exports.contractInfo = contractInfo


exports.getBalanceWallet = getBalanceWallet
exports.createWallet = createWallet

