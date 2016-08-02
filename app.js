var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//require condition for sub-domains
var routes = require('./routes/index');
var domaintest = require('./routes/domaintest');
var ytapp = require('./routes/ytapp');


//creating server itself
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
