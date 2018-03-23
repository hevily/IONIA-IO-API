const koaRouter = require('koa-router');
const account = require('../../controllers/v1/account');

const router = new koaRouter();

router.use('/account', account.routes());

module.exports = router;