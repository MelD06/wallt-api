const express =  require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check.js');

const transactionsController = require('../controllers/transactions');

router.post('/', authCheck, transactionsController.transactions_add);

router.get('/', transactionsController.transactions_getAll);

router.get('/:transaction', transactionsController.transactions_getOne);

router.patch('/:transaction', transactionsController.transactions_update);

router.delete('/:transaction', transactionsController.transactions_delete);

module.exports = router;