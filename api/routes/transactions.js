const express =  require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check.js');

const transactionsController = require('../controllers/transactions');

router.post('/', authCheck, transactionsController.transactions_add);

//router.get('/', authCheck, transactionsController.transactions_getAll);

router.get('/account/:accountId', authCheck, transactionsController.transactions_getAccount);

router.get('/:transaction', authCheck, transactionsController.transactions_getOne);

router.patch('/:transaction', authCheck, transactionsController.transactions_update);

router.delete('/:transaction', authCheck, transactionsController.transactions_delete);

module.exports = router;