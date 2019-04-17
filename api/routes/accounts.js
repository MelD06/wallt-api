const express =  require('express');
const router = express.Router();

const authCheck = require('../middleware/auth-check');

const accountsController = require('../controllers/accounts');

router.get('/', authCheck, accountsController.accounts_get_all);

router.post('/', authCheck, accountsController.accounts_add);

router.get('/:account', authCheck, accountsController.accounts_getOne);

router.patch('/:account', authCheck, accountsController.accounts_update);

router.delete('/:account', authCheck, accountsController.accounts_delete);

module.exports = router;