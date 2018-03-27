const jsonRpc = require('./ionia_modules/jsonRpc');
const getbalances = require('./ionia_methods/balances/balances').getbalances;
const register = require('./ionia_methods/auth/register').register;
const login = require('./ionia_methods/auth/login').login;
const logout = require('./ionia_methods/auth/logout').logout;

// methods
jsonRpc.registMethod('getbalances', getbalances);
jsonRpc.registMethod('register', register);
jsonRpc.registMethod('login', login);
jsonRpc.registMethod('logout', logout);

module.exports = jsonRpc;