const jwt = require('jsonwebtoken')
const privacy = require('../../privacy.json')
const crypto = require('./crypto')


function makeAuthCode() {
    const ALPHABET = 0, NUMBER = 1
    let authCode = ''
    
    for(let i = 0; i < 6; i++) {
        const alphabetOrNumber = Math.floor((Math.random() * 2))
        
        if(alphabetOrNumber === ALPHABET) {
            authCode += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))
        }
        else {
            authCode += Math.floor(Math.random() * 10)
        }
    }

    return authCode
}

function encryptPassword(password) {
    return crypto.hmac('SHA256', privacy.SECRET_KEY, password)
}

function issueToken(data, expireMinutes = 0) {
    const options = {}

    if(expireMinutes > 0) {
        options.expiresIn = `${expireMinutes}m`
    }

    return jwt.sign(data, privacy.SECRET_KEY, options)
}



exports.makeAuthCode = makeAuthCode
exports.encryptPassword = encryptPassword
exports.issueToken = issueToken