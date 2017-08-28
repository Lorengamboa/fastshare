'use strict';
var fs = require('fs');
var path = require('path');
var Upload = require('../models/Upload');
var mongoose = require('mongoose');

/*
 * Renders profile view
 * @path: src/views/profile.hml
 */
module.exports.renderProfileView = function(req, res, next) {
  //Upload.getDiskAvailable(req.user._id);
  Upload.findById(req.user._id, 'feed')
    .populate('feed.user')
    .then((doc) => {
      res.render('profile', {
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
}

/*
 * Renders myfiles view
 * @path: src/views/myfiles.hml
 */
module.exports.myFilesUploaded = function(req, res, next) {
  var disk = 0;
  mongoose.model('User').findById(req.user._id, 'uploads')
    .populate({
      path: 'uploads',
      options: {
        sort: {
          'createdAt': -1
        }
      }
    })
    .then((doc) => {
      doc.uploads.forEach(file => {
        disk += file.size;
      });
      res.render('myfiles', {
        user: req.user,
        files: doc.uploads,
        disk: disk
      });
    })
    .catch((err) => {
      next(err);
    });
}

/*
 * Upldates user´s profile picture to the one
 * that has been submitted
 */
module.exports.updateProfilePicture = function(req, res, next) {
  if (req.file) {
    var filetypes = /jpeg|jpg/;
    var mimetype = filetypes.test(req.file.mimetype);
    var extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
    if (mimetype && extname) {
      mongoose.model('User').findOne({
          username: req.user.username
        })
        .then((user) => {
          if (user) {
            fs.writeFile(`public/img/pp/${user._id}.jpg`, req.file.buffer, function(err) {
              if (err) console.log(err);
              user.update({
                  'profile_picture': `/img/pp/${user._id}.jpg`
                })
                .then(result => {
                  return result;
                })
                .catch(err => {
                  next(err);
                })
            });
          }
        })
        .then(function() {
          res.redirect('/profile');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/profile');
        });

    } else res.status(202).send('IMAGE PROFILEPICTURE UPDATE FAILED!');
  } else res.status(500).send('IMAGE PROFILEPICTURE UPDATE FAILED!');
}
