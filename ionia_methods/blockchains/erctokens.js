const PRIVACY = require('./../../privacy.json')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')
const ERC20_ADDR = require('./../../erc_contract_address.json')

async function erctokens(params) {
  const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`
  let web3

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(mainnet))
  }

  let result = {}
  // test version bokky
  if (params.do !== 'gettransaction' ) {
    const contractAddress = ERC20_ADDR[params.tokenName]
    const abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname+'/../../erc_abis', `./${params.tokenName}-contract-abi.json`), 'utf-8'))
  }
  
  if (params.do === 'sendtransaction') {
    const gasInfo = {}
    gasInfo.gasLimit = await getGasLimit(web3)
    gasInfo.gasPrice = await getGasPrice(web3)
    const nonce = await web3.eth.getTransactionCount(params.frompubKey)
    // get contract address & abi read
    result.hash = await sendTransaction(params, web3, gasInfo, nonce, contractAddress, abiArray)

  } else if (params.do === 'getbalance') {
    result.balance = await getBalance(params, web3, contractAddress, abiArray)

  } else if (parmas.do === 'createaccount') {
    // 어떻게 하는것일까 ...
  } else {
    result.transaction = await getTransaction(params, web3)
    
  }

  if(isEmpty(result)) {
    return undefined
  } else {
    return result
  }
  
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


function sendTransaction(params, web3, gasInfo, nonce, contractAddress, abiArray) {

  return new Promise((resolve, reject) => {
    const privateKey = new Buffer(params.fromprivKey.substr(2), 'hex')
    const value = web3.utils.toHex(web3.utils.toWei(params.amount))
    const contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: params.frompubKey
    })
    const chainId = 1
    const rawTransaction = {
        from: params.frompubKey,
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

async function getBalance(params, web3, contractAddress, abiArray) {
  const contract = new web3.eth.Contract(abiArray, contractAddress, {
      from: params.frompubKey
  })
  balance = await contract.methods.balanceOf(params.frompubKey).call()
  return web3.utils.fromWei(balance)
}

async function getTransaction(params, web3) {
  const hash = await web3.eth.getTransaction(params.hash)
  return hash
}

exports.erctokens = erctokens