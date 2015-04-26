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
    it('should delete the user mochatest (GET /api/users/mochatest)', function(done){
      request(url)
      .delete('/api/user/users/mochatest')
      .expect(200, done)
    });
  });
});