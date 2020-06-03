const path = require('path');
const express = require('express');

// Database
var monk = require('monk');
var db = monk('localhost:27017/local');


var indexRouter = require('./routes/index');
var trainRouter = require('./routes/trains');
var passengerRouter = require('./routes/passengers');
var ticketRouter = require('./routes/tickets');
var statisticsRouter = require('./routes/statistics');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname))

app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/service/trains', trainRouter);
app.use('/service/passengers', passengerRouter);
app.use('/service/tickets', ticketRouter);
app.use('/service/statistics', statisticsRouter);

const host = "localhost";
const port = "3000";
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
});

module.exports = app;
