'use strict';
var router = require('express').Router();
var controllers = require('../controllers');
var isClientFileOwner = require('../middlewares/isClientFileOwner');
var deleteFolderRecursive = require("../utils/rmdir");

/**
 * File app routes to execute CRUD operation over files uploaded by the client
 */
router.route('/:file')
  .get(controllers.getFileInformation)
  .put(function(req, res) {})
  .delete(isClientFileOwner,controllers.deleteFile);

module.exports = router;
