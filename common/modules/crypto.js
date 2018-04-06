const cryptojs = require("crypto-js")
const querystring = require('querystring')
const jwt = require('jsonwebtoken')


function hmac(hashName, key, data) {
    if(typeof(data) === 'object') {
        data = querystring.stringify(data)
    }

    switch(hashName.toLowerCase()) {
        case 'sha256':
            return cryptojs.HmacSHA256(data, key).toString()
        case 'sha384':
            return cryptojs.HmacSHA384(data, key).toString()
        case 'sha512':
            return cryptojs.HmacSHA512(data, key).toString()
        case 'md5':
            return cryptojs.HmacMD5(data, key).toString()
        case 'hs256':
            return jwt.sign(querystring.parse(data), key, {algorithm: 'HS256'})
        default:
            throw `${hashName} not found!`
    }
}

function hash(hashName, data) {
    if(typeof(data) === 'object') {
        data = querystring.stringify(data)
    }

    switch(hashName.toLowerCase()) {
        case 'sha256':
            return cryptojs.SHA256(data).toString()
        case 'sha384':
            return cryptojs.SHA384(data).toString()
        case 'sha512':
            return cryptojs.SHA512(data).toString()
        case 'md5':
            return cryptojs.MD5(data).toString()
        case 'base64':
            return cryptojs.enc.Base64(data).toString()
        default:
            throw `${hashName} not found!`
    }
}

function encode(encodeName, data) {
    switch(encodeName.toLowerCase()) {
        case 'base64':
            const wordArray = cryptojs.enc.Utf8.parse(data)
            return cryptojs.enc.Base64.stringify(wordArray).toString()
        default:
            throw `${encodeName} not found!`
    }
}

exports.hmac = hmac
exports.hash = hash
exports.encode = encode