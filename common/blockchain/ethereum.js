const PRIVACY = require('./../../privacy.json')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`
let web3

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(mainnet))
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
  const gasInfo = {}
  gasInfo.gasLimit = await getGasLimit(web3)
  gasInfo.gasPrice = await getGasPrice(web3)
  // private nonce
  const nonce =  await web3.eth.getTransactionCount(params.fromPubKey)
  return await sendTransactionAction(params, web3, gasInfo, nonce)
}

function sendTransactionAction(params, web3, gasInfo, nonce) {
  const fromPubKey = params.fromPubKey
  const fromPriKey = params.fromPriKey.substr(2)
  const toPubKey = params.toPubKey
  const privateKey = Buffer.from(fromPriKey, 'hex')
  const nonceHex = web3.utils.toHex(nonce)
  const gasLimit = web3.utils.toHex(gasInfo.gasLimit)
  const gasPrice = web3.utils.toHex(gasInfo.gasPrice)
  const value = web3.utils.toHex(web3.utils.toWei(params.value))
  const data = web3.utils.toHex(params.data)
  const chainid = 1;

  const txParams = {
    nonce: nonceHex,
    gasPrice: gasPrice, 
    gasLimit: gasLimit,
    to: toPubKey, 
    value: value,
    data: data,
    chainId: 1
  }

  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {                
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(hash)
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
    const result = {}
    const account = web3.eth.accounts.create(web3.utils.randomHex(32))
    result.ethereum = {
      address: account.address,
      privateKey: account.privateKey
    }
    resolve(result)
  })
}

exports.createAccount = createAccount

async function getBalance(address) {
  const result = {}
  result.ethereum = {}
  result.ethereum.balance = parseFloat(await getBalanceAction(address, web3))
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