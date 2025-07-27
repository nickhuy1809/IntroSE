const mongoose = require('mongoose');
const gradeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Mô tả điểm không được để trống'],
        trim: true
    },
    score: {
        type: Number,
        required: [true, 'Điểm số không được để trống']
    },
    maxScore: {
        type: Number,
        required: [true, 'Điểm tối đa là bắt buộc'],
        default: 10 // Mặc định là thang điểm 10, có thể thay đổi khi tạo
    },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    accountId: { type: String, ref: 'Account', required: true }
}, { timestamps: true });
const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;