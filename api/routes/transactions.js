const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authCheck = require('../middleware/auth-check.js');

const Account = require('../schemas/accounts'); 
const Transaction = require('../schemas/transactions');

router.post('/', authCheck, (req, res, next) => {
    Account.findById(req.body.account).then(account => {
        if (!account){
            return res.status(404).json({
                message: 'Account doesn\'t exist'
            });
        }
        const transaction = new Transaction({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            value: req.body.value,
            date: req.body.date,
            account: req.body.account
        });
        return transaction.save();
    }).then(result => {
        console.log("success");
        res.status(201).json({
            message: "answer post transaction",
            newTransaction: result
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'POST Error',
            error: err
        })
    });
});

router.get('/', (req, res, next) => {
    Transaction.find()
    .select('_id name value date account')
    .exec()
    .then(docs => {
        if(docs.length >= 0){
            const response = {
                count: docs.length,
                transactions: docs.map(doc => {
                    return {
                        id: doc._id,
                        name: doc.name,
                        value: doc.value,
                        date: doc.date,
                        account: doc.account,
                        request: {
                            type: 'GET', 
                            url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/' + doc.account
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

router.get('/:transaction', (req, res, next) => {
    Transaction.findById(transaction).exec().then(transaction => {
        if(!transaction){
            return res.status(404).json({
                err: 'Transaction not found'
            });
        }
        res.status(200).json({
            transaction: transaction,
            request: {
                type: 'GET', 
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/transaction/' + transaction._id
            }
        });
    }).catch( err => {
        res.status(500).json({
            error : err
        });
    }
    );
});

router.patch('/:transaction', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "updated " + account
    });
});

router.delete('/:transaction', (req, res, next) => {
    const id = req.params.transaction;
    Transaction.remove({_id:id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Transaction deleted',
            request: {
                type: 'POST',
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/transactions/',
                body: { name: 'String',
                        value: 'Number',
                        date: 'Number',
                        account: 'ObjectId'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});
module.exports = router;