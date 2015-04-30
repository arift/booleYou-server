var express = require('express');
var router = express.Router();
var passport = require('passport');

//new user signup
router.post('/signup', passport.authenticate('local-signup'),
	function(req, res) {
		console.log("setting status 200");
		res.status(200);
		res.end();
	}
);

router.post('/login', passport.authenticate('local-login'), // login user as a singleton object
	function(req, res) {
		console.log("setting status 200");
		res.status(200);
		res.json(req.user);
		res.end();
	}
);

// logout by destroying session
router.get('/logout', function(req, res) { // user object removed (logged out) on session termination
    req.logout();
    res.end();
});

module.exports = router;
