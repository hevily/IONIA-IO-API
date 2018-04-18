const PRIVACY = require('../../privacy.json')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')
const ERC20_ADDR = require('../smart_contracts/erc20_address.json')
const ERC20_CONTRACT = require('../smart_contracts/erc20_contract')

const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`
const testnet = `https://ropsten.infura.io/RJk9FLrQ2hTCdb1NKd3n`
let web3

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(testnet))
}


function getContractAddress(token) {
  contractAddress = ERC20_ADDR[token]
  return contractAddress
}

async function getAbi(token) {
  abiArray = await JSON.parse(fs.readFileSync(path.resolve(__dirname+'/../../common/smart_contracts/erc20', `./${token}-contract-abi.json`), 'utf-8'))
  return abiArray
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

// function createAccount(web3) {
//   return new Promise((resolve, reject) => {
//     const account = web3.eth.accounts.create(web3.utils.randomHex(32))
//     resolve(account)
//   })
// }

async function sendTransaction(params) {
  try {
    return await sendTransactionAction(params, web3)
  } catch(err) { 
    return err
  }
}

function sendTransactionAction(params, web3) {
  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(params.signedTransaction, function(err, hash) {                
        if (!err){
          resolve(hash)
        }
        else {
          console.log('err erc : ',  err)
          reject(err)
        }
    })
  })
}

exports.sendTransaction = sendTransaction

async function getBalance(params) {
  let contractAddress = ''
  let abiArray = ''
  let result = {};

  if (params.tokenName) {
    const smartcontractInfo = {};
    // smartcontractInfo.abi = await getAbi(params.tokenName)
    smartcontractInfo.abi = ERC20_CONTRACT[params.tokenName]
    smartcontractInfo.contractAddress = ERC20_ADDR[params.tokenName]
    result[params.tokenName] = {}
    result[params.tokenName]['balance'] = await getBalanceAction(params, web3, smartcontractInfo.contractAddress, smartcontractInfo.abi)
  } else {
    const tokens = Object.keys(ERC20_ADDR)
    for(let i = 0 ; i < tokens.length ; i++) {
      const smartcontractInfo = {};
      smartcontractInfo.abi = ERC20_CONTRACT[tokens[i]]
      smartcontractInfo.contractAddress = ERC20_ADDR[tokens[i]]
      result[tokens[i]] = {}
      result[tokens[i]]['balance'] = await getBalanceAction(params, web3, smartcontractInfo.contractAddress, smartcontractInfo.abi)
    }
  }

  return result
}

function getBalanceAction(params, web3, contractAddress, abiArray) {

  return new Promise((resolve, reject) => {
    var fromPubKey = params.address;  
    var addr = fromPubKey;
    var contractAddr = contractAddress;
    var tknAddress = (addr).substring(2)
    var contractData = ('0x70a08231000000000000000000000000' + tknAddress)
    web3.eth.call({
      to: contractAddr, 
      data: contractData 
    },
    function(err, result) {
      if (result) {                
        resolve(web3.utils.fromWei(result));
      }
      else {
        reject(err);
        console.log(err);
      }
    })
  })
}

exports.getBalance = getBalance

async function getTransaction(params) {
  const hash = await web3.eth.getTransaction(params.hash)
  return hash
}

exports.getTransaction = getTransaction
