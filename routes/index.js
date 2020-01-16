//note: "npm start" in PuTTY to make the server run

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('Katamori`s Javascript World')
	res.send('index.js')
});

module.exports = router;
