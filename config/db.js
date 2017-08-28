/**
 * Opens up connection with mongoDB selected database
 */

module.exports = function(enviroment, mongoose, mongo_uri) {

  connectWithRetry(mongo_uri, mongoose);

  /**
   * [connectWithRetry description]
   * @param  {[type]} mongo_uri [description]
   * @param  {[type]} mongoose  [description]
   * @return {[type]}           [description]
   */
  function connectWithRetry(mongo_uri, mongoose) {
    mongoose.connect(mongo_uri, function(err) {
      if (err) {
        console.warn('Failed to connect to mongo on startup - retrying in 5 sec', err);
        setTimeout(connectWithRetry(mongo_uri, mongoose), 5000);
      }
      console.info(`mongo :: connected to database :: ${mongo_uri}`.green);
    })
  };
}
