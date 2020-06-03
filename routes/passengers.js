var express = require('express');
var router = express.Router();

// GET /passengers
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('passengers');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

// GET /passengers/{id}
router.get('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('passengers');
    var passengerId = req.params.id;
    collection.findOne({ id: passengerId }, {}, function (e, docs) {
        res.json(docs);
    });
});

// POST /passengers
router.post('/', function (req, res) {
    var db = req.db;
    var collection = db.get('passengers');
    collection.findOne({ id: req.body.id }, {}, function (e, docs) {
        return !!docs;
    }).then(function(passengerExists) {
        if (passengerExists) {
            res.send(`Passenger with id ${req.body.id} already exists`);
        } else{
            var passenger = {
                id: req.body.id,
                name: req.body.name,
                surname: req.body.surname
            };
            collection.insert(passenger, function (e, docs) {
                if (e) {
                    res.send(e);
                } else {
                    // res.redirect(`/passengers/${passenger.id}`);
                    res.send(`Successfuly created passenger [${passenger.id}] ${passenger.name} ${passenger.surname}`);
                }
            });
        }
    });
});

// PUT /passengers
router.put('/', function (req, res) {
    var db = req.db;
    var collection = db.get('passengers');
    var passenger = {
        id: req.body.id,
        name: req.body.name,
        surname: req.body.surname
    };
    collection.update({ id: passenger.id }, passenger, function (e, docs) {
        if (e) {
            res.send(e);
        } else {
            // res.redirect(`/passengers/${passenger.id}`);
            res.send(`Successfuly updated passenger with id [${passenger.id}]`);
        }
    });
});

// DELETE /passengers/{id}
router.delete('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('passengers');
    var passengerId = req.params.id;
    collection.remove({ id: passengerId }, {}, function (e, docs) {
        if (e) {
            res.send(e);
        } else {
            res.send(`Successfuly deleted passenger with id ${passengerId}`);
        }
    });
});



module.exports = router;