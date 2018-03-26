const koa = require('koa');
const fs    = require('fs')
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const jsonRpc = require('./methods');
const getbalances = require('./ionia_methods/balances/balances').getbalances;

require('./ionia-auth/ionia-auth');
const passport = require('koa-passport')
const session = require('koa-session')

// const app = new koa();
const app2 = new koa();
const app = new koa();

const router = new Router();

app2.keys = ['your-session-secret'];
app2.use(session({}, app2))
app2.use(passport.initialize())
app2.use(passport.session())
app2.use(bodyParser())


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


app2.use(async(ctx, next) => {
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

router.get('/', function(ctx) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('views/login.html')
})

router.get('/app', function(ctx) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('views/app.html')
})

router.get('/register', function(ctx) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('views/signup.html')
})


const authRoute = require('./routes/auth/auth');
authRoute.setPassport(passport)

router.use('/auth', authRoute.auth.routes()); 
app2.use(router.routes()).use(router.allowedMethods());
app2.listen(4000, () => {
    console.log('http rest server is listening to port 4000');
});

app.use(jsonRpc.app());
const PORT = 3000;
app.listen(PORT);
console.log(`Ionia API server running at ${PORT}`);