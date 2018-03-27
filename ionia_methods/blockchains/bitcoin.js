const PRIVACY = require('./../../privacy.json');

async function bitcoin(params) {
  console.log(params);
  const kapitalize = require('kapitalize')({
    host: PRIVACY.BLOCKCHAINS.BITCOIN.IP,
    port: PRIVACY.BLOCKCHAINS.BITCOIN.PORT,
    user: PRIVACY.BLOCKCHAINS.BITCOIN.USERNAME,
    pass: PRIVACY.BLOCKCHAINS.BITCOIN.PASSWORD
  })

  console.log(kapitalize);

  if (params.do === 'send') {
    await send(params)
  } else if (params.do === 'createaddress') {
    await createAddress()
  } else {
    await searchTransaction(params)
  }
  return true;
  
}


function send() {

}

function searchTransaction() {

}

function createAddress() {

}

exports.bitcoin = bitcoin;