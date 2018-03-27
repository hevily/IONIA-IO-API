const passport = require('../../server');

async function login(ctx, params) {
    let userResult;
    ctx.request.body.email = params.email;
    ctx.request.body.password = params.password;
    await passport.authenticate('local', (err, user) => {
        if (user) {
            ctx.login(user);
            userResult = user;
        } else {
            console.log('err', err);
        }
    })(ctx);
    return userResult;
}

exports.login = login;