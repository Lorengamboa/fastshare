/**
 * Server application
 */

var app = require('./app');
var http = require('http').Server(app);
var port = app.get('port');

var CronJob = require('cron').CronJob;
const EXPIRATION_DATE = 0;

var job = new CronJob('*/60 * * * * *', function() {
  var spawn = require('child_process').spawn;
  var py = spawn('python', ['bin/delete_expired_files.py']);

  py.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  py.stdout.on('end', function() {
    console.info("cron job completed".yellow);
    py.stdin.end();
  });
  py.stdin.write(JSON.stringify(EXPIRATION_DATE));
});

job.start();
http.listen(port, function() {
  console.log("Server up! on port ".rainbow + port.rainbow);
});
