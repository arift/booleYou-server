var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BooleOut = require('../models/booleOut');
var Hashtag = require('../models/hashtag');

//returns a hashtag object
router.route('/getbyhashtag/:hashtag').get(function(req, res) {
    Hashtag.findOne({ hashtag: req.params.hashtag}, function(err, hashtag) {
      if (err) {
          return res.send(err);
      }
      res.json(hashtag);
    });
});

//returns hashtags by a user
router.route('/getbyuser/:username').get(function(req, res) {
    Hashtag.find({ usernames: req.params.username}, function(err, hashtags) {
      if (err) {
          return res.send(err);
      }
      res.json(hashtags);
    });
});


//returns all hashtags
router.route('/trending').get(function(req, res) {
    Hashtag.find({}, function(err, hashtags) {
        if (err) {
            return res.send(err);
        }
        console.log(hashtags);

        res.json(hashtags);
    });
});

module.exports = router;