const Router = require('koa-router');
const mongo = require('mongoose')
const bcrypt = require('bcrypt');
const authRouteObject = {};
const auth = new Router();
const salt = 10;
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
      console.log('here ??', err);
      ctx.redirect('/');
    }
  })(ctx);
})

auth.get('/logout', function(ctx) {
  ctx.logout()
  ctx.redirect('/')
})

auth.post('/register', function(ctx) {
  const params = ctx.request.body
  if (!params.email) {
    console.log(400+' : email required')
    return;
  }

  if (!params.password) {
    console.log(400+' : password required')
    return;
  }

  const User = mongo.model('User');
  const newUser = User.create({
      email: params.email,
      password: bcrypt.hashSync(params.password, salt)
  });

  if (!newUser) {
    ctx.throw (409, 'The email has all ready been registered.');
    return;
  }

  ctx.redirect('/');
})

authRouteObject.auth = auth;

module.exports = authRouteObject;