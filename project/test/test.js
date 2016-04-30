var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = require('should');
var httpMocks =  require('node-mocks-http');
var request = require('supertest');  
var app = require('./../app.js');
var url = 'http://localhost:3000';

describe('Unit tests', function () {
	it('Launch unit test', function () {
		expect(true).to.be.true;
	});	
});

describe('GET PAGES', function () {
	it('GET HOME', function (done) {
		request(url)
		.get('/').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('GET LOGIN', function (done) {
		request(url)
		.get('/login').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});	

});

describe('GET ALL METHODS', function () {
	it('GET Users', function (done) {
		request(url)
		.get('/service/users').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
		it('GET Vehicles', function (done) {
		request(url)
		.get('/service/vehicles')
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('GET Cabins', function (done) {
		request(url)
		.get('/service/cabins').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
		it('GET Rates', function (done) {
		request(url)
		.get('/service/rates')
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});		
});

describe('FIND ONE', function () {
	it('User', function (done) {
		request(url)
		.get('/service/users/12345678').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('Vehicle', function (done) {
		request(url)
		.get('/service/vehicles/12345678').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('Cabins', function (done) {
		request(url)
		.get('/service/cabins/12345678').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('Rates', function (done) {
		request(url)
		.get('/service/rates/12345678').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
});

describe('CREATE USER', function () {
	it('Success', function(done){
		var data = {
		 "name": "Raul",
		 "id": "12334567",
		 "address": "Fake Street # 123",
		 "phoneNumbers": ["3183960928"], 
		 "email": "raulhabits1@gmail.coms",
		 "password": "123456789"
		}
		request(url)
		.post('/service/users').send(data)
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('Missing email', function(done){
		var data = {
		 "name": "Leonel",
		 "id": "1233456778",
		 "address": "Fake Street # 123",
		 "phoneNumbers": ["3183960928"], 
		 "password": "123456789"
		}
		request(url)
		.post('/service/users').send(data)
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('Missing id', function(done){
		var data = {
		 "name": "Leonel",
		 "address": "Fake Street # 123",
		 "phoneNumbers": ["3183960928"], 
		 "email": "raulhabits1@gmail.coms",
		 "password": "123456789"
		}
		request(url)
		.post('/service/users').send(data)
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
});

describe('CREATE RATE', function  () {
	it('Success', function(done){
		var data = {
		 "idVehicle":"VAG 234",
		 "idCabin": "571b596ff64fad6e329ffe79"
		}
		request(url)
		.post('/service/rates').send(data)
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
});

describe('ZONE USER', function () {
	it('LOGIN WRONG', function(done){
		var data = {
		 "email": "raulhabits@gmail.com",
		 "password": "123456789122"
		}
		request(url)
		.post('/login').send(data)
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('LOGIN SUCCESS', function(done){
		var data = {
		 "email": "raulhabits@gmail.com",
		 "password": "123456789"
		}
		request(url)
		.post('/login').send(data)
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			Cookies = res.headers['set-cookie'].pop().split(';')[0];
			done();
		});
	});
	it('GET PROFILE', function(done){
		request(url)
		.get('/profile').set('Cookie', Cookies).send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('GET PENDING PAYMENTS', function(done){
		request(url)
		.get('/payments?paymentStatus=0').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
	it('GET LOGOUT', function (done) {
		request(url)
		.get('/logout').send()
		.end(function (err, res) {
			if (err) {
				throw err;
			}
			done();
		});
	});
});