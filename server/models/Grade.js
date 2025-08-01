const mongoose = require('mongoose');
const gradeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Mô tả điểm không được để trống'],
        trim: true,
        maxlength: 200
    },
    score: {
        type: Number,
        required: [true, 'Điểm số không được để trống'],
        min: 0
    },
    maxScore: {
        type: Number,
        required: [true, 'Điểm tối đa là bắt buộc'],
        min: 0.5,
        default: 10 
    },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    accountId: { type: String, ref: 'Account', required: true }
}, { timestamps: true });
const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;