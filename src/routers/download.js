'use strict';
var router = require('express').Router();
var controllers = require('../controllers');

/**
 * Download app routes to ...
 */
 router.get('/:path', controllers.downloadFile);

module.exports = router;
