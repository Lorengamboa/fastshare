'use strict';
var mongoose = require('mongoose')

module.exports = {
  newFriends: function(req, res) {
    searchNewFriendQuery(req.query.person)
      .then(result => {
        res.render('speople', {
          user: req.user,
          listusers: result,
        });
      })
      .catch(err => {
        next(err);
      });
  }
}

/**
 * [description]
 * @param  {[type]} query [description]
 * @return [type]         [description]
 */
function searchNewFriendQuery(username) {
  return mongoose.model('User').find({
    'username': new RegExp(username, 'i')
  });
}
