const PRIVACY = require('./../../privacy.json');
const Web3 = require('web3');

async function ethereum(params) {
  console.log(params);
  var mainnet = `http://${PRIVACY.BLOCKCHAINS.ETHEREUM.IP}:${PRIVACY.BLOCKCHAINS.ETHEREUM.PORT}`;
  let web3;

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(mainnet));
    web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log('Wow. Something went wrong'));
  }

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

exports.ethereum = ethereum;