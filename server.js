const koa = require('koa');
const koaRouter = require('koa-router');
const routesV1 = require('./routes/v1/index');

const app = new koa();
const router = new koaRouter();

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
    }
});

router.use('/v1', routesV1.routes());
app.use(router.routes());

const PORT = 3000;

app.listen(PORT);
console.log(`Ionia API server running at ${PORT}`);