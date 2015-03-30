var app = require('../app');

var should = require('should'),
	supertest = require('supertest');

describe('firstTest', function () {
	
	it('should pass', function (done) {
		done();
	});

	it('should not pass', function (done) {
		throw "don't pass";
		done();
	});

});