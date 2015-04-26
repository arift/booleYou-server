var assert = require("assert"); // node.js core module
var should = require('should'); 
var request = require('supertest');
var BooleOut = require('../models/booleOut');

describe('Routing', function(){
	var url = 'http://booleyou-server.herokuapp.com';
	describe('User/Auth related API calls', function(){
  	it('should get all users (GET /api/user/users)', function(done){
  		request(url)
  		.get('/api/user/users')
  		.expect('Content-Type', /json/)
  		.expect(200)
  		.end(function(err, res) {
  			if(err) {
  				throw err;
  			}
  			res.body.should.be.ok;
  			done();
  		});
  	});
  	it('should create a new user named mochatest (POST /auth/signup)', function(done){
  		var user = {
  			firstName	: 'mochatest',
  			lastName	: 'mochatest',
  			email		: 'mochatest@mochatest.com',
  			username	: "mochatest",
  			password	: "mochatest" 
  		};      		
  		request(url)
  		.post('/auth/signup')
  		.send(user)
  		.expect(200, done);
  	});
  	it('should return the user mochatest (GET /api/users/mochatest)', function(done){
  		request(url)
  		.get('/api/user/users/mochatest')
  		.end(function(err, res) {
  			if(err) {
  				throw err;
  			}   
  			res.body.should.be.ok;
  			res.body.firstName.should.equal('mochatest');
  			res.body.lastName.should.equal('mochatest');
  			res.body.email.should.equal('mochatest@mochatest.com');
  			res.body.username.should.equal('mochatest');	
  			done();      			
  		});
  	});
  	it('should login the user mochatest (POST /auth/login)', function(done){
  		var user = {
  			username	: "mochatest",
  			password	: "mochatest" 
  		};  
  		request(url)
  		.post('/auth/login')
  		.send(user)
    	.expect(200, done);
  	});
    it('should update the password of mochetest user (POST /api/user/changepass/mochatest)', function(done){
      var data = {
        newPassword  : "newpassword" 
      };  
      request(url)
      .post('/api/user/changepass/mochatest')
      .send(data)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.body.should.be.ok;
        res.body.firstName.should.equal('mochatest');
        res.body.lastName.should.equal('mochatest');
        res.body.email.should.equal('mochatest@mochatest.com');
        res.body.username.should.equal('mochatest');
        done();
      });
    });
    it('should login the user mochatest with the NEW password (POST /auth/login)', function(done){
      var user = {
        username  : "mochatest",
        password  : "newpassword" 
      };  
      request(url)
      .post('/auth/login')
      .send(user)
      .expect(200, done);
    });
    it('should create another user named mochatest2 (POST /auth/signup)', function(done){
      var user = {
        firstName : 'mochatest2',
        lastName  : 'mochatest2',
        email   : 'mochatest2@mochatest.com',
        username  : "mochatest2",
        password  : "mochatest2" 
      };          
      request(url)
      .post('/auth/signup')
      .send(user)
      .expect(200, done);
    });
    it('should make user mochatest follow user mochatest2 (GET /api/user/mochatest/follow/mochatest2)', function(done){ 
      request(url)
      .get('/api/user/mochatest/follow/mochatest2')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.should.be.json;
        var user = res.body.user;
        user.should.be.ok;
        user.firstName.should.equal('mochatest');
        user.should.have.property('following').with.lengthOf(1);
        user.following[0].should.equal('mochatest2');
        done();
      });
    });
    it('should request usermochatest2 and check to see if mochatest2 is being followed by mochatest (GET /api/user/users/mochatest2)', function(done){
      request(url)
      .get('/api/user/users/mochatest2')
      .end(function(err, res) {
        if (err) throw err;
        res.should.be.json;
        var user = res.body;
        user.should.be.ok;
        user.firstName.should.equal('mochatest2');
        user.should.have.property('followedby').with.lengthOf(1);
        user.followedby[0].should.equal('mochatest');
        done();          
      });
    });
    it('should make user mochatest unfollow user mochatest2 (GET /api/user/mochatest/unfollow/mochatest2)', function(done){ 
      request(url)
      .get('/api/user/mochatest/unfollow/mochatest2')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.should.be.json;
        var user = res.body.user;
        user.should.be.ok;
        user.firstName.should.equal('mochatest');
        user.should.have.property('following').with.lengthOf(0);
        done();
      });
    });
    it('should request usermochatest2 and check to see if the user mochatest is unfollowed (GET /api/user/users/mochatest2)', function(done){
      request(url)
      .get('/api/user/users/mochatest2')
      .end(function(err, res) {
        if (err) throw err;
        res.should.be.json;
        var user = res.body;
        user.should.be.ok;
        user.firstName.should.equal('mochatest2');
        user.should.have.property('followedby').with.lengthOf(0);
        done();          
      });
    });
    it('should add a profile picture for user mochatest (POST /api/user/addpropic/mochatest', function(done){ 
      var picture = {
        username: 'mochatest',
        picture  : "picturestring"
      }; 
      request(url)
      .post('/api/user/addpropic/mochatest')
      .send(picture)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.should.be.json;
        var picture = res.body;
        picture.should.be.ok;
        picture.username.should.equal('mochatest');
        picture.picture.should.equal('picturestring');
        done();
      });
    });
  });

	describe('booleOut related API calls', function(){
		it('should get all booleouts (GET api/booleout/booleouts)', function(done){
  		request(url)
  		.get('/api/booleout/booleouts')
  		.expect('Content-Type', /json/)
  		.expect(200, done);
  	});
  	it('should add a new booleOut (POST api/booleout/booleouts)', function(done){
  		var booleOut = {
        bit     : true,
  			hashtag	: ['mochatest'],
  			username: 'mochatest',
        parent  : "null"
  		}; 
  		request(url)
  		.post('/api/booleout/booleouts')
  		.send(booleOut)
  		.expect(200)
  		.end(function(err, res) {
  			if(err) {
  				throw err;
  			}
  			done();      			
  		});
  	}); 
    it('should return all of the parent booleouts (GET /api/booleout/getparents)', function(done){
      request(url)
      .get('/api/booleout/getParents')
      .expect(200)
      .end(function(err, res) {
        if(err) throw err;
        res.body.should.be.json;
        done();        
      });
    });
    it('should return booleouts by mochatest (GET /api/booleout/getbooleouts/mochatest)', function(done){
      request(url)
      .get('/api/booleout/getbooleouts/mochatest')
      .expect(200)
      .end(function(err, res) {
        if(err) throw err;
        res.body.should.be.json;
        var booleouts = res.body;
        booleouts[0].username.should.equal('mochatest');
        done();        
      });
    });
  });

  describe('Clean up calls', function(){ 
    it('should delete all the booleOuts posted by mochatest)', function(done){
      request(url)
      .delete('/api/booleout/booleouts/mochatest')
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }
        done();           
      });
    });   
    it('should delete the user mochatest (DELETE /api/users/mochatest)', function(done){
      request(url)
      .delete('/api/user/users/mochatest')
      .expect(200, done)
    });
    it('should delete the picture for the user mochatest (DELETE /api/deletepropic/mochatest)', function(done){
      request(url)
      .delete('/api/user/deletepropic/mochatest')
      .expect(200, done)
    });
    it('should delete the user mochatest2 (DELETE /api/users/mochatest2)', function(done){
      request(url)
      .delete('/api/user/users/mochatest2')
      .expect(200, done)
    });
  });
});