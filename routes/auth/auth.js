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
  console.log(ctx.mongo);
  ctx.type = 'json'
  ctx.body = ctx.request.body
})

authRouteObject.auth = auth;

module.exports = authRouteObject;