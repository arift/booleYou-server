var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
console.log("user_name: " + config.dbSettings.user_name);
console.log("password: " + config.dbSettings.password);

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

app.use('/', routes);
app.use('/users', users);

//MongoDB settings
var mongooseOptions = {
    server: { 
        socketOptions: {
            keepAlive: 1
        } 
    },
    user: config.dbSettings.user_name,
    pass: config.dbSettings.password
}
var dbURI = "ds045679.mongolab.com:45679/booledb";

mongoose.connect(dbURI, mongooseOptions);


//some test code for mongodb
var userSchema = mongoose.Schema({
    user_name: String,
    user_pass: String,
    signup_date: {
        type: Date,
        default: Date.now
    },
    admin: Boolean,
    bits: Number
});

var User = mongoose.model('User', userSchema);

var arif = new User ({
    user_name: "420noscope4jesus",
    user_pass: "testing",
    admin: true,
    bits: 1024
});

arif.save(function (err, fluffy) {
  if (err) return console.error(err);
  console.log(arif.user_name + " is saved.");
});
////




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
