const PRIVACY = require('./../../privacy.json')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`
const testnet = `https://ropsten.infura.io/RJk9FLrQ2hTCdb1NKd3n`
let web3

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(testnet))
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

function getGasLimit(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock('latest').then(function(result) {
      resolve(result.gasLimit)
    })
  })
}

function getGasPrice(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getGasPrice().then(function(price) {
      resolve(price)
    })
  })
}

async function sendTransaction(params) {
  try {
    return await sendTransactionAction(params, web3)
  } catch(err) { 
    return err
  }
}

function sendTransactionAction(params, web3) {
  console.log(params.signedTransaction)
  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(params.signedTransaction, function(err, hash) {                
        if (!err){
          resolve(hash)
        }
        else {
          console.log('err : ', err)
          reject(err)
        }
    })
  })
}


exports.sendTransaction = sendTransaction

async function getTransaction(params) {
  await getTransactionAction(params, web3)
}

function getTransactionAction(params, web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getTransaction(params.hash, function(object) {
      resolve(object)
    })
  })
}

exports.getTransaction = getTransaction

async function createAccount() {
  return await createAccountAction(web3)
}

function createAccountAction(web3) {
  return new Promise((resolve, reject) => {
    const account = web3.eth.accounts.create(web3.utils.randomHex(32))
    account.currency = 'ethereum'
    resolve(account)
  })
}

exports.createAccount = createAccount

async function getBalance(address) {
  const result = {}
  result.currency = 'ethereum'
  result.balance = parseFloat(await getBalanceAction(address, web3))
  return result
}

function getBalanceAction(address, web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, function(err, balance) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(web3.utils.fromWei(balance))
      }
    })
  })
}

exports.getBalance = getBalance