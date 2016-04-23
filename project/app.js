var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./config/config.js');
var bodyParser = require('body-parser');

var env = process.env.NODE_ENV || 'development'; 

var mongoose = require('mongoose');
mongoose.connect(config.dbUrl);

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(session({secret: config.token, saveUninitialized: true, resave: true}));



require('./routes/routes.js')(express, app);

app.listen(3000,function(){console.log('arranco')})