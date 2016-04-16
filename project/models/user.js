var mongoose = require('mongoose');
var userSchema = new mongoose.Schema(
	{
	 name: String,
	 id: {type: String, index:{unique:true}},
	 address: String,
	 phoneNumbers: [String], 
	 emailAddress: [String]
	});
module.exports = mongoose.model('users', userSchema);
