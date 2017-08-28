'use strict';

var mongoose = require('mongoose');

/*
 * 
 *
 */
module.exports.stareAtPersonProfile = function(req, res) {
  mongoose.model('User').findOne({
      'username': req.params.username
    })
    .then((friend) => {
      res.render('fprofile', {
        user: req.user,
        friend: friend
      });
    })
    .catch((err) => {
      next(err);
    });
}
