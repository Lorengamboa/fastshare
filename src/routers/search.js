'use strict';
var controllers = require('../controllers/index');
var middleware = require('../middlewares/index');
var router = require('express').Router();

/**
 * Search app routes to retreive data out of specific areas
 */
router.get('/nfriends', middleware.isLoggedIn, controllers.searchNewFriends);

module.exports = router;
