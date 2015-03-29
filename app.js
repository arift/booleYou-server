var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var routes = require('./routes/index');
var auth = require('./routes/auth');
var configPassport = require('./config/passport');
var api_user = require('./routes/api_user');
var api_booleout = require('./routes/api_booleout');

var app = express();
var useConfig = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret stuff',
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
configPassport(passport);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/api/user', isAuthenticated, api_user);
app.use('/api/booleout', isAuthenticated, api_booleout);

//MongoDB settings
var dbUsername;
var dbPass;
fs.exists('./config.js', function(exists) {
    if (exists) {
        useConfig = true;
        console.log("Using variables from config.js");
        var config = require('./config');
        dbUsername = config.dbSettings.user_name;
        dbPass = config.dbSettings.password;
    }
    else {
        useConfig = false;
        console.log("No config file. Using environment variables instead.");
        dbUsername = process.env.DB_USERNAME;
        dbPass = process.env.DB_PASS;
    }
    var mongooseOptions = {
    server: { 
        socketOptions: {
            keepAlive: 1
        } 
    },
    user: dbUsername,
    pass: dbPass
    }
    var dbURI = "ds053139.mongolab.com:53139/booledb";
    mongoose.connect(dbURI, mongooseOptions);
});



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

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401);
}


module.exports = app;
