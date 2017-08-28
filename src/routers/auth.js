'use strict';
var controllers = require('../controllers');
var router = require('express').Router();

module.exports = function(passport) {
  /**
   * Local OAuth authentication routes. (Sign in)
   */
  router.route('/login')
    .get(controllers.renderLoginView)
    .post(controllers.localAuthentication(passport));

  /**
   * Local OAuth registration routes. (Sign up)
   */
  router.route('/register')
    .get(controllers.renderRegisterView)
    .post(controllers.localSignUp(passport));

  /**
   * Local OAuth forced end up session route. (Log out)
   */
  router.get('/logout', controllers.logout);

  return router;
}
