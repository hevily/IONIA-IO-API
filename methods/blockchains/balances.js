const PRIVACY = require('../../privacy.json')
const fs = require('fs')
const path = require('path')
const ERC20_ADDR = require('../../common/smart_contracts/erc20_address.json')
const Web3 = require('web3')


async function getBlockBalances(params) {
  const kapitalize = require('../../common/modules/kapitalize/kapitalize')({
    host: PRIVACY.BLOCKCHAINS.BITCOIN.IP,
    port: PRIVACY.BLOCKCHAINS.BITCOIN.PORT,
    user: PRIVACY.BLOCKCHAINS.BITCOIN.USERNAME,
    pass: PRIVACY.BLOCKCHAINS.BITCOIN.PASSWORD
  })

  const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`
  let web3

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(mainnet))
  }

  let result = {}
  result.balance = {}
  result.balance['btc'] = await btcGetBalance(params, kapitalize)
  result.balance['eth'] = await ethGetBalance(params, web3)

  let contractAddress = ''
  let abiArray = ''
  const tokens = Object.keys(ERC20_ADDR)
  for(let i = 0 ; i < tokens.length ; i++) {
    const smartcontractInfo = {};
    smartcontractInfo.abi = await getAbi(tokens[i])
    smartcontractInfo.contractAddress = ERC20_ADDR[tokens[i]]
    result.balance[tokens[i]] = await erc20GetBalance(params, web3, smartcontractInfo.contractAddress, smartcontractInfo.abi)
  }

  if(isEmpty(result)) {
    return undefined
  } else {
    console.log(result)
    return result.balance
  }
  // return result;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

async function getAbi(token) {
  abiArray = await JSON.parse(fs.readFileSync(path.resolve(__dirname+'/../../common/smart_contracts/erc20', `./${token}-contract-abi.json`), 'utf-8'))
  return abiArray
}

function btcGetBalance(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getbalance', params.account, function(err, result) {
      if(err) {
        console.log(err)
        reject(err)
      } else {
        resolve(result.result)
      }
    })
  })
}

function erc20GetBalance(params, web3, contractAddress, abiArray) {

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
    });
  })
}

function ethGetBalance(params, web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(params.address, function(err, balance) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(web3.utils.fromWei(balance))
      }
    })
  })
}

exports.getBlockBalances = getBlockBalances