const sha512 = require('sha512');

function sha512(key, data) {
    const hasher = sha512.hmac(key);
    return hasher.finalize(data).toString('hex');
}