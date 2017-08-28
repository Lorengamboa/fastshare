/**
 * Index file to glue up all the app routes
 */

'use strict';

var router = require('express').Router();
var main = require('./main');
var file = require('./file');
var upload = require('./upload');
var download = require('./download');
var profile = require('./profile');
var person = require('./person');
var search = require('./search');
var auth = require('./auth');

module.exports = function(passport) {
  router.use('/', main, auth(passport));
  router.use('/profile', profile)
  router.use('/file', file);
  router.use('/upload', upload);
  router.use('/person', person);
  router.use('/download', download);
  router.use('/search', search);
  return router;
}
