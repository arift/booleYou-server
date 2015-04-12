var mongoose=require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema=mongoose.Schema;

var userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
  username: String,
  password: String,
	gender: String,
	following: [String],
	bits: {
		type: Number,
		default: 0
		},
  ones: {
		type: Number,
		default: 0
		},
  zeros: {
		type: Number,
		default: 0
		},
	signup_date: {
    type: Date,
    default: Date.now
  	}
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
