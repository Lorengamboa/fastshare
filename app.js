/**
 * Express App configuration
 */

'use strict';

var fs = require('fs'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  color = require('colors'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  rfs = require('rotating-file-stream'),
  passport = require('passport'),
  flash = require('connect-flash'),
  session = require('express-session'),
  favicon = require('serve-favicon'),
  MongoStore = require('connect-mongo')(session),
  db_connection = require('./config/db'),
  middlewareFactory = require('./src/factory/middlewareFactory'),
  routers = require('./src/routers');

require('dotenv').config();
require('./config/passport')(passport);

var app = express();

/*********************************
    ENVIROMENT CONFIGURATION
**********************************/
const enviroment = app.get('env');
var mongodb_uri = null;

if (enviroment === 'development') {
  mongodb_uri = process.env.DBD_URI;
  console.log(`Chosen enviroment => ${enviroment}`.grey);
} else if (enviroment === 'production') {
  mongodb_uri = process.env.DBP_URI;
  console.log(`Chosen enviroment => ${enviroment}`.grey);
}

db_connection(enviroment, mongoose, mongodb_uri); //Creates connection with mongoDB

/*********************************
      EXPRESS APP SETTINGS
**********************************/
const logDirectory = path.join(__dirname, 'logs/access');
var accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
});

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
app.set('port', process.env.PORT || process.env.SERVER_PORT);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'html');
app.set('view cache', true);
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('combined', {
  stream: accessLogStream
}))
app.use(session({
  secret: process.env.SESSION_KEY,
  proxy: true,
  resave: true,
  cookie: {
    maxAge: 18000000
  },
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    stringify: false
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(favicon(path.join(__dirname, 'public', '/img/favicon.ico')))

/*****************************************
    EXPRESS APP ROUTES &&  MIDDLEWARES
******************************************/
middlewareFactory.pre(app);
app.use('/', routers(passport));
middlewareFactory.post(app);

module.exports = app;
