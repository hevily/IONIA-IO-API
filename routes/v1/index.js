var express = require('express');
var router = express.Router();

var account = require('../../controllers/v1/account/account');

router.get('/', function(req, res, next) {
  res.send('version 1');
});

router.get('/account/getbalances', function(req, res, next) {
  var callback = function(result) {
    res.json(result);
  };
  
  account.getbalances(req, callback);
});

module.exports = router;
