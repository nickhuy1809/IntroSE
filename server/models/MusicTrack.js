const mongoose = require('mongoose');
const soundTrackSchema = new mongoose.Schema({
    // Định danh duy nhất cho bài hát, cũng là tên thư mục chứa file
    // Ví dụ: "gentle-rain"
    trackIdentifier: {
        type: String,
        required: [true, 'Định danh bài hát không được để trống'],
        unique: true, // Đảm bảo không có 2 định danh trùng lặp
        trim: true
    },
    // Tên hiển thị cho người dùng, ví dụ: "Tiếng mưa rơi"
    displayName: {
        type: String,
        required: [true, 'Tên hiển thị không được để trống'],
        trim: true
    }
});
const SoundTrack = mongoose.model('SoundTrack', soundTrackSchema);
module.exports = SoundTrack;