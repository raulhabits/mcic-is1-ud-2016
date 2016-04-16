var mongoose = require('mongoose');
var vehicleSchema = new mongoose.Schema(
	{
	 id: {type: String, index:{unique:true}},
	 color: String,
	 model: String,
	 brand: String,
	 category: String,
	 user: mongoose.Schema.Types.Mixed
	}
	);
module.exports = mongoose.model('vehicles', vehicleSchema);

