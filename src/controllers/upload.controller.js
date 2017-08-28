'use strict';
var fileSystem = require('fs');
var path = require('path');
var formidable = require('formidable');
var mongoose = require('mongoose');
var Upload = require('../models/Upload');
var generate_hash = require('../utils/code_generator');

/*
 * Controller to manage the upload progress, it might return him a
 * possible scenario where the content upload is not valid or it overpass
 * the amount of data accepted or the use has reached the limit of possible
 * storage
 */
module.exports.defaultUpload = function(req, res, next) {
  var code = generate_hash(process.env.CODE_LENTH);
  var dir = process.env.UPLOAD_DIR + code;
  var totalSize = 0;
  var domain = req.get('host');
  var form = new formidable.IncomingForm();
  form.encoding = 'binary';
  form.parse(req);

  if (form.bytesExpected > process.env.UPLOAD_MAX) res.status(413).send(process.env.MSG_MAX_FILE)
  else {
    if (!fileSystem.existsSync(dir)) {
      fileSystem.mkdirSync(dir);
    }

    var upload = new Upload();

    form.on('error', function(err) {
        next(err);
      })
      .on('field', function(name, value) {
        req.body[name] = value;
        //console.log(name,value);
      })
      .on('fileBegin', function(name, file) {
        file.path = dir + "/" + file.name;
      })
      .on('file', function(name, file) {
        upload.content.push({
          'name': file.name,
          'size': file.size,
          'extension': file.type,
          'lastModifiedDate': file.lastModifiedDate
        })
        totalSize += file.size;
      })
      .on('progress', function(bytesReceived, bytesExpected) {
        //var percent = (bytesReceived / bytesExpected * 100) | 0;
      })
      .on('end', function(fields, files) {
        if (mongoose.connection.readyState) {
          saveUpload(req)
            .then(insertUploadIntoUser)
            .catch((err) => {
              next(err);
            })
        } else {
          next("Connection to database failed");
        }
      });
  }

  function saveUpload(req) {
    if (req.isAuthenticated()) upload.owner = req.user._id;
    upload.query = code;
    upload.size = totalSize;
    upload.message = req.body['message'];
    return upload.save()
  }

  function insertUploadIntoUser(result) {
    {
      if (req.isAuthenticated()) {
        mongoose.model('User').findOneAndUpdate({
          _id: req.user._id
        }, {
          $push: {
            'uploads': result._id,
            'feed': {
              'user': req.user._id,
              'subject': 'uploaded content',
              'when': Date.now()
            }
          }
        }, function(err, place) {
          res.send("http://" + domain + "/files/" + code);
        });
      } else
        res.send("http://" + domain + "/files/" + code);
    }
  }
}
