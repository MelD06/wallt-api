const mongoose = require('mongoose');

const Account = require('../schemas/accounts'); 
const Transaction = require('../schemas/transactions');

const defaultError = require('../tools/default-error');

exports.transactions_add = (req, res, next) => {
    Account.findById(req.body.account).then(account => {
        if (!account){
            return res.status(404).json({
                message: 'Account doesn\'t exist'
            });
        }
        if(account.user != req.userData.userId) {
            return res.status(401).json({
                message: 'Unauthorized'
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
    .catch(defaultError);
}

/**************************************
 * Note : The following route has been
 * deactivated due to the incongruence of
 * fetching all transactions from all
 * accounts at the same time. The code is
 * left as is in case it might prove useful
 * in the future
 *************************************** */

/*
exports.transactions_getAll = (req, res, next) => {
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
    })
}
*/

exports.transactions_getAccount = (req, res, next) => {
    Transaction.find({account: req.params.accountId})
    .select('_id name value date account')
    .exec()
    .then(docs => {
        if(docs.length >= 0){
            const checkAccount = Account.findById(req.params.accountId).then( result => {
                if(result.user != req.userData.userId){
                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                }
            }).catch(defaultError);
           
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
    .catch(defaultError);
}

exports.transactions_getOne = (req, res, next) => {
    Transaction.findById(transaction).exec().then(transaction => {
        if(!transaction){
            return res.status(404).json({
                err: 'Transaction not found'
            });
        }
        Account.findById(transaction.account).then(result => {
            if(result.user != req.userData.userId){
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        }).catch(defaultError);
        res.status(200).json({
            transaction: transaction,
            request: {
                type: 'GET', 
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/transaction/' + transaction._id
            }
        });
    }).catch(defaultError);
}

//TODO: Implement
exports.transactions_update = (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "updated " + account
    });
}

exports.transactions_delete = (req, res, next) => {
    const id = req.params.transaction;
    Transaction.findById(id).then(transaction => {
        Account.findById(transaction.account).then(result => {
            if(result.user != req.userData.userId){
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        });
    }).catch(defaultError);
    
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
    .catch(defaultError);
}