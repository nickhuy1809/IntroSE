const Account = require('../Models/Account.js');

// Middleware này sẽ bảo vệ các route, đảm bảo user đã cung cấp ID hợp lệ
const protect = async (req, res, next) => {
    let accountId;

    // Frontend phải gửi accountId qua header có tên là 'x-account-id'
    if (req.headers['x-account-id']) {
        accountId = req.headers['x-account-id'];
    }

    if (!accountId) {
        return res.status(401).json({ message: 'Không được phép, vui lòng cung cấp accountId trong header' });
    }

    try {
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(401).json({ message: 'AccountId không hợp lệ' });
        }
        // Gán accountId vào đối tượng request để các controller sau có thể sử dụng
        req.accountId = accountId;
        next(); // Chuyển sang middleware hoặc controller tiếp theo
    } catch (error) {
        res.status(401).json({ message: 'Không được phép' });
    }
};

module.exports = { protect };