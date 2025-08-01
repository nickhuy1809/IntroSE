const mongoose = require('mongoose');
const soundTrackSchema = new mongoose.Schema({
    // Tên file âm thanh, ví dụ: "rain.mp3"
    filename: {
        type: String,
        required: [true, 'Tên file không được để trống'],
        unique: true, // Đảm bảo không có 2 tên file trùng lặp
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