const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id;
  res.send('Crypto Currency APIS  id : '+id);
});

router.post('/', function(req, res, next) {
  const parmas = req.body.data;
});


module.exports = router;
