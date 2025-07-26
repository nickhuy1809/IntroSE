const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  // Sử dụng _id của Mongoose để lưu UUID từ frontend.
  // Đặt kiểu là String để chứa UUID.
  _id: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    required: true,
    default: 0, // Điểm ban đầu là 0
  },
}, {
  // Tự động thêm trường createdAt
  timestamps: { createdAt: true, updatedAt: false }, 
  // Ngăn Mongoose tự tạo _id khác
  _id: false 
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;