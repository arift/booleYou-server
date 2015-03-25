var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var booleOutSchema = new Schema({
  	bit: Boolean,
  	hashtag: String,
  	user_name: String,
  	post_date: {
    	type: Date,
    	default: Date.now
    },
});
 
module.exports = mongoose.model('BooleOut', booleOutSchema);