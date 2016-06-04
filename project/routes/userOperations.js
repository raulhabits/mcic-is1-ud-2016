module.exports = function (router, mongoose, User, Vehicles, Rates){
	var successHeader = "SUCCESS";
	var errorHeader = "ERROR";

	User = require('./../models/user.js');
	Vehicles = require('./../models/vehicle.js');
	Rates = require('./../models/rate.js');

	function loginUserService (req, res, next) {
		var email = req.body.email;
		var password = req.body.password;

		User.findOne({email: email, password: password}, function(err, doc){
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				req.session.user = doc;
				res.json({result : successHeader, content : doc});
			}
		});
	}

	function validateUserLoggedService (req, res, next) {
		if(req.session.user){
			next();
		} else {
			res.json({result : errorHeader, message : "User not logged"});			
		}
	}

	function logout (req, res, next) {
		req.session.destroy();
		res.redirect('/');
	}

	function loadUserVehicles (req, res, next) {
		Vehicles.find({'user.id': req.session.user.id}, function (err, doc) {
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				req.vehicles = doc;
				next();
			}
		});
	}

	function loadRates (req, res, next) {

		Rates.find({'vehicle.user._id': req.session.user._id, date: { '$gte': req.body.startDate, '$lt': req.body.endDate } }, function (err, doc) {
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				res.json({result : successHeader, content : doc});
			}
		});
	}

	function profileService (req, res, next) {
		
		res.json('profile', {user: req.session.user, vehicles: req.vehicles, rates: req.rates, lastRate: req.rate});
	}

	function profilePage (req, res, next) {

		res.render('profile', {user: req.session.user, vehicles: req.vehicles, users:req.users, lastRate: req.rate});
	}

	function loginPage (req, res, next) {
		res.render('login', {});
	}

	function getPayments (req, res, next) {
		if (!req.session.user) {
			res.json({result : errorHeader, message : "User not logged in"});
		} else {
			Rates.find({'vehicle.user._id': req.session.user._id, paymentStatus: req.query.paymentStatus}, null, {sort: {date:-1}}, function (err, doc) {
				if (err) {
						res.json({result : errorHeader, message : err});
				} else {
					res.json({result : successHeader, content : doc});
				}			
			});
		}		
	}

	function getOtherUsers (req, res, next) {
		User.find({id:{'$ne':req.session.user.id}}, function (err, doc) {
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				req.users = doc;
				next();
			}
		});
	}

	function checkUserToSell (req, res, next) {
		console.log(req.body);
		User.findOne({_id: req.body.data._id}, function(err, doc){
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				if (doc) {
					req.userSell = doc;	
					next();
				} else {
					res.json({result : errorHeader, message : "User not found"});
				}				
			}
		});
	}

	function registerSell (req, res, next) {
		Vehicles.update(req.body.filter, {'$set': {user: req.userSell}}, {upsert:true},  function (error, doc) {
			if (error) {
				res.json({result : errorHeader, message: "The operation can't be completed"});
			}
			else {
				if (doc) {
					res.json({result : successHeader, content: doc});	
				} else {
					res.json({result : errorHeader, content: "There's not a match between filters"});	
				}
			}
		});
	}

	function getLastRecord (req, res, next) {
		Rates.findOne({'vehicle.user._id': req.session.user._id}, null,{sort: {date: -1}}, function (err, doc) {
			if (err) {
					res.json({result : errorHeader, message : err});
			} else {
				req.rate= doc;
				next();
			}			
		});
	}


	router.get('/login', loginPage);

	router.post('/login', loginUserService);

	router.get('/logout', logout);

	router.get('/profile-service', loadUserVehicles, getLastRecord, profileService);

	router.get('/profile', loadUserVehicles, getOtherUsers, getLastRecord, profilePage);

	router.post('/sell-vehicle', validateUserLoggedService, checkUserToSell, registerSell);

	router.post('/invoice', loadRates);

	router.get('/payments', getPayments);
}