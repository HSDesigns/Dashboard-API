const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://himanshu:digisquire@ds119059.mlab.com:19059/digisquire', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
router.get('/topCustomers', (req, res) => {
    connection((db) => {
        const id = req.query.id; 
        const saleAmount = req.query.SaleAmount;
        console.log(id);
        console.log(saleAmount);
        console.log(req.route);

        const collection = db.collection('users');
        collection.aggregate()
            //.match(qb.where("status").eq("A"))
            //.project("gender _id")
            //.unwind("$arrayField")
            .group({ _id: id, SaleAmount: { $sum: saleAmount } })
            .sort({'SaleAmount': -1})
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
module.exports = router;