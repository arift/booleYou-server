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
	  		res.json(user);
		});
	});
});

//returns a specific user
router.route('/users/:username').get(function(req, res) {
  	User.findOne({ username: req.params.username}, function(err, user) {
    	if (err) {
      		return res.send(err);
    	}
    	res.json({user:user});
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

//User 'username' follows 'followed'
router.route('/:username/follow/:followed').get(function(req, res) {
  //find the first user that's following
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
        return res.send(err);
    }
    if (user === null) {
      console.log("user " + req.params.username + " not found.");
      return res.send ('user not found.');
    }
    //find the second user that's being followed
    User.findOne({ username: req.params.followed }, function(err, followed) {
      if (err) {
          return res.send(err);
      }
      if (followed === null) {
        console.log("user " + req.params.followed + " not found.");
        return res.send ('user not found.');
      }
      //check to see if user is already being followed
      if (user.following.indexOf(followed.username) > -1) {
        console.log("user " + req.params.username + " is already following" + req.params.followed);
        return res.json ({user: user});
      }
      //follow user
      else {
        user.following.push(followed.username);
        followed.followedby.push(user.username);
        user.save(function(err) {
            if (err) {
              return res.send(err);
            }
            followed.save(function(err) {
                if (err) {
                  return res.send(err);
                }
                console.log ("User, \"" + user.username + "\", is now following " + followed.username);
                res.json({ user: user });
            });
        });
      }
    });
  });
});

//User 'username' unfollows 'followed'
router.route('/:username/unfollow/:followed').get(function(req, res) {
  //find the first user that's following
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
        return res.send(err);
    }
    if (user === null) {
      console.log("user " + req.params.username + " not found.");
      return res.send ('user not found.');
    }
    //find the second user that's being followed
    User.findOne({ username: req.params.followed }, function(err, followed) {
      if (err) {
          return res.send(err);
      }
      if (followed === null) {
        console.log("user " + req.params.followed + " not found.");
        return res.send ('user not found.');
      }
      var followingIndex = user.following.indexOf(followed.username);
      var followedbyIndex = followed.followedby.indexOf(user.username);

      if (followingIndex > -1) {
        user.following.splice(followingIndex, 1);
      }
      if(followedbyIndex > -1) {
        followed.followedby.splice(followedbyIndex, 1);
      }
      user.save(function(err) {
          if (err) {
            return res.send(err);
          }
          followed.save(function(err) {
              if (err) {
                return res.send(err);
              }
              console.log ("User, \"" + user.username + "\", is unfollowed " + followed.username);
              res.json({ user: user });
          });
      });
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
