const passport = require('koa-passport')
const mongo = require('mongoose')

// const fetchUser = (() => {
//   // This is an example! Use password hashing in your project and avoid storing passwords in your code
//   const user = { id: 1, email: 'arnold.yoo@findexchain.com', password: '1' }
//   return async function() {
//     return user
//   }
// })()

// passport.serializeUser(function(user, done) {
//   done(null, user.id)
// })

// passport.deserializeUser(async function(id, done) {
//   try {
//     const user = await fetchUser()
//     done(null, user)
//   } catch(err) {
//     done(err)
//   }
// })


//
// User serialization
//
passport.serializeUser(function(user, done) {
  console.log('\n\n\nSerializing: %s\n\n\n\n', user);
  done(null, user._id);
});

//
// User deserialization
//
passport.deserializeUser(function(id, done) {
  console.log('\nDeserializing: %s\n\n', id);
  const User = mongo.model('User');
  User.findOne({ _id: id }, function (err, user) {
      if (err) {
          console.log('ERR: ', err);
          done(err);
      } else {
          done(null, user);
      }
  });
});

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },function(ctx, email, password, done) {
    const User = mongo.model('User');
    User.findOne({ 'email': email }, function (err, profile) {
        // error checking on lookup
        const user = profile;
        console.log(user);
        if (err) {
            console.log('ERR: ', err);
            done(err);
            return;
        }

        if (email === user.email && password === user.password) {
          console.log('ionia-auth : ', user);
          user.password = undefined;
          done(null, user)
        } else {
          done(null, false)
        }
    });
  })
)

const FacebookStrategy = require('passport-facebook').Strategy
passport.use(new FacebookStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
))

const TwitterStrategy = require('passport-twitter').Strategy
passport.use(new TwitterStrategy({
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => { 
      console.log(user);
      done(null, user)
    })
  }
))

const GoogleStrategy = require('passport-google-auth').Strategy
passport.use(new GoogleStrategy({
    clientId: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => { 
      console.log(user);
      done(null, user)
    })
  }
))
