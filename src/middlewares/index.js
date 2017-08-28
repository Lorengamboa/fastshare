/**
 *
 *
 */

var LOG = require('./error/404'),
  CLIENT = require('./error/client'),
  STATUS500 = require('./error/catch-all'),
  STATUS404 = require('./error/404'),
  session = require('./session');

module.exports = {
  LOG,
  CLIENT,
  STATUS500,
  STATUS404,
  isLoggedIn: session.isLoggedIn
};
