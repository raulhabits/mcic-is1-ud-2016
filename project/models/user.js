var mongoose = require('mongoose');
var userSchema = new mongoose.Schema(
	{
	 name: String,
	 id: {type: String, index:{unique:true}},
	 email: {type:String, index:{unique:true}},
	 password: String,
	 address: String,
	 phoneNumber: String
	});
module.exports = mongoose.model('users', userSchema);
