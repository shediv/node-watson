var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
const config = require('./config.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//
const getMessageData = text => ({
  text,
  source: config.source,
  target: config.target
});

const getServiceData = () => ({
  iam_apikey: config.apiKey,
  url: config.url,
  version: config.version
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api', async (req,res) => {
  const languageTranslator = new LanguageTranslatorV3(getServiceData());
  const translatedText = await languageTranslator.translate(getMessageData(req.query.text));
  return res.status(200).json({ msg: translatedText.translations[0].translation })
});

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
