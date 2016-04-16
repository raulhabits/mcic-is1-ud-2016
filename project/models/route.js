var mongoose = require('mongoose');
var Cabin = require('./cabins.js');
var routeSchema = new mongoose.Schema(
	{name:String,
	 cabins: mongoose.Schema.Types.Mixed
	}
	);
module.exports = mongoose.model('routes', routeSchema);
