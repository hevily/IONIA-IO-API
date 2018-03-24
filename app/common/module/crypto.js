const package_sha512 = require('sha512');
const querystring = require('querystring');

function sha512(key, data) {
    if(typeof(data) === "object") {
        data = querystring.stringify(data);
    }

    const hasher = package_sha512.hmac(key);
    return hasher.finalize(data).toString('hex');
}

exports.sha512 = sha512;