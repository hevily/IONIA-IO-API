const koaRouter = require('koa-router');
const balances = require('../../app/balances/balances');

const accountRouter = new koaRouter();

accountRouter.get('/getbalances', balances.getBalances);

module.exports = accountRouter;