var express = require('express');
var router = express.Router();
var passport = require('passport');

//new user signup
router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : false // allow flash messages
}));

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // success
        failureRedirect : '/', // fail
        failureFlash : false // allow flash messages
}));

// logout by destroying session
router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;