module.exports = function(express, app, mongoose){
	var router = express.Router();
	var User = require('./../models/user.js');
	var Cabins = require('./../models/cabins.js');
	var Route = require('./../models/route.js');
	var Vehicles = require('./../models/vehicle.js');
	var Rates = require('./../models/rate.js');
	var qr = require('qr-image');



	router.get('/', function(req, res, next){
		res.send("Hello world");
	})

	router.get('/vehicles', function(req, res, next){
		Vehicles.find(function(err, doc){
			res.json(doc);
		});
	})
	
	router.post('/vehicles', function(req, res, next){
		var vehicle =  new Vehicles(req.body);
		vehicle.save(function(err){
			if(err){
				console.log(err);
				res.json('Error');				
			}
			else
				res.json('Inserted correctly');
		});
	})

	router.get('/vehicles/:_id', function(req, res, next){
		Vehicles.findOne({_id: req.params._id},function(err, doc){
			res.json(doc);
		});
	})

	router.get('/users', function(req, res, next){
		User.find(function(err, doc) { 
			res.json(doc);
		});
	})

	router.post('/users', function(req, res, next){
		var user = new User(req.body);
		user.save(function(err){
			if(err){
				console.log(err);
				res.json('Error');				
			}
			else
				res.json('Inserted correctly');
		});
	})

	router.get('/users/:_id', function(req, res, next){
		User.findOne({_id: req.params._id},function(err, doc){
			res.json(doc);
		});
	})

	router.get('/cabins', function(req, res, next){
		Cabins.find(function(err, doc) { 
			res.json(doc);
		});
	})

	router.get('/cabins/:_id', function(req, res, next){
		Cabins.findOne({_id: req.params._id},function(err, doc){
			res.json(doc);
		});
	})

	router.post('/cabins', function(req, res, next){
		var cabin = new Cabins(req.body);
		cabin.save(function(err){
			if(err){
				console.log(err);
				res.json('Error');				
			}
			else
				res.json('Inserted correctly');
		});
	})

	router.get('/rates', function(req, res, next){
		Rates.find(function(err, doc) { 
			res.json(doc);
		});
	})

	router.get('/rates/:_id', function(req, res, next){
		Rates.findOne({_id: req.params._id},function(err, doc){
			res.json(doc);
		});
	})

	router.post('/register-rate', setupConfigurationRate, registerRate);

	router.post('/rates', registerRate);

	router.get('/user/qr/:_id', function(req, res, next){
	var code = qr.image(req.params._id, { type: 'svg' });
	res.type('svg');
	code.pipe(res);
	})

	router.get('/rates-registered', function(req, res, next){
		Rates.find({'user.id': req.query.idUser, paymentStatus:req.query.paymentStatus}, function(err,rates){
			res.json(rates);	
		});		
	})

	function setupConfigurationRate(req, res, next){
		Vehicles.findOne({id:req.body.idVehicle}, function(err,vehicle){	
			if(err){
				res.json("Error ");
			}		
			vehicle = JSON.parse(JSON.stringify(vehicle));
			Cabins.findOne({_id:req.body.idCabin}, function(err,cabin){
				cabin = JSON.parse(JSON.stringify(cabin));

				if(vehicle && cabin){
					req.body._id = cabin._id;
					req.body.cabin = cabin;
					req.body.vehicle = vehicle;
					next();	
				}else{
					res.send("Error");
				}
			});			
		});		
	}

function registerRate(req, res, next){
		var cabin = JSON.parse(JSON.stringify(req.body.cabin));
		var vehicle = JSON.parse(JSON.stringify(req.body.vehicle));
		Cabins.find({_id:cabin._id, 'taxes.category':vehicle.category},
					 {"_id":0, "taxes.$":1}, function(err,data){
					 		data = JSON.parse(JSON.stringify(data[0]));
 				 			var rate = new Rates({
						 	 cabin:cabin, 
							 vehicle:vehicle, 
							 date: new Date(),
							 paymentStatus:0,
							 value:data.taxes[0].value
						});
						rate.save(function(err){
							if(err){
								console.log(err);
								res.json('No se puede guardar');				
							}
							else
								res.json('Inserted correctly');
						});
					 });
	}

	app.use('/', router);
}


