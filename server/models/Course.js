const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên khóa học không được để trống'],
        trim: true
    },
    // Tham chiếu đến folder chứa nó
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: true
    },
    // Tham chiếu đến người dùng sở hữu để bảo mật và truy vấn dễ hơn
    accountId: {
        type: String,
        ref: 'Account',
        required: true
    },
}, {
    timestamps: true
});

// MIDDLEWARE QUAN TRỌNG: Tự động xóa các Grade liên quan khi một Course bị xóa.
// Điều này đảm bảo dữ liệu không bị "mồ côi".
courseSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(`Đang xóa tất cả các điểm của khóa học: ${this._id}`);
    // `this.model('Grade')` cho phép truy cập model Grade từ model Course
    await this.model('Grade').deleteMany({ courseId: this._id });
    next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;