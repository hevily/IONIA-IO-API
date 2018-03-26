const Router = require('koa-router');
const authRouteObject = {};
const auth = new Router();
authRouteObject.passport = undefined;

authRouteObject.setPassport = function(passport) {
  authRouteObject.passport = passport;
}

auth.post('/login', async (ctx, next) => {
  return authRouteObject.passport.authenticate('local', (err, user) => {
    if (user) {
      ctx.login(user);
      ctx.redirect('/app');
      // ctx.body = 'kakakakaka success!!';
    } else {
      ctx.redirect('/');
    }
  })(ctx);
})

auth.get('/logout', function(ctx) {
  ctx.logout()
  ctx.redirect('/')
})

auth.post('/register', function(ctx) {
  ctx.type = 'json'
  ctx.body = ctx.request.body
})

authRouteObject.auth = auth;

module.exports = authRouteObject;