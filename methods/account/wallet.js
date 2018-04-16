const blockchain = require('../../common/blockchain')
const ERC20_ADDR = require('./../../common/smart_contracts/erc20_address.json')
const ERC20_CONTRACT = require('./../../common/smart_contracts/erc20_contract')

async function getBalanceWallet(params) {
    const blockchainFunctions = []

    if (params.tokenName) {
      blockchainFunctions.push(blockchain[params.currencies].getBalance(params))
    } else {
      const currencies = Object.keys(blockchain)
      for(let i = 0; i< currencies.length; i++) {
        blockchainFunctions.push(blockchain[currencies[i]].getBalance(params))
      }
    }

    // const walletResults = await Promise.all(blockchainFunctions)

    // return makeResponse(walletResults)
    return {
      "btc":{
        "balance": 0
        },
        "eth":{
        "balance": "0"
        },
        "eos":{
        "balance": "0"
        },
        "trx":{
        "balance": "0"
        },
        "ven":{
        "balance": "0"
        },
        "bnb":{
        "balance": "0"
        },
        "omg":{
        "balance": "0"
        },
        "icx":{
        "balance": "0"
        },
        "btm":{
        "balance": "0"
        },
        "ppt":{
        "balance": "0"
        },
        "dgd":{
        "balance": "0"
        },
        "rhoc":{
        "balance": "0"
        },
        "mkr":{
        "balance": "0"
        },
        "ae":{
        "balance": "0"
        },
        "zil":{
        "balance": "0"
        },
        "snt":{
        "balance": "0"
        },
        "zrx":{
        "balance": "0"
        },
        "rep":{
        "balance": "0"
        },
        "lrc":{
        "balance": "0"
        },
        "aion":{
        "balance": "0"
        },
        "elf":{
        "balance": "0"
        },
        "iost":{
        "balance": "0"
        },
        "wtc":{
        "balance": "0"
        },
        "gnt":{
        "balance": "0"
        },
        "bat":{
        "balance": "0"
        },
        "cennz":{
        "balance": "0"
        },
        "qash":{
        "balance": "0"
        },
        "veri":{
        "balance": "0"
        },
        "nas":{
        "balance": "0"
        },
        "sub":{
        "balance": "0"
        },
        "drgn":{
        "balance": "0"
        },
        "ethos":{
        "balance": "0"
        },
        "fun":{
        "balance": "0"
        },
        "knc":{
        "balance": "0"
        },
        "r":{
        "balance": "0"
        },
        "salt":{
        "balance": "0"
        },
        "ncash":{
        "balance": "0"
        },
        "link":{
        "balance": "0"
        },
        "powr":{
        "balance": "0"
        },
        "bnt":{
        "balance": "0"
        },
        "eng":{
        "balance": "0"
        },
        "wax":{
        "balance": "0"
        },
        "req":{
        "balance": "0"
        },
        "storj":{
        "balance": "0"
        },
        "dentacoin":{
        "balance": "0"
        },
        "fsn":{
        "balance": "0"
        },
        "pay":{
        "balance": "0"
        },
        "dent":{
        "balance": "0"
        },
        "cnd":{
        "balance": "0"
        },
        "icn":{
        "balance": "0"
        }
    }
    
}

function makeResponse(exchangeResults) {
  const response = Object.assign({}, ...exchangeResults);
  return response
}

exports.getBalanceWallet = getBalanceWallet

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