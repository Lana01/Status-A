//var users = require('./routes/users');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes/index');
var scribe = require('scribe-js')();
var ldap = require('ldapjs');
var React = require('react');
var nodemailer = require('nodemailer');
var aop = require("node-aop");// Node.js require. Use window.aop in browser
var Database = require('./modules/Database/Database');
var i18n = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: ['en', 'de']
});

Database.connectToDatabase();

/*
**************TO-DO******************
* jsreport
* handlebars
* broadway plugin framework
* electrolyte
* node-cache caching framework
* restify REST framework
 */

var app = express();

app.use(scribe.express.logger()); //Log each request
app.use('/logs', scribe.webPanel());//Access logs at http://localhost:5000/logs

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
//app.use('/users', users);

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

//**********************Include various modules from different groups here******************************

var AppraisalType = require('./modules/Status/test');

test

//**********************Include various modules from different groups here******************************

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Node server running on port: " + port);
});

module.exports = app;
