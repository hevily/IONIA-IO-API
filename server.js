const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const fs    = require('fs')
const passport = require('koa-passport')
const session = require('koa-session')
const finder = require('fs-finder')
const jsonRpc = require('./common/modules/jsonRpc')
const privacy = require('./privacy.json')
const db = require('./common/modules/db')

const app = new koa()
require('./common/modules/auth')
app.keys = [privacy.SECRET_KEY]
app.use(session({}, app))
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser({
    extendTypes: {
        json: ['application/json-rpc']
      }
}))

app.use(cors())

// bind methods
module.exports = passport
const methodDirectories = finder.in('./methods').findDirectories()

for(const methodDirectory of methodDirectories) {
    const splitedPath = methodDirectory.split('/')
    const prefix = splitedPath[splitedPath.length - 1]
    const files = finder.in(methodDirectory).findFiles()

    for(const file of files) {
        const functions = require(file)
        const functionNames = Object.keys(functions)
        

        for(const functionName of functionNames) {
            console.log(`${prefix}_${functionName}`)
            jsonRpc.registMethod(`${prefix}_${functionName}`, functions[functionName])
        }
    }
}

app.use(jsonRpc.app())

const PORT = 3000
app.listen(PORT)
console.log(`Ionia API server running at ${PORT}`)