/**
 * Created by hugo on 3/4/15.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');


router.route('/login').post(function(req, res, next) {
    if(req.isAuthenticated()) {
        res.json({
            'msg': 'already authenticated!',
            'user': req.user
        });
        return;
    } else if(!req.body.username || !req.body.password) {
        res.json({
            'msg': 'enter username and password!'
        });
        return;
    }

    // authenticate using passport middleware
    passport.authenticate('local', function(err, user, info) {
        if(err) return next(err);
        else if(!user) {
            res.json({
                'msg': 'failure to authenticate, asked user does not exist!'
            });
            return;
        }

        req.login(user, function(err) {
            if(err)
                return next(err);

            res.json({
                'msg': 'successfully logged in!',
                'user': req.user
            });

            return;
        });
    })(req, res, next);
});

// logout by destroying session
router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;