/**
 *
 */

module.exports = function(req, res, next) {
  var background_number = Math.round(Math.random() * process.env.NBACKGROUND);
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404', {
    title: 'Page not found',
    background: 'bg' + background_number,
    user: req.user
  });
}
