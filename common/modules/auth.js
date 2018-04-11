const passport = require('koa-passport')
const mongo = require('mongoose')
const bcrypt = require('bcrypt')

//
// User serialization
//
passport.serializeUser(function(user, done) {
  console.log('\n\n\nSerializing: %s\n\n\n\n', user)
  done(null, user._id)
})

//
// User deserialization
//
passport.deserializeUser(function(id, done) {
  console.log('\nDeserializing: %s\n\n', id)
  const User = mongo.model('User')
  User.findOne({ _id: id }, function (err, user) {
      if (err) {
          console.log('ERR: ', err)
          done(err)
      } else {
          done(null, user)
      }
  })
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },function(ctx, email, password, done) {
    const User = mongo.model('User')
    console.log(email, password)
    User.findOne({ 'email': email }, function (err, profile) {
        const user = profile
        if (err) {
          console.log(500 + 'Some error occur')
          done(err)
          return
        }
        if (!user) {
          console.log(400 + 'User not find')
          done(null, false)
          return
        }

        // verify password
        if (!bcrypt.compareSync(password, user.password)) {
          console.log('\n\nFound UNauthenticated user ( Password ): %s', user)
          done(null, false)
        } else if (email !== user.email) {
          console.log('\n\nFound UNauthenticated user ( Email ): %s', user)
          done(null, false)
        }else {
          console.log('ionia-user : ', user)
          user.password = undefined
          done(null, user)
        }
    })
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
      console.log(user)
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
      console.log(user)
      done(null, user)
    })
  }
))

function makeAuthCode() {
  const ALPHABET = 0, NUMBER = 1
  let authCode = ''

  for(let i = 0; i < 6; i++) {
      const alphabetOrNumber = Math.floor((Math.random() * 2))

      if(alphabetOrNumber === ALPHABET) {
          authCode += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))
      }
      else {
          authCode += Math.floor(Math.random() * 10)
      }
  }

  return authCode
}


exports.makeAuthCode = makeAuthCode