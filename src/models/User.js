/**
 * User model
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var FeedSchema = require('./Feed');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  bios: {
    type: String
  },
  uploads: [{
    type: Schema.Types.ObjectId,
    ref: 'Upload',
    default: null
  }],
  profile_picture: {
    type: String,
    default: "/img/profile-picture.png"
  },
  feed: [FeedSchema],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }],
  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }],
  tariff: {
    type: String,
    default: 'normal',
    enum: ['normal', 'gold', 'diamond']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
  },
  lastConnection: {
    type: Date,
    default: Date.now
  }
});

/**
 * Virtual data
 */


/**
 * Validatons on user schema
 */

//is the username available ???
userSchema.path('username')
  .validate(function(value, done) {
    this.model('User').count({
      username: value
    }, function(err, count) {
      if (err) {
        return done(err);
      }
      done(!count);
    });
  }, 'Username already exists');

//does the username respect the string regex ???
userSchema.path('username').validate(function(v) {
  return v.length >= 5 && v.length <= 18;
}, 'The username needs to contain between 5 and 18 characters');

//does the email respect the string regex ???
userSchema.path('email').validate(function(email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'Incorrect email format.');


/**
 * Encrypts password either when its
 * saved for the first time or updated
 */
userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(process.env.SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

/**
 * [description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * [description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
userSchema.statics.getDiskAvailable = function(id) {
  var disk = 0;
  this.findById(id, 'uploads')
    .populate({
      path: 'uploads'
    })
    .then((doc) => {
      doc.uploads.forEach(file => {
        disk += file.size;
      });
      return disk;
    })
    .catch(err => {
      next(err);
    });
};

module.exports = mongoose.model('User', userSchema);
