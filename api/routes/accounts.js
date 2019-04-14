const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Account = require('../schemas/accounts');

router.get('/', (req, res, next) => {
    Account.find()
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length >= 0){
            res.status(200).json(docs);
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
            account: result
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
    Account.update({_id: id}, { $set: updateOps }).exec()
    .then(res => {
        res.status(200).json(res);
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.delete('/:account', (req, res, next) => {
    const id = req.params.account;
    Account.remove({_id:id}).exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

module.exports = router;