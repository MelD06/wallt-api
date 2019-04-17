const express =  require('express');
const router = express.Router();

const accountsController = require('../controllers/accounts');

router.get('/', accountsController.accounts_get_all);

router.post('/', accountsController.accounts_add);

router.get('/:account', accountsController.accounts_getOne);

router.patch('/:account', accountsController.accounts_update);

router.delete('/:account', accountsController.accounts_delete);

module.exports = router;