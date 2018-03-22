const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const http = require('http');
const cors = require('cors');
const domain = require('express-domain-middleware');

// api services
const routesIndex = require('./routes/index');
const routesV1 = require('./routes/v1/index');


const app = express();

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
app.use('/', routesIndex);
app.use('/v1', routesV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
      const errordata = 'error status : ' + err.status + ' , error on request :  ' + process.domain.id + req.method + req.url + '   ,   error message : ' + err.message;
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
