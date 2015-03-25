var express = require('express');
var router = express.Router();
var passport = require('passport');


router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // success
        failureRedirect : '/', // fail
        failureFlash : true // allow flash messages
}));

// logout by destroying session
router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;