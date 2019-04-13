const express =  require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "answer post"
    });
});

router.get('/:transaction', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "answer " + account
    });
});

router.patch('/:transaction', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "updated " + account
    });
});

router.delete('/:transaction', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "deleted " + account
    });
});

module.exports = router;