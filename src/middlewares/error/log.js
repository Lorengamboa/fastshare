/**
 * Error log middleware
 */
var fs = require('fs');
var util = require('util');

module.exports = function logErrors(err, req, res, next) {
  var d = new Date();
  var txt = util.format(d) + ' ' + err + '\n';
  fs.appendFile('./logs/catchall.log', txt, function(err) {
    if (err) return console.log(err);
  });
  next(err);
}
