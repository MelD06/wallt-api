const jwt = require('jsonwebtoken');

const outputError = require('../tools/default-error');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]; //Access token in "Bearer [token]" format
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        outputError.unauthorizedError(res);
    }
};