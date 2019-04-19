exports.defaultError = (res, err) => {
    console.log(err);
    res.status(500).json({
        error: err
    });
}

exports.unauthorizedError = res => {
    res.status(401).json({
        error: 'Unauthorized'
    });
}