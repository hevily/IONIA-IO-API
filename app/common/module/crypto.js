const package_sha512 = require('sha512');
const package_sha256 = require('js-sha256').sha256;
const package_base64 = require('js-base64').Base64;
const querystring = require('querystring');

function sha512_hmac(key, data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }

    const hasher = package_sha512.hmac(key);
    return hasher.finalize(data).toString('hex');
}

function sha256_hmac(key, data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }

    return package_sha256.hmac(key, data);
}

exports.sha512_hmac = sha512_hmac;
exports.sha256_hmac = sha256_hmac;
exports.base64 = package_base64;