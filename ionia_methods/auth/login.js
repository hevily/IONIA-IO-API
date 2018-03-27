const passport = require('../../server');

async function login(ctx, params) {
    return passport.authenticate('local', (err, user) => {
        if (user) {
            ctx.login(user);
        } else {
            console.log('here ??', err);
        }
    })(ctx);
}

exports.login = login;