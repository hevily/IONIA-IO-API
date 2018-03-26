const jsonRpc = require('./ionia_modules/jsonRpc');
const getbalances = require('./ionia_methods/balances/balances').getbalances;

// methods
jsonRpc.registMethod('getbalances', getbalances);

module.exports = jsonRpc;