const PRIVACY = require('./../../privacy.json');

async function bitcoin(params, callback) {
  const kapitalize = require('kapitalize')({
    host: PRIVACY.BLOCKCHAINS.BITCOIN.IP,
    port: PRIVACY.BLOCKCHAINS.BITCOIN.PORT,
    user: PRIVACY.BLOCKCHAINS.BITCOIN.USERNAME,
    pass: PRIVACY.BLOCKCHAINS.BITCOIN.PASSWORD
  })
  let result;
  if (params.do === 'send') {
    result = await send(params, kapitalize)
  } else if (params.do === 'getnewaddress') {
    result = await createAddress(params, kapitalize)
  } else if (params.do === 'searchTransaction'){
    result = await searchTransaction(params, kapitalize)
  } else if(params.do === 'getaccount') {
    result = await getAccount(params, kapitalize)
  } else if (params.do === 'dumpprivkey') {
    result = await getDumpPrivateKey(params, kapitalize)
  } else if (params.do === 'importprivkey') {
    result = await importPrivateKey(params, kapitalize)
  } else {
    // get balance
    result = await getBalance(params, kapitalize)
  }
  return result;
  
}

function send(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('sendfrom', params.account, params.toaddress, params.amount, function(err, result) {
      if(err) {
        reject(err);
      } else {
        console.log(result);
        resolve(result);
      }
    });
  })
}

function createAddress(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getNewAddress', params.account ,function(err, address) {
      if(err) {
        reject(err);
      } else {
        console.log(address);
        resolve(address);
      }
    });
  })
}

function searchTransaction(params, kap) {

}

function getBalance(params, kap) {
  return new Promise((resolve, reject) => {
    console.log(params.account);
    kap.exec('getbalance', function(err, balance) {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        console.log(balance);
        resolve(balance);
      }
    })
  })
}

function getAccount(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getaccount', params.address, function(err, account) {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        console.log(account);
        resolve(account);
      }
    })
  })
}

function getDumpPrivateKey(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('dumpprivkey', params.address, function(err, prikey) {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        console.log('dumpprivatekey : ', prikey);
        resolve(prikey);
      }
    })
  })
}

function importPrivateKey(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('importprivkey', params.prikey, params.account, function(err, result) {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        console.log('import result : ', result);
        resolve(result);
      }
    })
  })
}

exports.bitcoin = bitcoin;