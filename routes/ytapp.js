/**
 * Created by Katamori on 2016.02.16..
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log('Domaintest')
	res.send('ytapp.js')
});

module.exports = router;