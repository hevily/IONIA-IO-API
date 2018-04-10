const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const fs    = require('fs')
const passport = require('koa-passport')
const session = require('koa-session')
const finder = require('fs-finder')
const jsonRpc = require('./common/modules/jsonRpc')
require('./mongo')
const db = require('./common/modules/db')

const app = new koa()
require('./common/modules/auth')
app.keys = ['secret']
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

function findAndRegistMethods(methodDirectories) {
    for(let i = 0; i < methodDirectories.length; i++) {
        const methodDirectory = methodDirectories[i]
        const splitedPath = methodDirectory.split('/')
        const prefix = splitedPath[splitedPath.length - 1]

        const files = finder.in(methodDirectory).findFiles()
        const directories = finder.in(methodDirectory).findDirectories()

        for(let j = 0; j < files.length; j++) {
            const file = require(files[j]);
            const functionNames = Object.keys(file)

            for(let k = 0; k < functionNames.length; k++) {
                const functionName = functionNames[k]
                jsonRpc.registMethod(`${prefix}_${functionName}`, file[functionName])
            }
        }

        if(directories.length > 0) {
            findAndRegistMethods(directories)
        }
    }
}

findAndRegistMethods(methodDirectories)
app.use(jsonRpc.app())

const PORT = 3000
app.listen(PORT)
console.log(`Ionia API server running at ${PORT}`)