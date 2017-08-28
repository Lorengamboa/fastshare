'use strict';

/*
 * Renders signup view
 * @path: src/views/signup.hml
 */
module.exports.renderRegisterView = function(req, res) {
  if (req.isAuthenticated()) return res.redirect('/');
  res.render('signup', {
    user: req.user,
    signupMessage: req.flash('signupMessage')
  });
}

/*
 * Validates signup form post, if the data
 * received respect the validations then it will
 * redirect client to login route otherwise to
 * the register site again
 */
module.exports.localSignUp = function(passport) {
  return passport.authenticate('local-signup', {
    successRedirect: '/login', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
};

/*
 * Renders login view
 * @path: src/views/login.hml
 */
module.exports.renderLoginView = function(req, res) {
  if (!req.isAuthenticated()) return res.render('login', {
    user: req.user,
    loginMessage: req.flash('loginMessage')
  });
  res.redirect('/');
}

/*
 * If the credentials introduced by the client
 * are correct, a session will be assign to that
 * client and will be taken to the home site otherwise
 * it will redirect him to the login view
 */
module.exports.localAuthentication = function(passport) {
  return passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
};

/*
 * It will kill the client's session and therefore
 * it will redirect him to the the home view
 */
module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
