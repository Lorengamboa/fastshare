'use strict';
var controllers = require('../controllers/index');
var middleware = require('../middlewares/index');
var router = require('express').Router();

/**
 * Primary app routes.
 */
router.get('/:username', middleware.isLoggedIn, controllers.stareAtPersonProfile);

module.exports = router;
