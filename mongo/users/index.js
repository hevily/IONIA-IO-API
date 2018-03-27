const mongo = require('mongoose');
const PRIVACY = require('./../../privacy.json');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = `mongodb://${PRIVACY.MONGODB.USERNAME}:${PRIVACY.MONGODB.PASSWORD}@127.0.0.1:${PRIVACY.MONGODB.PORT}/${PRIVACY.MONGODB.DB}`;

mongo.connect(MONGO_URL);
var db = mongo.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('mongoDB connection open.');
});

const User = mongo.model('User', require('./model.js'), 'users');