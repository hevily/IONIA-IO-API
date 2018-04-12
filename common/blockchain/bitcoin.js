const PRIVACY = require('../../privacy.json')
const kapitalize = require('../modules/kapitalize/kapitalize')({
  host: PRIVACY.BLOCKCHAINS.BITCOIN.IP,
  port: PRIVACY.BLOCKCHAINS.BITCOIN.PORT,
  user: PRIVACY.BLOCKCHAINS.BITCOIN.USERNAME,
  pass: PRIVACY.BLOCKCHAINS.BITCOIN.PASSWORD
})

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

function unlockWallet(passwd, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('walletpassphrase', passwd, 10, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
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
        resolve(result)
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
        resolve(result)
      }
    })
  })
}


async function createAccount(params) {
  let result = {}
  result.account = {}
  result.account.address = await createAccount(params, kapitalize)
  await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize)
  result.account.privkey = await getDumpPrivateKey(result.account.address, kapitalize)
  await importPrivateKey(params, result.account.privkey, kapitalize)
  await lockWallet(kapitalize)
  return result
}

function createAccountAction(params, kap) {
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

exports.createAccount = createAccount


async function sendTransaction(params) {
  await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize)
  const hash = await sendTransactionAction(params, kapitalize)
  await lockWallet(kapitalize)
  return hash
  
}

function sendTransactionAction(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('sendfrom', params.account, params.toaddress, parseInt(params.amount), params.confirm, params.comment, params.commentto, function(err, result) {
      if(err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

exports.sendTransaction = sendTransaction


async function getTransaction(params) {
  return await getTransactionAction(params, kapitalize)
}

function getTransactionAction(params, kap) {
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

exports.getTransaction = getTransaction

async function getBalance(params) {
  const result = {}
  result['btc'] = await getBalanceAction(params, kapitalize)
  return result
}

function getBalanceAction(params, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getbalance', params.account, function(err, result) {
      if(err) {
        reject(err)
      } else {
        resolve(result.result)
      }
    })
  })
}

exports.getBalance = getBalance

async function getListTransactions(params) {
  return await getListTransactionsAction(params, kapitalize)
}

function getListTransactionsAction(params, kap) {
  return new Promise((resolve, reject) => {
    // account, count, skip to, watch only address
    kap.exec('listtransactions', params.account, params.count, 0, true, function(results) {
      resolve(results)
    })
  })
}

exports.getListTransactions = getListTransactions
