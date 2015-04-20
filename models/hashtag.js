var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var hashtagSchema = new Schema({
  hashtag: String,
  usernames: [String],
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
  booleOuts: {
    type: [String],
    default: []
    }
});

module.exports = mongoose.model('Hashtag', hashtagSchema);
