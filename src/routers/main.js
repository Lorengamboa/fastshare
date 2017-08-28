'use strict';
var controllers = require('../controllers/index');
var middleware = require('../middlewares/index');
var router = require('express').Router();

/**
 * Primary app routes.
 */
router.get('/', controllers.home);
router.get('/upgrade', controllers.upgrade);
router.post('/help', controllers.help);

module.exports = router;
