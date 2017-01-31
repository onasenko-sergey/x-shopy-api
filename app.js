const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // send error notification
    res.status(err.status || 500);
    if (req.app.get('env') !== 'development') return res.end();
    // provide error info in development only
    res.json({ error: {
        message: err.message,
        stack: err.stack.split('\n')
    }});
});

module.exports = app;
