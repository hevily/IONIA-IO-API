const koaRouter = require('koa-router');
const bittrex = require('../../app/exchange/bittrex');

const accountRouter = new koaRouter();

accountRouter.get('/getbalances', bittrex.getbalances);

module.exports = accountRouter;