/**
 * Created by Katamori on 2015.12.16..
 */

/*
 Client-server router
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	//res.render('domaintest', { title: 'Domaintest' });
	console.log('domaintest.js')
	res.send('domaintest.js')
});

router.post('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var sent = req.body;

    switch (req.body.source){

        case "/ytapp":

            var GetRelated = require("./serverside/ytapp_getrelated.js");
            var FrontQuery = require("./serverside/ytapp_frontquery.js");

            console.log(req.body.task);

            switch(req.body.task) {
/*
                case "getrelated":

                    //first aka initial request; sends the chosen link to server
                    GetRelated.YTAPP_GetRelated(
                        req.body,
                        res,
                        GetRelated.YTAPP_Callback_LoadData);

                    break;
*/
                case "expand":

                    FrontQuery.YTAPP_Expand(req.body, GetRelated.YTAPP_Callback_LoadData);

                    break;

                case "display_db":

                    FrontQuery.YTAPP_GetDatabase(req.body);

                    break;

                case "autocomplete_db":

                    FrontQuery.YTAPP_WriteVideoData(req.body);

                    break;

            };

            break;

    };

});


module.exports = router;
