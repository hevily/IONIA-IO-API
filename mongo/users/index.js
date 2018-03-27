const mongo = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://ionia:ionia@127.0.0.1:27017/ionia";

mongo.connect(MONGO_URL);
var db = mongo.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('mongoDB connection open.');
});

const User = mongo.model('User', require('./model.js'), 'users');