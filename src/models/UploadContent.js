/**
 * Upload content Schema
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var uploadContentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  lastModifiedDate: {
    type: Date,
    required: true
  }
});

module.exports = uploadContentSchema;
