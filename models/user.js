var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var userSchema = new Schema({
  	user_name: String,
  	password: String,
  	signup_date: {
    	type: Date,
    	default: Date.now
    },
	bits: Number,
	following: [String]
});
 
module.exports = mongoose.model('User', userSchema);