var mongoose = require('mongoose');
var cabinSchema = new mongoose.Schema(
	{
	 name: String,
	 lat: Number,
	 lon: Number,
	 taxes: [{category: String, value: Number}]
	}
	);
module.exports = mongoose.model('cabins', cabinSchema);
