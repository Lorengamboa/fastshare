'use strict';
var controllers = require('../controllers/index');
var middleware = require('../middlewares/index');
var router = require('express').Router();

/**
 * Primary app routes.
 */
router.post('/', controllers.upload);

module.exports = router;
