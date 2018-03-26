const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const methods = require('./methods');
const getbalances = require('./ionia_methods/balances/balances').getbalances;

const app = new koa();

// error handler (should be bind first)
app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message
        };

        console.log(err);
    }
});

app.use(bodyParser({
    extendTypes: {
        json: ['application/json-rpc']
    }
}));

app.use(methods.app());

const PORT = 3000;

app.listen(PORT);
console.log(`Ionia API server running at ${PORT}`);