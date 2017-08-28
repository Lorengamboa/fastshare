'use strict';

var path = require('path');
var fileSystem = require('fs');
var mongoose = require('mongoose');
var archiver = require('archiver');
var deleteFolderRecursive = require("../utils/rmdir");


/*
 * Controller to retrieve information about
 * specific upload including its files
 */
module.exports.getFileInformation = function(req, res, next) {
  var background_number = Math.round(Math.random() * process.env.NBACKGROUND);
  var domain = req.get('host');
  var path = req.params.file;
  mongoose.model('Upload').findOne({
      'query': path
    })
    .then((doc) => {
      if (!doc) return next();
      res.render('download', {
        'title': 'File download',
        'file': doc,
        'downloadable': 'http://' + domain + '/download/' + path,
        'background': 'bg' + background_number,
        'user': req.user
      });
    })
    .catch((err) => {
      next(err);
    });
}

/*
 * Controller to delete an upload
 */
module.exports.deleteFile = function(req, res, next) {
  var query = req.params.file;
  var dir = './uploads/' + query;
  deleteFolderRecursive(dir)
    .then(result => {
      if (result === 'succes') {
        mongoose.model('Upload').findOne({
            'query': query
          })
          .then((upload) => {
            if (upload) {
              mongoose.model('Upload').remove(function(err, result) {
                if (err) return next(err);
                return res.send("The document was deleted succesfully!");
              });
            } else return res.send("Not document was deleted!");
          })
          .catch((err) => {
            next(err);
          });
      } else
        res.send(result);
    })
    .catch(err => {
      console.log(err);
    })
}
