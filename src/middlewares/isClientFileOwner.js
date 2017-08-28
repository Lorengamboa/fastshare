/**
 * Middleware that verifies if the user its the file's owner
 */
'use strict';
var Upload = require('../models/Upload');

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    var id_file = req.params.file;
    Upload.findOne({
        'query': id_file
      }, 'owner')
      .then((file) => {
        if (file.owner.toString() === req.user._id.toString()) {
          return next();
        }
        res.redirect('/');
      })
      .catch(err => {
        res.redirect('/');
      })
  } else res.redirect('/');
}
