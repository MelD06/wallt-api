module.exports = err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
}