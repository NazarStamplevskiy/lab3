const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index');
});

router.get('/passengers', function(req, res) {
    res.render('pages/passengers');
});

router.get('/trains', function(req, res) {
    res.render('pages/trains');
});

router.get('/tickets', function(req, res) {
    res.render('pages/tickets');
});

router.get('/statistics', function(req, res) {
    res.render('pages/statistics');
});

module.exports = router;