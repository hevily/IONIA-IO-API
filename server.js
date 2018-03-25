const koa = require('koa');
const jsonRpc = require('./methods');
const getbalances = require('./ionia_methods/balances/balances').getbalances;

const app = new koa();

// error handler (should be bind first)
app.use(async(ctx, next) => {
    try {
        await next();
        
        if(ctx.body === undefined) {
            throw {
                message: 'Unknown Service.'
            }
        }
    } catch (err) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message
        };

        console.log(err);
    }
});

app.use(jsonRpc.app());

const PORT = 3000;

app.listen(PORT);
console.log(`Ionia API server running at ${PORT}`);