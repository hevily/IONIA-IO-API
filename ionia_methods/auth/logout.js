function logout(ctx, params) {
    ctx.logout();
    ctx.redirect('/');
}

exports.logout = logout;