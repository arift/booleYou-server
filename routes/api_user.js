var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BooleOut = require('../models/booleOut');
var Picture = require('../models/picture');
//returns ALL of the users
router.route('/users').get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            return res.send(err);
        }
        res.json(users);
    });
});

//updates password. expect newPassword in the body
router.route('/changepass/:username').post(function(req,res){
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
        return res.send(err);
    }
    user.password = user.generateHash(req.body.newPassword);

    // save the user
    user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        console.log ("User " + user.username + " changed their password.");
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
    	res.json(user);
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

//resets everyone's bits
router.route('/resetbits/').post(function(req, res) {
  if (req.body.secret === "resetbits") {
    User.find(function(err, users) {
        if (err) {
            return res.send(err);
        }
        for (var i = 0; i < users.length; i++) {
          users[i].bits = "";
          users[i].zeros = 0;
          users[i].ones = 0;
          users[i].save();
        }
        console.log ("ALL user bits are reset.");
        res.json({ status: 'success', msg: "ALL user bits are reset." });
    });
  }
  else {
    res.json({ status: 'failure', msg: "set secret param to resetbits" });
  }
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

//adds a pro pic
router.route('/addpropic/:username').post(function(req, res) {
  Picture.findOne({ username: req.params.username }, function(err, picture) {
    if (err) {
        return res.send(err);
    }
    //check if the user already has a picture
    if(picture) {
      picture.picture = req.body.picture;
    }
    else {
      var picture = new Picture(req.body);
    }
    picture.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json(picture);
    });
  });
});

//gets the picture object for the give usernmae
router.route('/getpropic/:username').get(function(req, res) {
  Picture.findOne({ username: req.params.username }, function(err, picture) {
    if (err) {
        return res.send(err);
    }
    res.json(picture);
  });
});

//deletes a pro pic
router.route('/deletepropic/:username').delete(function(req, res) {
  Picture.remove({ username: req.params.username }, function(err, data) {
    res.send(data);
  });
});

module.exports = router;
