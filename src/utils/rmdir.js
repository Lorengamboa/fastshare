/**
 * Util file to remove directories recursively
 */
'use strict';

var fs = require("fs");
var path = require("path");
module.exports = function(path) {

  return new Promise(function(resolve, reject) {
    var files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(function(file, index) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdir(path, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve("succes");
        }
      });

    } else reject("The file doesnt exist");
  })

};
