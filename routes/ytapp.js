/**
 * Created by Katamori on 2016.02.16..
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('ytapp', { title: 'Domaintest' });
});

module.exports = router;