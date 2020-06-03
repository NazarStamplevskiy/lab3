var express = require('express');
var router = express.Router();

// GET /tickets
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

// GET /tickets/{id}
router.get('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    var ticketId = req.params.id;
    collection.findOne({id: ticketId}, {}, function (e, docs) {
        res.json(docs);
    });
});

// POST /tickets
router.post('/', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    collection.findOne({id: req.body.id}, {}, function(e, docs) {
        return !!docs;
    }).then(function(ticketExists){
        if (ticketExists) {
            // check for existing id
            res.send(`Ticket with id ${req.body.id} already exists`);
        } else{
            var ticket = {
                id: req.body.id,
                price: req.body.price,
                passenger: {
                    id: req.body['passenger[id]'],
                    name: req.body['passenger[name]'],
                    surname: req.body['passenger[surname]']
                },
                train: {
                    id: req.body['train[id]'],
                    name: req.body['train[name]'],
                    route: req.body['train[route]'],
                    seats: req.body['train[seats]']
                },
                seat: req.body.seat,
                date: req.body.date
            };
            if (ticket.seat > ticket.train.seats) {
                // check for valid seat
                res.send(`Seat (${ticket.seat}) cannot be bigger than number of seats in the train (${ticket.train.seats})`);
            } else {
                collection.findOne({"train.id": ticket.train.id, seat: ticket.seat, date: ticket.date}, {}, function(e, docs) {
                    return !!docs;
                }).then(function(placeIsTaken) {
                    if (placeIsTaken) {
                        // check if place is taken
                        res.send(`Seat ${ticket.seat} on ${ticket.date} on train ${ticket.train.name} - ${ticket.train.route} is already taken`);
                    } else{
                        collection.insert(ticket, function (e, docs) {
                            if (e) {
                                res.send({error: e});
                            } else {
                                res.send(`Successfuly created ticket [${ticket.id}] (${ticket.price}) passenger: ${ticket.passenger}, train: ${ticket.train} - ${ticket.seat} - ${ticket.date}`);
                            }
                        });
                    }
                });
            }
        }
    });
});

// PUT /tickets
router.put('/', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    var ticket = {
        id: req.body.id,
        price: req.body.price,
        passenger: {
            id: req.body['passenger[id]'],
            name: req.body['passenger[name]'],
            surname: req.body['passenger[surname]']
        },
        train: {
            id: req.body['train[id]'],
            name: req.body['train[name]'],
            route: req.body['train[route]'],
            seats: req.body['train[seats]']
        },
        seat: req.body.seat,
        date: req.body.date
    };
    collection.update({ id: ticket.id }, ticket, function (e, docs) {
        if (e) {
            res.send(e);
        } else {
            res.send(`Successfuly updated ticket with id ${ticketId}`);
        }
    });
});

// DELETE /tickets/{id}
router.delete('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('tickets');
    var ticketId = req.params.id;
    collection.remove({ id: ticketId }, {}, function (e, docs) {
        if (e) {
            res.send(e);
        } else {
            res.send(`Successfuly deleted ticket with id ${ticketId}`);
        }
    });
});

module.exports = router;