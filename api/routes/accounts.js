const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Account = require('../schemas/accounts');

router.get('/', (req, res, next) => {
    Account.find()
    .select('_id name type')
    .exec()
    .then(docs => {
        if(docs.length >= 0){
            const response = {
                count: docs.length,
                accounts: docs.map(doc => {
                    return {
                        id: doc._id,
                        name: doc.name,
                        type: doc.type,
                        request: {
                            type: 'GET', 
                            url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/' + doc._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        } else {
            res.status(404).json({error: "No entries."});
        }
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    const account = new Account({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        type: req.body.type
    });
    account.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Account created",
            account: {
                id: result._id,
                name: result.name,
                type: result.type,
                request: {
                    type: 'GET', 
                    url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/' + result._id
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    }); //Saves in database, chaining promises

});

router.get('/:account', (req, res, next) => {
    const id = req.params.account;
    Account.findById(id)
    .select('_id name type')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({error: "No entry found for id:"+ id})
        }
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.patch('/:account', (req, res, next) => {
    const id = req.params.account;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Account.updateMany({_id: id}, { $set: updateOps }).exec()
    .then(res => {
        console.log(res);
        res.status(200).json({
            message: 'Account Updated',
            request: {
                type: 'GET', 
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/' + res._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.delete('/:account', (req, res, next) => {
    const id = req.params.account;
    Account.remove({_id:id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Account deleted',
            request: {
                type: 'POST',
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/',
                body: { name: 'String', type: 'String'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

module.exports = router;