var express = require('express');
var router = express.Router();

// GET /trains
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('trains');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

// GET /trains/{id}
router.get('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('trains');
    var trainId = req.params.id;
    collection.findOne({id: trainId}, {}, function (e, docs) {
        res.json(docs);
    });
});

// POST /trains
router.post('/', function (req, res) {
    var db = req.db;
    var collection = db.get('trains');
    collection.findOne({ id: req.body.id }, {}, function (e, docs) {
        return !!docs;
    }).then(function(trainExists) {
        if (trainExists) {
            res.send(`Train with id ${req.body.id} already exists`);
        } else {
            var train = {
                id: req.body.id,
                name: req.body.name,
                route: req.body.route,
                seats: req.body.seats
            };
            collection.insert(train, function (e, docs) {
                if (e) {
                    res.send(e);
                } else {
                    // res.redirect(`/${train.id}`);
                    res.send(`Successfuly created train [${train.id}] ${train.name} ${train.route} (${train.seats})`);
                }
            });
        }
    });
});

// PUT /trains
router.put('/', function (req, res) {
    var db = req.db;
    var collection = db.get('trains');
    var train = {
        id: req.body.id,
        name: req.body.name,
        route: req.body.route,
        seats: req.body.seats
    };
    collection.update({ id: train.id }, train, function (e, docs) {
        if (e) {
            res.send(e);
        } else {
            // res.redirect(`/${train.id}`);
            res.send(`Successfuly updated train with id [${train.id}]`);
        }
    });
});

// DELETE /trains/{id}
router.delete('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('trains');
    var trainId = req.params.id;
    collection.remove({ id: trainId }, {}, function (e, docs) {
        if (e) {
            res.send(e);
        } else {
            res.send(`Successfuly deleted train with id ${trainId}`);
        }
    });
});

module.exports = router;