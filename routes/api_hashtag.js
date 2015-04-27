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

router.route('/getbooleoutsbyhashtag/:hashtag').get(function(req, res) {
  Hashtag.findOne({ hashtag: req.params.hashtag}, function(err, hashtag) {
      if (err) {
          return res.send(err);
      }
      if (!hashtag || !hashtag.booleOuts) return res.send(false);
      var inQuery = {$in:hashtag.booleOuts};
      var query = BooleOut.find({'_id': inQuery}).sort({'_id' : -1}).limit(50);
      query.exec(function(err, booleOuts) {
        if (err) {
          return res.send(err);
          }
          res.json(booleOuts);
      });
  });
});

//returns trending hashtags
router.route('/trending').get(function(req, res) {
    var query = Hashtag.find({hashtag: {$ne: ""}}).sort({totalbits : -1});
    query.exec(function(err, hashtags) {
        if (err) {
            return res.send(err);
        }
        res.json(hashtags);
    });
});

module.exports = router;