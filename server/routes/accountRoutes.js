const express = require('express');
const router = express.Router();
const { getOrCreateAccount } = require('../Controllers/accountController.js');

// Định nghĩa route cho việc lấy hoặc tạo tài khoản
// POST /api/accounts/
router.post('/', getOrCreateAccount);

module.exports = router;