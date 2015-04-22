var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BooleOut = require('../models/booleOut');
var Hashtag = require('../models/hashtag');

var N = 50;
//returns last N of the booleOuts in newest to oldest
router.route('/booleouts').get(function(req, res) {
  var query = BooleOut.find().sort({$natural : -1}).limit(50);
  query.exec(function(err, booleOuts) {
    if (err) {
      return res.send(err);
      }
      res.json(booleOuts);
    });
});

/* 
  returns a number of sorted booleouts
  :howmany is how many to return 
  :sortby is what to sort by. (latest, oldest)
*/
router.route('/booleouts/:sortby/:howmany').get(function(req, res) {
  var sortby = req.params.sortby;
  var howmany = req.params.howmany;
  var query = BooleOut.find().sort({'_id' : -1}).limit(50); //default if nothing matches
  if(!sortby || !howmany) return res.send(false);
  if(sortby === 'latest' || sortby === 'date') {
    query = BooleOut.find().sort({'_id' : -1}).limit(howmany);
  } else if (sortby === 'oldest'){
    query = BooleOut.find().sort({'_id' : 1}).limit(howmany);
  }
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
    User.findOne({ username: booleOut.username }, function(err, user) {
      if(booleOut.bit) {
        user.bits += "1";
        user.ones++;
      }
      else {
        user.bits += "0";
        user.zeros++;
      }
      if (booleOut.parent !== "null") {
        BooleOut.findOne({ _id: booleOut.parent }, function(err, parentBooleOut) {
          User.findOne({ username: parentBooleOut.username }, function(err, parentUser) {
            if(booleOut.bit) {
              parentUser.bits += "1";
              parentUser.ones++;
            }
            else {
              parentUser.bits += "0";
              parentUser.zeros++;
            }
            parentBooleOut.noOfReplies++;
            parentBooleOut.save(function(err){
                console.log ("Booleout received a reply.");
            });
            parentUser.save(function(err){
                console.log ("User, \"" + parentUser.username + "\", received a bit.");
            });
          });
        });
      }
      //hashtag processing
      if(booleOut.hashtag) {
        var j = 0;
        for (var i = 0; i < booleOut.hashtag.length; i++) {
          Hashtag.findOne({hashtag : booleOut.hashtag[i]}, function(err, hashtag) {
            if(err) {
              console.log("Err: " + err);
            }
            if(hashtag) {
              hashtag.totalbits++;
              hashtag.booleOuts.push(booleOut._id);
              if(booleOut.bit) {
                hashtag.ones++;
              }
              else {
                hashtag.zeros++;
              }
              if (hashtag.usernames.indexOf(booleOut.username) < 0) {
                hashtag.usernames.push(booleOut.username)
              }
              hashtag.save(function(err) {
                if (err) {
                  console.log("error saving hashtag: " + err);
                }
              });
            }
            else {
              var newHashtag = new Hashtag();
              newHashtag.usernames.push(booleOut.username);
              newHashtag.hashtag = booleOut.hashtag[j];
              newHashtag.booleOuts.push(booleOut._id);
              newHashtag.totalbits++;
              if (booleOut.bit) {                
                newHashtag.ones++;
              }
              else {        
                newHashtag.zeros++;
              }
              newHashtag.save(function(err) {
                if (err) {
                  console.log("error saving hashtag: " + err);
                }
              });
            }
            j++;
          });
        }
      }
      // save the user
      user.save(function(err){
          console.log ("User, \"" + user.username + "\", received a bit.");
      });
    });

    booleOut.save(function(err) {
      if (err) {
          return res.send(err);
      }
      res.json(booleOut);
    });

    console.log ("added new booleout");
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

//deletes all booleouts by a user
router.route('/booleOuts/:username').delete(function(req, res) {
  BooleOut.remove({
      username: req.params.username
    }, function(err, movie) {
      if (err) {
          return res.send(err);
      }

      res.json({ message: 'Successfully deleted' });
    });
});

//returns all of the parent booleOuts
router.route('/getParents').get(function(req, res) {
  //if a booleout doesn't have a parent (parent: "null"), then it's a parent
    var query = BooleOut.find({parent: "null"}).sort({$natural : -1}).limit(N);
    query.exec(function(err, booleOuts) {
        if (err) {
            return res.send(err);
        }
        res.json(booleOuts);
    });
});

//gets all of the replies to a given id
router.route('/getreplies/:id').get(function(req, res) {
  //find all BooleOuts whose parent id is the id that's being passed in.
    BooleOut.find({parent: req.params.id}, function(err, users) {
        if (err) {
            return res.send(err);
        }
        res.json(users);
    });
});

//gets all of the booleouts by a user
router.route('/getbooleouts/:username').get(function(req, res) {
  console.log("called booleouts by user");
  //find all BooleOuts whose username is req.params.username
  var query = BooleOut.find({username: req.params.username}).sort({'_id' : -1}).limit(50);
    query.exec(function(err, booleOuts) {
        if (err) {
            return res.send(err);
        }
        res.json(booleOuts);
    });
});

//returns all of the booleouts by the users the passed-in username is following
router.route('/getfollowerbooleouts/:username').get(function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
      return res.send(err);
    }
    if (!user || !user.following) {
      console.log("getfollowerbooleouts/"+req.params.username + ": null");
      res.send(false);
      return;
    }
    var inArray = user.following;
    inArray.push(req.params.username);
    var inQuery = {$in:inArray};
    var query = BooleOut.find({username: inQuery}).sort({'_id' : -1}).limit(50);
    query.exec(function(err, booleOuts) {
      if (err) {
        return res.send(err);
        }
        res.json(booleOuts);
    });
  });
});

module.exports = router;