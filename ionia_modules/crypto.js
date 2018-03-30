const package_sha512 = require('sha512');
const sha = require("jssha");
const package_sha256 = require('js-sha256').sha256;
const package_base64 = require('js-base64').Base64;
const cryptojs = require("crypto-js");
const querystring = require('querystring');

// TODO: jssha로 모두 처리하도록 수정

function sha512_hmac(key, data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }

    const hasher = package_sha512.hmac(key);
    return hasher.finalize(data).toString('hex');
}

function sha384_hmac(key, data) {
    const shaObject = new sha('SHA-384', 'TEXT');
    
    shaObject.setHMACKey(key, 'TEXT');
    shaObject.update(data);
    
    return shaObject.getHMAC('HEX');
}

function sha256_hmac(key, data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }

    return package_sha256.hmac(key, data);
}

function md5(data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }
    console.log(data);
    return cryptojs.MD5(data).toString();
}

function md5_hmac(key, data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }

    return cryptojs.HmacMD5(data, key).toString();
}

exports.sha512_hmac = sha512_hmac;
exports.sha256_hmac = sha256_hmac;
exports.sha384_hmac = sha384_hmac;
exports.md5_hmac = md5_hmac;
exports.md5 = md5;
exports.base64 = package_base64;