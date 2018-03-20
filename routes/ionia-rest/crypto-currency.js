const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id;
  const resObj = {
    id: id,
    uri: 'cryptoc',
    method: 'get'
  }
  res.json(resObj);
});

router.post('/', function(req, res, next) {
  const parmas = req.body.data;
});


module.exports = router;
