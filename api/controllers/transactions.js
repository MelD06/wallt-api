const mongoose = require('mongoose');

const Account = require('../schemas/accounts'); 
const Transaction = require('../schemas/transactions');

const errorOutput = require('../tools/default-error');

exports.transactions_add = (req, res, next) => {
    Account.findById(req.body.account).then(account => {
        if (!account){
            return res.status(404).json({
                message: 'Account doesn\'t exist'
            });
        }
        if(account.user != req.userData.userId) {
            errorOutput.unauthorizedError;
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
    .catch(err => {errorOutput.defaultError(res, err)});
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
                    errorOutput.unauthorizedError;
                }
            }).catch(err => {errorOutput.defaultError(res, err)});
           
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
    .catch(err => {errorOutput.defaultError(res, err)});
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
                errorOutput.unauthorizedError;
            }
        }).catch(err => { errorOutput.defaultError(res, err)});
        res.status(200).json({
            transaction: transaction,
            request: {
                type: 'GET', 
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/transaction/' + transaction._id
            }
        });
    }).catch(err => {errorOutput.defaultError(res, err)});
}

//TODO: Implement
exports.transactions_update = (req, res, next) => {
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    const testingTransaction = Transaction.findById(req.body.id);
    const testingAccount = Account.findById(testingTransaction.account);
    if(req.userData.userId == testingAccount.user){
        Transaction.updateMany({_id: id}, { $set: updateOps }).exec()
    .then(res => {
        console.log(res);
        res.status(200).json({
            message: 'Transaction Updated',
            request: {
                type: 'GET', 
                url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/' + res._id
            }
        });
    })
    .catch(err => {errorOutput.defaultError(res, err)});
    } else {
       errorOutput.unauthorizedError;
    }
}

exports.transactions_delete = (req, res, next) => {
    const id = req.params.transaction;
    Transaction.findById(id).then(transaction => {
        Account.findById(transaction.account).then(result => {
            if(result.user != req.userData.userId){
                errorOutput.unauthorizedError;
            }
        });
    }).catch(err => {errorOutput.defaultError(res, err)});
    
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
    .catch(err => {errorOutput.defaultError(res, err)});
}