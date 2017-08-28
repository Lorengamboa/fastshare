/**
 *
 *
 */
var middleware = require('../middlewares/index');
var lastconnection = require('../middlewares/lastconnection');

module.exports = {
  pre: function(app) {
    app.use(lastconnection);
  },
  post: function(app) {
    app.use(middleware.LOG);
    app.use(middleware.CLIENT);
    app.use(middleware.STATUS500);
    app.use(middleware.STATUS404);
  }
}
