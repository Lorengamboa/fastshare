/**
 * Middleware to check if client is logged in
 */
'use strict';

module.exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
