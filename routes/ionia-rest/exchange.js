const express = require('express');
const router = express.Router();
const exchange = require('../../common/exchange/exchange');

router.post('/', function(request, response, next) {
  return exchange.exchangeHandler(request, response);
});

module.exports = router;
