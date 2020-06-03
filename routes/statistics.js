var express = require('express');
var router = express.Router();

router.get('/popularRoutes', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    collection.find({}, {}, function (e, docs) {
        let routes = getUniqueRoutes(docs);
        result = routes.map(route => {
            return {
                route: route,
                amount: docs.filter(ticket => ticket.train.route == route).length
            }
        });
        res.json(result);
    });
});

router.get('/profitRoutes', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    collection.find({}, {}, function (e, docs) {
        let routes = getUniqueRoutes(docs);
        result = routes.map(route => {
            let profit = docs.filter(t => t.train.route == route).map(t => t.price).reduce((a, b) => +a + +b);
            return {
                route: route,
                profit: profit
            }
        });
        res.json(result);
    });
});

router.get('/soldTicketsOnTrain/:id', function(req, res) {
    var db = req.db;
    let trainId = req.params.id;
    var collection = db.get('tickets');
    collection.find({}, {}, function (e, docs) {
        docs = docs.filter(ticket => ticket.train.id == trainId);
        res.json(docs);
    });
});

router.get('/trainAndRoutesWithoutSoldTickets', function(req, res) {
    var db = req.db;
    let trainCollection = db.get('trains');
    var collection = db.get('tickets');
    trainCollection.find({}, {}, function(e, trainDocs) {
        collection.find({}, {}, function(e, docs) {
            let result = trainDocs.filter(train => docs.findIndex(ticket => ticket.train.route == train.route) == -1);
            res.json(result);
        });
    });
});

function getUniqueRoutes(tickets) {
    return ([...new Set(tickets.map(t => t.train.route))]);
}

module.exports = router;