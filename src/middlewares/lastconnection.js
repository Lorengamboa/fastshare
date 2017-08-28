/**
 *
 */
var mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    mongoose.model('User').findByIdAndUpdate(req._id, {
        'lastConnection': Date.now()
      })
      .then(res => {
        next();
      })
      .catch(err => {
        next(err);
      });
  } else next();

}
