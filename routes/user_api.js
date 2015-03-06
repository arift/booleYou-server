var express = require('express');
var router = express.Router();
var User = require('../models/user');
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
    	res.send({ message: 'User Added' });
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
	  		res.json({ message: 'User updated!' });
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
    // This is how you check if the user logged in
    if(req.user) {
        User.remove({}, function (err, users) {
            if (err) {
                return res.send(err);
            }

            res.json(users);
        });
        return ;
    };

    res.json({
        'msg': 'Please log into remove all the users!'
    });
    return;
});

module.exports = router;