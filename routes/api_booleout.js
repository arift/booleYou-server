var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BooleOut = require('../models/booleOut');

var N = 50;

//returns last N of the booleOuts in newest to oldest
router.route('/booleOuts').get(function(req, res) {
  var query = BooleOut.find().sort({$natural : -1}).limit(N);
  query.exec(function(err, booleOuts) {
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