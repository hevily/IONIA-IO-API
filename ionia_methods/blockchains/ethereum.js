const PRIVACY = require('./../../privacy.json');
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');

async function ethereum(params) {
  const mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`;
  let web3;

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(mainnet));
  }

  let tempObj = {};
  
  if (params.do === 'sendtransaction') {
    const gasInfo = {};
    gasInfo.gasLimit = await getGasLimit(web3);
    gasInfo.gasPrice = await getGasPrice(web3);
    tempObj.hash = await sendTransaction(params, web3, gasInfo);
  } else if (params.do === 'createaccount') {
    tempObj.account = await createAccount(web3)
  } else if (params.do === 'getbalance') {
    tempObj.balance = await getBalance(params, web3);
  } else {
    tempObj.transaction = await getTransaction(params, web3)
  }

  if(isEmpty(tempObj)) {
    return undefined;
  } else {
    return tempObj;
  }
  
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getGasLimit(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock('latest').then(function(result) {
      resolve(result.gasLimit);
    });
  })
}

function getGasPrice(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getGasPrice().then(function(price) {
      resolve(price);
    });
  })
}


function sendTransaction(params, web3, gasInfo) {
  const fromPubKey = params.fromPubKey;
  const fromPriKey = params.fromPriKey.substr(2);
  const toPubKey = params.toPubKey;

  const privateKey = Buffer.from(fromPriKey, 'hex');

  const nonceHex = web3.utils.toHex( web3.eth.getTransactionCount(fromPubKey));
  const gasLimit = web3.utils.toHex(gasInfo.gasLimit);
  const gasPrice = web3.utils.toHex(gasInfo.gasPrice);
  const value = web3.utils.toHex(web3.utils.toWei(params.value));
  const data = web3.utils.toHex(params.data);

  const txParams = {
    nonce: nonceHex,
    gasPrice: gasPrice, 
    gasLimit: gasLimit,
    to: toPubKey, 
    value: value, 
    data: data,
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 1
  }

  const tx = new EthereumTx(txParams)
  tx.sign(privateKey);
  const serializedTx = tx.serialize()

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {                
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(hash);
      }
    });
  })
}

function getTransaction(params, web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getTransaction(params.hash, function(object) {
      resolve(object);
    })
  })
}

function createAccount(web3) {
  return new Promise((resolve, reject) => {
    const account = web3.eth.accounts.create(web3.utils.randomHex(32))
    resolve(account);
  })
}

function getBalance(params, web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(params.address, function(err, balance) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log('arnold bal :', web3.utils.fromWei(balance) + ' eth');
        resolve(web3.utils.fromWei(balance));
      }
    })
  })
}

exports.ethereum = ethereum;