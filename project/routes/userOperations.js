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
		Vehicles.find({'user._id': req.session.user._id}, function (err, doc) {
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				req.vehicles = doc;
				next();
			}
		});
	}

	function loadRates (req, res, next) {
		Rates.find({'vehicle.user._id': req.session.user._id}, function (err, doc) {
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				req.rates = doc;
				next();
			}
		});
	}

	function profileService (req, res, next) {
		res.json('profile', {user: req.session.user, vehicles: req.vehicles, rates: req.rates});
	}

	function profilePage (req, res, next) {
		res.render('profile', {user: req.session.user, vehicles: req.vehicles, rates: req.rates});
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


	router.get('/login', loginPage);

	router.post('/login', loginUserService);

	router.get('/logout', logout);

	router.get('/profile-service', loadUserVehicles, loadRates, profileService);

	router.get('/profile', validateUserLoggedService, loadUserVehicles, loadRates, profilePage);

	router.get('/payments', getPayments);
}