const PRIVACY = require('./../../privacy.json')

async function bitcoin(params, callback) {
  const kapitalize = require('./../../ionia_modules/kapitalize/kapitalize')({
    host: PRIVACY.BLOCKCHAINS.BITCOIN.IP,
    port: PRIVACY.BLOCKCHAINS.BITCOIN.PORT,
    user: PRIVACY.BLOCKCHAINS.BITCOIN.USERNAME,
    pass: PRIVACY.BLOCKCHAINS.BITCOIN.PASSWORD
  })
  let result = {}
  /**
    1. 계정 생성
      - 지갑 unlock
      - 계정 생성
      - 계성에 따른 프라이빗 키 가져오기
      - 프라이빗 키 import
      - 지갑 lock
    2. 트랜젝션 발행
      - 지갑 unlock
      - sendfrom 사용
      - 지갑 lock
    3. 트랜젝션 검색
      - gettransaction 사용하여 검사
    4. 벨런스 조회
      - getbalance 사용하여 조회
   */

  if (params.do === 'createaccount') {
    result.account = {}
    result.account.address = await createAccount(params, kapitalize)
    await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize);
    result.account.privkey = await getDumpPrivateKey(result.account.address, kapitalize)
    await importPrivateKey(params, result.account.privkey, kapitalize)
    await lockWallet(kapitalize)

  } else if (params.do === 'getbalance') {
    result.balance = getBalance(params, kapitalize)

  } else if (params.do === 'sendtransaction') {
    await unlockWallet(PRIVACY.BLOCKCHAINS.BITCOIN.WALLETPASSWD, kapitalize);
    result.hash = await sendTransaction(params, kapitalize)
    await lockWallet(kapitalize)

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
    kapitalize.exec('walletlock', function(err, result) {
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
    kap.exec('sendfrom', params.account, params.toaddress, params.amount, function(err, result) {
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
        console.log(address)
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
    kap.exec('getbalance', params.account, function(err, balance) {
      if(err) {
        console.log(err)
        reject(err)
      } else {
        console.log(balance)
        resolve(balance)
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

exports.bitcoin = bitcoin