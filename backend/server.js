import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import Fault from './models/Fault';

//const express = require("express");
const app = express();
const router = express.Router();


 app.use(cors());
 app.use(bodyParser.json());

app.get('/faults', (req, res) => {
    //res.send('Hello World!');
        Fault.find((err, faults) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json(faults);
        }
    });
});

//mongoose.connect('mongodb://localhost:27017/faults', { useNewUrlParser: true });
mongoose.connect('mongodb://admin:admin@faultdemo-shard-00-00-nztdb.mongodb.net:27017,faultdemo-shard-00-01-nztdb.mongodb.net:27017,faultdemo-shard-00-02-nztdb.mongodb.net:27017/test?ssl=true&replicaSet=faultdemo-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:admin@faultdemo-nztdb.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("faults").collection("faults");
//   // perform actions on the collection object
//   client.close();
// });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection is established successfully.');
});

router.route('/test').get((req, res) => {
    res.send('router route kaj kore');
});

router.get('/testt', (req, res) => {
    res.send('router get  kaj kore');
})

router.route('/faults/:id').get((req, res) => {
    Fault.findById(req.params.id, (err, fault) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json(fault);
        }
    });
});

router.route('/faults/:date').get((req, res) => {
    Fault.findById(req.params.id, (err, fault) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json(fault);
        }
    });
});

router.route('/faults/add').post((req, res) => {
    let fault = new Fault(req.body);
    fault.save()
        .then(fault => {
            res.status(200).json({'fault': 'Added successfully.'});
        })
        .catch(err => {
            res.status(400).send('Failed to create the new record.');
        });
});

router.route('/faults/update/:id').post((req, res) => {
    Fault.findById(req.params.id, (err, fault) => {
        if(!fault) {
            return next(new Error('Could not load document.'));
        }
        else {
            fault.startDateTime = req.body.startDateTime;
            fault.endDateTime = req.body.endDateTime;
            fault.duration = req.body.duration;
            fault.acknowledged = req.body.acknowledged;
            fault.domain = req.body.domain;
            fault.subDomain = req.body.subDomain;
            fault.cause = req.body.cause;
            fault.action = req.body.action;
            fault.keyword = req.body.keyword;
            fault.completed = req.body.completed;

            fault.save().then(fault => {
                res.json('Update done.');
            }).catch(err => {
                res.status(400).send('Update failed.');
            });
        }
    });
});

router.route('/faults/delete/:id').get((req, res) => {
    Fault.findByIdAndRemove({_id: req.params.id}, (err, fault) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully.');
    });
});

app.use('/', router);
//module.exports = router;

app.listen(4000, () => console.log('Express server is running on port 4000'));