'use strict';

/*
 * Renders signup home
 * @path: src/views/home.hml
 */
module.exports.home = function(req, res) {
  var background_number = Math.round(Math.random() * process.env.NBACKGROUND);

  res.render('index', {
    title: 'weshare',
    background: 'bg' + background_number,
    user: req.user
  });
};

/*
 * Renders upgrade view
 * @path: src/views/upgrade.hml
 */
module.exports.upgrade = function(req, res) {
  var background_number = Math.round(Math.random() * process.env.NBACKGROUND);

  res.render('upgrade', {
    title: 'weshare',
    background: 'bg' + background_number
  });
};

/*
 * Renders help view
 * @path: src/views/help.hml
 */
module.exports.help = function(req, res) {
  var background_number = Math.round(Math.random() * process.env.NBACKGROUND);

  res.render('help', {
    title: 'weshare',
    background: 'bg' + background_number
  });
};
