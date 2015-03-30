var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var booleOutSchema = new Schema({
  	bit: Boolean,
  	hashtag: [String],
  	userName: String,
  	post_date: {
    	type: Date,
    	default: Date.now
    },
    noOfReplies: {
    	type: Number,
    	default: 0;
    },
    parent: {
    	type: String,
    	default: "null";
    },
});
 
module.exports = mongoose.model('BooleOut', booleOutSchema);