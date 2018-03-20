var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var cors = require('cors');
var domain = require('express-domain-middleware');

var index = require('./routes/index');
var searchApis = require('./routes/ionia-rest/search');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cors()); //cors setting middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(domain);


// Routing apis
app.use('/', index);
app.use('/api/search', searchApis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function errorHandler(err, req, res, next) {
  console.log('--------------------------------------------------------------------------\n');
  console.log(err);
  console.log('--------------------------------------------------------------------------\n');
  console.log('error on request %s | %s | %d', req.method, req.url, err.status);
  console.log('\n' + err.stack);
  err.message = err.status == 500 ? 'Something bad happened. :(' : err.message;
  if (err.status != 404) {
      var errordata = 'error status : ' + err.status + ' , error on request :  ' + process.domain.id + req.method + req.url + '   ,   error message : ' + err.message;
      res.send('Internal Server Error' + err.status);
  }else{
      res.send('page not found Server Error' + err.status);
  }
});

/**
 * create server & server running
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Ionia Wallet server running at ' + app.get('port'));
});

module.exports = app;
