/**
 * Feed content Schema
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var FeedContentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  when: {
    type: Date,
    required: true
  }
});

module.exports = FeedContentSchema;
