var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

//require condition for sub-domains
var routes = require('./routes/index');
var domaintest = require('./routes/domaintest');
var ytapp = require('./routes/ytapp');


//creating server itself
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Rothens elmagyarázta:
/*ez annyit tud, hogy az url/ az a routes-nek megfelelő js-re fog továbbdobni, az url/users meg
a users-re; ez kb úgy működik majd, hogy van ugye a domained ami katamori.rothens.me - ha ezután
írsz valami útvonalat akkor ezekből megkeresi a cucc azt, amelyik a legközelebb áll hozzá, tehát
ha van /lofasz, /lofasz2 és /, akkor a katamori.rothens.me/lofasz az az elsőre fog továbbítani
a katamori.rothens.me/kispirics az meg a /-re*/

app.use('/', routes);
app.use('/domaintest', domaintest);
app.use('/ytapp', ytapp);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.log(err.message)
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message)
});

const server = app.listen(7776, function () {
	var host = server.address().address
	var port = server.address().port
	
	console.log("Example app listening at http://%s:%s", host, port)
 })

module.exports = app;
