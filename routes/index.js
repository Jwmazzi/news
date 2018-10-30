var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GDELT News', message: 'Go to /news for GDELT updates . . .' });
});

module.exports = router;
