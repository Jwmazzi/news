// General
var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var passport     = require('passport');
var Strategy     = require('passport-twitter').Strategy;
var config       = require('dotenv').config();

// Routes
var indexRouter   = require('./routes/index');
var newsRouter    = require('./routes/news');
var featureRouter = require('./routes/features');
var exportRouter  = require('./routes/export');

var app = express();

app.use(require('express-session')({ secret: 'runner', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
  consumerKey: config.parsed.TWITTER_CONSUMER_KEY,
  consumerSecret: config.parsed.TWITTER_CONSUMER_SECRET,
  callbackURL: '/twitter/return'
},
function(token, tokenSecret, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
  failureRedirect: '/'
}), function(req, res) {
  res.redirect('/news')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/features', featureRouter);
app.use('/export', exportRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
