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

router.post('/login', passport.authenticate('local-login'),
	function(req, res) {
		console.log("setting status 200");
		res.status(200);
		res.json(req.user);
		res.end();
	}
);

// logout by destroying session
router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;