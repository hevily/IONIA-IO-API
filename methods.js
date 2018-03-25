const koaJsonRpc = require('koa-jsonrpc');
const getbalances = require('./ionia_methods/balances/balances').getbalances;


const jsonRpc = koaJsonRpc();

// methods
jsonRpc.use('getbalances', getbalances);

module.exports = jsonRpc;