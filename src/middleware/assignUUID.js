const Account = require('../models/Account');
const { v4: uuidv4 } = require('uuid');

const assignUUID = async (req, res, next) => {
  const uuid = req.headers['x-user-uuid'];

  if (!uuid) {
    // Lần đầu: chưa có uuid → tạo mới
    const newUuid = uuidv4();
    const account = new Account({ uuid: newUuid });
    await account.save();

    req.user = account;
    res.setHeader('x-user-uuid', newUuid); // Gửi lại uuid cho frontend
  } else {
    // Lần sau: tìm trong DB
    const account = await Account.findOne({ uuid });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });  // Trường hợp này hiếm xảy ra (do lỗi trình duyệt,...)
    }
    req.user = account;
  }

  next();
};

module.exports = assignUUID;
