/**
 * Package up all then controllers
 * and bind them into a single object
 */

'use strict';
var fileController = require('./file.controller'),
  downloadController = require('./download.controller'),
  uploadController = require('./upload.controller'),
  homeController = require('./home.controller'),
  profileController = require('./profile.controller'),
  searchController = require('./search.controller'),
  friendController = require('./friend.controller'),
  authController = require('./auth.controller');

module.exports = {
  home: homeController.home,
  upgrade: homeController.upgrade,
  help: homeController.help,
  upload: uploadController.defaultUpload,
  getFileInformation: fileController.getFileInformation,
  downloadFile: downloadController.downloadFile,
  deleteFile: fileController.deleteFile,
  renderLoginView: authController.renderLoginView,
  localAuthentication: authController.localAuthentication,
  renderRegisterView: authController.renderRegisterView,
  localSignUp: authController.localSignUp,
  logout: authController.logout,
  renderProfileView: profileController.renderProfileView,
  updateProfilePicture: profileController.updateProfilePicture,
  myFilesUploaded: profileController.myFilesUploaded,
  searchNewFriends: searchController.newFriends,
  stareAtPersonProfile: friendController.stareAtPersonProfile,
}
