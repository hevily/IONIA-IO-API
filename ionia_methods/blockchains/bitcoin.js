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
  } else if (params.do === 'createaddress') {
    kapitalize.exec('getNewAddress', function(err, address) {
      console.log(address);
    });
  } else if (params.do === 'searchTransaction'){
    result = await searchTransaction(params, kapitalize)
  } else {
    // get balance
    result = await getBalance(params, kapitalize)
  }
  return result;
}

exports.bitcoin = bitcoin;