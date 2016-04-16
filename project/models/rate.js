var mongoose = require('mongoose');

var rateSchema = new mongoose.Schema(
	{
	 date:Date,
	 value: Number, 
	 paymentStatus: Number,
	 cabin: mongoose.Schema.Types.Mixed,
	 vehicle: mongoose.Schema.Types.Mixed,
	 user: mongoose.Schema.Types.Mixed,
	}
	);
module.exports = mongoose.model('rates', rateSchema);
