var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BooleOut = require('../models/booleOut');
//returns ALL of the users
router.route('/users').get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            return res.send(err);
        }

        res.json(users);
    });
});

//updates a specific user
router.route('/users/:username').put(function(req,res){
	User.findOne({ _id: req.params.username }, function(err, user) {
		if (err) {
		  	return res.send(err);
		}

		//update user
		for (change in req.body) {
		  	user[change] = req.body[change];
		}

		// save the user
		user.save(function(err) {
		  	if (err) {
		    	return res.send(err);
		  	}
		  	console.log ("User, \"" + user.username + "\", updated.");
	  		res.json({ msg: 'success' });
		});
	});
});

//returns a specific user
router.route('/users/:username').get(function(req, res) {
  	User.findOne({ username: req.params.username}, function(err, user) {
    	if (err) {
      		return res.send(err);
    	}
 
    	res.json(user);
  	});
});

//deletes a specific user
router.route('/users/:username').delete(function(req, res) {
	User.remove({
    	username: req.params.username
  	}, function(err, data) {
    	if (err) {
      		return res.send(err);
    	}
 
    	res.json({ message: 'Successfully deleted' });
  	});
});

module.exports = router;