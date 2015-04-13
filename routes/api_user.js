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
	User.findOne({ username: req.params.username }, function(err, user) {
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

// user receives 1
router.route('/upbit/:username').get(function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
        return res.send(err);
    }
    user.bits += "1"; //add a 1 to the bits
    user.ones += 1;  //increase the number of ones by one
    user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        console.log ("User, \"" + user.username + "\", received one upbit.");
        res.json({ status: 'success', message: "User " + req.params.username + " recieved one upbit" });
    });
  });
});

// user receives 0
router.route('/downbit/:username').get(function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
        return res.send(err);
    }
    user.bits += "0"; //add a 0 to the bits
    user.zeros += 1;  //increase the number of zeros by one

    // save the user
    user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        console.log ("User, \"" + user.username + "\", received one downbit.");
        res.json({ status: 'success', msg: "User " + req.params.username + " recieved one downbit" });
    });
  });
});

//resets bits for a user
router.route('/resetbits/:username').get(function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
        return res.send(err);
    }
    user.bits = "";
    user.zeros = 0;
    user.ones = 0;

    // save the user
    user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        console.log ("User, \"" + user.username + "\", reset their bits.");
        res.json({ status: 'success', msg: "User " + req.params.username + " reset bit information." });
    });
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
