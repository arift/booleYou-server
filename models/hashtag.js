var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var hashtag = new Schema({
  hashtag: String,
  username: String,
  ones: {
    type: Number,
    default: 0
    },
  zeros: {
    type: Number,
    default: 0
    },
  totalbits: {
    type: Number,
    default: 0
    },
  booleouts: {
    type: [Object]
    }
});

module.exports = mongoose.model('BooleOut', booleOutSchema);
