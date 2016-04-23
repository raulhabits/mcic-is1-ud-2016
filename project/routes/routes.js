module.exports = function (express, app, mongoose){
	var router = express.Router();
	var User = require('./../models/user.js');
	var Cabins = require('./../models/cabins.js');
	var Route = require('./../models/route.js');
	var Vehicles = require('./../models/vehicle.js');
	var Rates = require('./../models/rate.js');
	var qr = require('qr-image');

	require('./service.js')(router, mongoose, User, Cabins, Route, Vehicles, Rates);
	require('./userOperations.js')(router, mongoose, User, Vehicles, Rates);

	router.get('/', function (req, res, next){
		res.render('login');
	})	



	router.get('/login', function (req, res, next) {
		res.render('login', {});
	});

	router.get('/logout', function (req, res, next) {
		req.session.destroy();
	});
	
	router.get('/user/qr/:_id', function (req, res, next){
	var code = qr.image(req.params._id, { type: 'svg' });
	res.type('svg');
	code.pipe(res);
	})

	app.use('/', router);
}


