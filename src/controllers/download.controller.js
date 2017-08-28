'use strict';

var path = require('path');
var fileSystem = require('fs');
var archiver = require('archiver');

module.exports = {

  /*
   * 1 o more files are streamed and
   * sent to the client in a zip package
   */
  downloadFile: function(req, res, next) {

    var zip = archiver('zip', {
      zlib: {
        level: 9
      } // Sets the compression level.
    });
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-disposition': 'attachment; filename=' + req.params.path + '.zip'
    });
    zip
      .on('error', function(err) {
        console.log("Error streaming zip file", err);
        next(err);
      })
      .directory('uploads/' + req.params.path, '/')
      .finalize();
    zip.pipe(res);
  }

}
