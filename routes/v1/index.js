var express = require('express');
var router = express.Router();

var account = require('../../controllers/v1/account/account');

router.get('/', function(req, res, next) {
  res.send('version 1');
});

router.get('/account/getbalances', function(req, res, next) {
  var result = account.getbalances(req);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});

module.exports = router;
