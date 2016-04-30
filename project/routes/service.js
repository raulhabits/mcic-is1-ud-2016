module.exports = function (router) {

	var successHeader = "SUCCESS";
	var errorHeader = "ERROR";

	function selectModel (name) {
		var model;
		switch(name){
			case 'users':
				model = require('./../models/user.js');
				break;
			case 'cabins':
				model = require('./../models/cabins.js');
				break;
			case 'vehicles':
				model = require('./../models/vehicle.js');
				break;
			case 'rates':
				model = require('./../models/rate.js');
				break;
			case 'route':
				model = require('./../models/route.js');
				break;
			default: 
				model= null;
				break;
		}
		return model;
	}

	function getAll (req, res, next){
		var model = selectModel(req.params.tableName);
		model.find(function (err, doc) {
			if (err) {
					res.json({result : errorHeader, message : err});
			} else {
				res.json({result : successHeader, content : doc});
			}			
		});
	}

	function searchVehicle (req, res, next) {
		if (undefined == req.body.idVehicle) {
			next();
		} else {
			var Model = selectModel('vehicles');
			Model.findOne({id : req.body.idVehicle}, function (err, vehicle){
				if (err) {
					res.json({result : errorHeader, message : err});
				} else {
					if (vehicle) {
						req.body.vehicle = JSON.parse(JSON.stringify(vehicle));
						next();
					} else {
						res.json({result : errorHeader, message : "Vehicle not found"});
					}					
				}
			});
		}		
	}

	function searchCabin (req, res, next) {
		var vehicle = JSON.parse(JSON.stringify(req.body.vehicle));
		if (undefined == req.body.idCabin) {
			next();
		} else {
			var Model = selectModel('cabins');
			Model.findOne({_id : req.body.idCabin}, function (err, cabin) {
				if (err) {
					res.json({result : errorHeader, message : err});
				} else {
					if (!cabin) {
						res.json({result : errorHeader, message : "Cabin not found"});
					} else {
						req.body.cabin = JSON.parse(JSON.stringify(cabin));
						
						next();
					}	
				}						 		
		 	});
		}
	}

	function searchTaxModel (req, res, next) {
		var cabin = JSON.parse(JSON.stringify(req.body.cabin));
		var vehicle = JSON.parse(JSON.stringify(req.body.vehicle));
		if (undefined != req.body.tax) {
			next();
		} else {
			Model = selectModel('cabins');
			Model.find({_id : cabin._id, 'taxes.category' : vehicle.category},
						{"_id" : 0, "taxes.$" : 1}, function (err, data) {
				if (err) {
					res.json({result : errorHeader, message : err});
				} else {
					if (data) {
					data.taxes = JSON.parse(JSON.stringify(data[0]));
					req.body.tax = data[0].taxes[0].value;
					
				 	next();	
					} else {
						res.json({result : errorHeader, message : "No data found"});
					}					
			 	}			 	
			});		
		}
	}

	function insertRate (req, res, next) {
		var cabin = JSON.parse(JSON.stringify(req.body.cabin));
		
		var vehicle = JSON.parse(JSON.stringify(req.body.vehicle));
		var tax = req.body.tax;
		var Model = selectModel('rates');
		var rate = new Model({
		 	cabin : cabin, 
			vehicle : vehicle, 
			date : new Date(),
			paymentStatus : 0,
			value : tax
		});
		rate.save(function (err) {
			if (err) {
				res.json({result : errorHeader, message : err});
			} else {
				res.json({result : successHeader, message : "Inserted correctly"});
			}			
		});
	}

	function addOne(req, res, next){
		if (req.params.tableName == 'rates') {
			next();
		}else{
			var model = selectModel(req.params.tableName);
			content = new model(req.body);
			content.save(function (err) {
				if(err){
					res.json({result : errorHeader, message : err});	
				} else {
					res.json({result : successHeader, message : "Inserted correctly"});
				}					
			});	
		}		
	}

	function findById (req, res, next) {
		var model = selectModel(req.params.tableName);
		model.findOne({_id : req.params._id},function (err, doc) {
			if (err) {
				res.json({result : errorHeader, message : "Cabin not found"});
			} else {
				res.json({result : successHeader, content : doc});
			}			
		});
	}

	router.get('/service/:tableName/', getAll);

	//router.post('/service/:tableName/', addOne, setupConfigurationRate, registerRate);
	router.post('/service/:tableName/', addOne, searchVehicle, searchCabin, searchTaxModel, insertRate);

	router.get('/service/:tableName/:_id', findById);

	router.get('/business', function (req, res, next) {
		Rates.find({'user.id' : req.query.idUser, paymentStatus:req.query.paymentStatus}, function (err,rates) {
			res.json(rates);	
		});		
	})
	

}