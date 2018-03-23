const package_sha512 = require('sha512');

function sha512(key, data) {
    const hasher = package_sha512.hmac(key);
    return hasher.finalize(data).toString('hex');
}

exports.sha512 = sha512;