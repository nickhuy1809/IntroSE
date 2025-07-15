const { v4: uuidv4 } =  require('uuid');

module.exports = (req, res, next) => {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if(!userId) {
        req.userId = uuidv4();
    } else {
        req.userId = userId;
    }
    next();
};