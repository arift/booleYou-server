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

//adds a new user
router.route('/users').post(function(req, res) {
  	var user = new User(req.body);
 
  	user.save(function(err) {
    	if (err) {
      		return res.send(err);
    	}
 		console.log ("User \"" + user.user_name + "\" added.");
    	res.send({ msg: 'success' });
  	});
});

//updates a specific user
router.route('/users/:id').put(function(req,res){
	User.findOne({ _id: req.params.id }, function(err, user) {
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
		  	console.log ("User, \"" + user.user_name + "\", updated.");
	  		res.json({ msg: 'success' });
		});
	});
});

//returns a specific user
router.route('/users/:id').get(function(req, res) {
  	User.findOne({ _id: req.params.id}, function(err, user) {
    	if (err) {
      		return res.send(err);
    	}
 
    	res.json(user);
  	});
});

//deletes a specific user
router.route('/users/:id').delete(function(req, res) {
	User.remove({
    	_id: req.params.id
  	}, function(err, movie) {
    	if (err) {
      		return res.send(err);
    	}
 
    	res.json({ message: 'Successfully deleted' });
  	});
});

router.route('/users').delete(function(req, res) {
    User.remove({
      _id: req.params.id
    }, function(err, movie) {
      if (err) {
        return res.send(err);
      } 
      res.json({ message: 'Successfully deleted' });
    });
});

//returns ALL of the booleOuts
router.route('/booleOuts').get(function(req, res) {
  BooleOut.find(function(err, booleOuts) {
    if (err) {
      return res.send(err);
      } 

      res.json(booleOuts);
    });
});

//adds a new booleOut
router.route('/booleOuts').post(function(req, res) {
    var booleOut = new BooleOut(req.body);
 
    booleOut.save(function(err) {
      if (err) {
          return res.send(err);
      }
    console.log ("BooleOut \"" + booleOut.user_name + "\" added \"" + booleOut.bit + " " + booleOut.hashtag + "\"");
      res.send({ message: 'booleOut Added' });
    });
});

//returns a specific booleOut
router.route('/booleOuts/:id').get(function(req, res) {
    BooleOut.findOne({ _id: req.params.id}, function(err, booleOut) {
      if (err) {
          return res.send(err);
      }
 
      res.json(booleOut);
    });
});

//deletes a specific booleOut
router.route('/booleOuts/:id').delete(function(req, res) {
  BooleOut.remove({
      _id: req.params.id
    }, function(err, movie) {
      if (err) {
          return res.send(err);
      }
 
      res.json({ message: 'Successfully deleted' });
    });
});

module.exports = router;