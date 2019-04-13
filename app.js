const express = require('express');
const app = express();
const morgan = require('morgan');

const accountsRoutes = require('./api/routes/accounts');
const transactionsRoutes = require('./api/routes/transactions');

app.use(morgan('dev'));

app.use('/accounts', accountsRoutes);
app.use('/transactions', transactionsRoutes);

//Only handles route errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Handles every other error as well as the previous one
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

//mongodb+srv://diez-dev1:<password>@diez-dev-8iwpz.mongodb.net/test?retryWrites=true