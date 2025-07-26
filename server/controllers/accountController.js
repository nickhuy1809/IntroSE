const Account = require('../Models/Account.js');

/**
 * @desc    Lấy thông tin tài khoản hoặc tạo mới nếu chưa tồn tại
 * @route   POST /api/accounts
 * @access  Public
 */

const getOrCreateAccount = async (req, res) => {
  const { id } = req.body; // Nhận id (UUID) từ frontend

  if (!id) {
    return res.status(400).json({ message: 'Account ID is required' });
  }

  try {
    // 1. Kiểm tra xem tài khoản đã tồn tại trong DB chưa
    let account = await Account.findOne({ _id: id });

    // 2. Nếu tài khoản tồn tại, trả về thông tin tài khoản
    if (account) {
      return res.status(200).json(account);
    }

    // 3. Nếu tài khoản không tồn tại, tạo một tài khoản mới
    account = new Account({
      _id: id, // Sử dụng id từ frontend làm khóa chính
      point: 0,
    });

    await account.save();

    // Trả về tài khoản vừa được tạo với status 201 (Created)
    res.status(201).json(account);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getOrCreateAccount,
};