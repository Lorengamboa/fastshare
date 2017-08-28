/**
 * filemanager Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UploadContentSchema = require('./UploadContent');

mongoose.Promise = global.Promise;

var uploadSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  query: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  message: {
    type: String
  },
  content: [UploadContentSchema],
  password: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ndownloads: {
    type: Number,
    default: 0
  }
});

uploadSchema.post('remove', function(next) {
  User.update({
      _id: this.owner
    }, {
      $pullAll: {
        'uploads': [this._id]
      },
      $push: {
        'feed': {
          'user': this.owner,
          'subject': 'document was deleted',
          'when': Date.now()
        }
      }
    })
    .then((result) => {
      console.log(this.owner, this._id, result);
    })
    .catch((err) => {
      next(err);
    })
});

var Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;
