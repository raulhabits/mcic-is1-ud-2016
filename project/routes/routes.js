module.exports = function (express, app){
	var router = express.Router();
	var qr = require('qr-image');

	require('./service.js')(router);
	require('./userOperations.js')(router);

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


