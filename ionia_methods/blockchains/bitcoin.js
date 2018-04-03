const PRIVACY = require('./../../privacy.json')

async function bitcoin(params, callback) {
  const kapitalize = require('./../../ionia_modules/kapitalize/kapitalize')({
    host: PRIVACY.BLOCKCHAINS.BITCOIN.IP,
    port: PRIVACY.BLOCKCHAINS.BITCOIN.PORT,
    user: PRIVACY.BLOCKCHAINS.BITCOIN.USERNAME,
    pass: PRIVACY.BLOCKCHAINS.BITCOIN.PASSWORD
  })
  let result = {}

  if (params.do === 'createaccount') {
    result.account = {}
    result.account.address = await createAccount(params, kapitalize)
    await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize);
    result.account.privkey = await getDumpPrivateKey(result.account.address, kapitalize)
    await importPrivateKey(params, result.account.privkey, kapitalize)
    await lockWallet(kapitalize)

  } else if (params.do === 'getbalance') {
    result.balance = await getBalance(params, kapitalize)

  } else if (params.do === 'sendtransaction') {
    await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize)
    result.hash = await sendTransaction(params, kapitalize)
    await lockWallet(kapitalize)

  } else if (params.do === 'listtransaction') {
    result.transactions = await getListTransactions(params, kapitalize)
  } else {
    result.transaction = await getTransaction(params, kapitalize)
    
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

function unlockWallet(passwd, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('walletpassphrase', passwd, 10, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    })
  })
}

function lockWallet(kap) {
  return new Promise((resolve, reject) => {
    kap.exec('walletlock', function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    })
  })
}

function sendTransaction(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('sendfrom', params.account, params.toaddress, params.amount, params.confirm, params.comment, params.commentto, function(err, result) {
      if(err) {
        reject(err)
      } else {
        console.log(result)
        resolve(result)
      }
    })
  })
}

function createAccount(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getNewAddress', params.account ,function(err, address) {
      if(err) {
        reject(err)
      } else {
        resolve(address)
      }
    })
  })
}

function getTransaction(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('gettransaction', params.hash, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function getBalance(params, kap) {
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

function getDumpPrivateKey(address, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('dumpprivkey', address, function(err, prikey) {
      if(err) {
        console.log(err)
        reject(err)
      } else {
        resolve(prikey)
      }
    })
  })
}

function importPrivateKey(params, privkey, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('importprivkey', privkey, params.account, function(err, result) {
      if(err) {
        console.log(err)
        reject(err)
      } else {
        console.log('import result : ', result);
        resolve(result)
      }
    })
  })
}

function getListTransactions(params, kap) {
  return new Promise((resolve, reject) => {
    // account, count, skip to, watch only address
    kap.exec('listtransactions', params.account, params.count, 0, true, function(results) {
      resolve(results);
    })
  })
}

exports.bitcoin = bitcoin