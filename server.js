const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const fs    = require('fs')
const passport = require('koa-passport')
const session = require('koa-session')
module.exports = passport
const jsonRpc = require('./methods')
require('./mongo/index')

const db = require('./db_connection')

const app = new koa()
require('./ionia_modules/auth')
app.keys = ['secret']
app.use(session({}, app))
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser({
    extendTypes: {
        json: ['application/json-rpc'] // will parse application/x-javascript type body as a JSON string 
      }
}))

app.use(jsonRpc.app())

const PORT = 3000
app.listen(PORT)
console.log(`Ionia API server running at ${PORT}`)