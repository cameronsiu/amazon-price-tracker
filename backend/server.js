const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const indexRouter = require('./routes/index');
const getDataRouter = require('./routes/getData');
const trackPriceRouter = require('./routes/trackPrice');
const deletePriceRouter = require('./routes/deletePrice');

const app = express();

app.use(cors())
app.use(express.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);
// User requests data from databse
app.use('/getData', getDataRouter);
app.use('/trackPrice', trackPriceRouter);
app.use('/deletePrice', deletePriceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
