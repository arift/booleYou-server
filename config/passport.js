var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {

    passport.use(new LocalStrategy(
            function (username, password, done) {
                // search for the user in the database
                User.find({user_name: username, password : password}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if(user[0] == null)
                        return done(err);
                    else {
                        return done(undefined, user);
                    }
                });
            })
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
}
