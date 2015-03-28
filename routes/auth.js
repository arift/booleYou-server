var express = require('express');
var router = express.Router();
var passport = require('passport');

//new user signup
router.post('/signup', passport.authenticate('local-signup', {
        // successRedirect : '/',
        // failureRedirect : '/',
        failureFlash : false // allow flash messages
}));

router.post('/login', passport.authenticate('local-login'),
	function(req, res) {
		console.log("setting status 200");
		res.status(200);
		res.end();

	});

// logout by destroying session
router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;