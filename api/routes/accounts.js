const express =  require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "answer get"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "answer post"
    });
});

router.get('/:account', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "answer " + account
    });
});

router.patch('/:account', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "updated " + account
    });
});

router.delete('/:account', (req, res, next) => {
    const account = req.params.account;
    res.status(200).json({
        message: "deleted " + account
    });
});

module.exports = router;