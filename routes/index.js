//note: "npm start" in PuTTY to make the server run

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Katamori`s Javascript World'  });
});

module.exports = router;
