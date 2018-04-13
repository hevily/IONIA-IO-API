const PRIVACY = require('../../privacy.json')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')
const ERC20_ADDR = require('../smart_contracts/erc20_address.json')
const ERC20_CONTRACT = require('../smart_contracts/erc20_contract')

const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`
let web3

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(mainnet))
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
  const smartcontractInfo = {}
  smartcontractInfo.abi = await getAbi(params.tokenName)
  smartcontractInfo.contractAddress = getContractAddress(params.tokenName)

  const gasInfo = {}
  gasInfo.gasLimit = await getGasLimit(web3)
  gasInfo.gasPrice = await getGasPrice(web3)
  const nonce = await web3.eth.getTransactionCount(params.address)

  return await sendTransaction(params, web3, gasInfo, nonce, smartcontractInfo.contractAddress, smartcontractInfo.abi)
}

function sendTransactionAction(params, web3, gasInfo, nonce, contractAddress, abiArray) {

  return new Promise((resolve, reject) => {
    const privateKey = new Buffer(params.fromprivKey.substr(2), 'hex')
    const value = web3.utils.toHex(web3.utils.toWei(params.amount))
    const contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: params.address
    })
    const chainId = 1
    const rawTransaction = {
        from: params.address,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasInfo.gasPrice),
        gasLimit: web3.utils.toHex(gasInfo.gasLimit),
        to: contractAddress,
        value: "0x0",
        data: contract.methods.transfer(params.topubKey, 1).encodeABI(),
        chainId: chainId
    }
  
    const tx = new EthereumTx(rawTransaction)
    tx.sign(privateKey)
    const serializedTx = tx.serialize()
    
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {                
        if (!err){
          resolve(hash)
        }
        else {
          console.log(err)
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
