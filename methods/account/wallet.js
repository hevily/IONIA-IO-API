const blockchain = require('../../common/blockchain')
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
    if(params.currencies === null || params.currencies.length === 0) {
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


exports.getBalanceWallet = getBalanceWallet
exports.createWallet = createWallet