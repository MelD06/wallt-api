const Account = require('../schemas/accounts');
const mongoose = require('mongoose');

const defaultError = require('../tools/default-error');

exports.accounts_get_all = (req, res, next) => {
    Account.find({ user: req.userData.userId})
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
    .catch(defaultError);
}

exports.accounts_add = (req, res, next) => {
    console.log(req.userData);
    const account = new Account({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        type: req.body.type,
        user: req.userData.userId
    });
    account.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Account created",
            account: {
                id: result._id,
                name: result.name,
                type: result.type,
                user: result.user,
                request: {
                    type: 'GET', 
                    url: 'http://' + process.env.SRV_URL + ':' + process.env.SRV_PORT + '/accounts/' + result._id
                }
            }
        });
    })
    .catch(defaultError);

}

exports.accounts_getOne = (req, res, next) => {
    const id = req.params.account;
    Account.findById(id)
    .select('_id name type user')
    .exec()
    .then(doc => {
        if(doc){
             if(doc.user == req.userData.userId){
                res.status(200).json(doc); //TODO: Improve response   
             } else {
                 res.status(401).json({
                     message: 'Unauthorized'
                 })
             }
        } else {
            res.status(404).json({error: "No entry found for id:"+ id})
        } //TODO: could be refactored
    })
    .catch(defaultError);
}

exports.accounts_update = (req, res, next) => {
    const id = req.params.account;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    const testingAccount = Account.findById(req.body.id);
    if(req.userData.userId == testingAccount.user){
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
    .catch(defaultError);
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
    
}

exports.accounts_delete = (req, res, next) => {
    const id = req.params.account;
    const testingAccount = Account.findById(req.body.id);
    if(req.userData.userId == testingAccount.user){
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
    .catch(defaultError);
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
    
}