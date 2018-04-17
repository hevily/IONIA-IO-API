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

function importPrivateKey(privkey, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('importprivkey', privkey, function(err, result) {
      if(err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}


async function createAccount(params) {
  const result = {}
  result.bitcoin = {}
  result.bitcoin.address = await createAccountAction(kapitalize)
  await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize)
  result.bitcoin.privateKey = await getDumpPrivateKey(result.bitcoin.address, kapitalize)
  await importPrivateKey(result.bitcoin.privateKey, kapitalize)
  await lockWallet(kapitalize)
  return result
}

function createAccountAction(kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getNewAddress', function(err, address) {
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

async function getBalance(address) {
  const result = {}
  result.bitcoin = {}
  result.bitcoin.balance = parseFloat(await getBalanceAction(address, kapitalize))
  return result
}

function getBalanceAction(address, kap) {
  return new Promise((resolve, reject) => {
    kap.exec('getbalance', address, function(err, result) {
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
