var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
  	bitName: String,
  	password: String,
	gender: Number,
	following: [String],
	signup_date: {
    	type: Date,
    	default: Date.now
    }
});
 
module.exports = mongoose.model('User', userSchema);