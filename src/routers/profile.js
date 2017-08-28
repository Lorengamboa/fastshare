'use strict';
var router = require('express').Router();
var controllers = require('../controllers');
var middleware = require('../middlewares/index');
var multer = require('multer');
var upload = multer();

/**
 * Profile app routes to look up in your personal data
 */
router.get('/', middleware.isLoggedIn, controllers.renderProfileView);
router.get('/myfiles', middleware.isLoggedIn, controllers.myFilesUploaded);
router.post('/uprofilepic', middleware.isLoggedIn, upload.single('profilepic'), controllers.updateProfilePicture);

module.exports = router;
