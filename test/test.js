var should = require('should'),
	request = require('supertest')
	express = require('express');

var app = express();

//tutorial video
//https://www.youtube.com/watch?v=JZmL1Rihpt8
//documentation/examples
//https://github.com/visionmedia/supertest
//https://www.npmjs.com/package/supertest
//GLHF

describe('firstTest', function () {
	
	it('should pass', function (done) {
		done();
	});

	it('should not pass', function (done) {
		throw "don't pass";
		done();
	});

});

describe('get all users', function(){
  it('respond with json', function (done){
  	// app.get('/users', function(req, res){
  	// 	res.status(200).send({ name: 'tobi' });
	  // });

    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      // .expect(200, done);
      // .expect(200)
      .end(function(err,res){
      	console.log(res,err);
      	if(err) return done(err);
      	done()
    });
  });
});

describe('account creation', function(){
});

describe('login', function(){
  it('respond')
});

describe('look at user page', function(){
});

describe('post regular booleOut', function(){
});

describe('post reply booleOut', function(){
});