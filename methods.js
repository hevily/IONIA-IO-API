const jsonRpc = require('./ionia_modules/jsonRpc');
const getbalances = require('./ionia_methods/balances/balances').getbalances;
const getexchangeablecoins = require('./ionia_methods/exchange/exchange').getexchangeablecoins;
const register = require('./ionia_methods/auth/register').register;
const login = require('./ionia_methods/auth/login').login;
const logout = require('./ionia_methods/auth/logout').logout;

// blockchain
const bitcoin = require('./ionia_methods/blockchains/bitcoin').bitcoin;
const ethereum = require('./ionia_methods/blockchains/ethereum').ethereum;
const erctokens = require('./ionia_methods/blockchains/erctokens').erctokens;

// balance methods
jsonRpc.registMethod('getbalances', getbalances);

// exchange methods
jsonRpc.registMethod('getexchangeablecoins', getexchangeablecoins);

// auth
jsonRpc.registMethod('register', register);
jsonRpc.registMethod('login', login);
jsonRpc.registMethod('logout', logout);

// blockchain method
jsonRpc.registMethod('bitcoin', bitcoin);
jsonRpc.registMethod('ethereum', ethereum);
jsonRpc.registMethod('erctokens', erctokens);

module.exports = jsonRpc;