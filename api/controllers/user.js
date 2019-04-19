const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../schemas/user');
const defaultError = require('../tools/default-error');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user => {  
        if(user.length >= 1) {
            res.status(409).json({
                message: 'Email already used'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                        });
                        user.save().then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created'
                            });
                        }).catch(defaultError);
                }
            });
        }
    });
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email}).exec().then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Wrong user of password'
            });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Wrong user of password'
                    });
                } 
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Login successful',
                        token: token
                    });
                }
                
            });
        }
    }).catch(defaultError);
}

exports.user_delete = (req,res,next) => {
    User.remove({ _id : req.params.userId}).exec().then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    }).catch(defaultError);
}