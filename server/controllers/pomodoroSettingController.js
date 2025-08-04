const PomodoroSetting = require('../Models/PomodoroSetting.js');
const SoundTrack = require('../Models/MusicTrack.js');

// @desc    Lấy hoặc tạo cài đặt Pomodoro cho user
exports.getSettings = async (req, res) => {
    try {
        let settings = await PomodoroSetting.findOne({ accountId: req.accountId });

        // Nếu chưa có cài đặt, tạo một cài đặt mặc định
        if (!settings) {
            settings = await PomodoroSetting.create({ accountId: req.accountId });
        }

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Cập nhật cài đặt Pomodoro
exports.updateSettings = async (req, res) => {
    try {
        // Lấy dữ liệu từ client
        const { workDuration, shortBreakDuration, longBreakDuration, pomodorosPerCycle } = req.body;

        // Chỉ cập nhật các trường có giá trị cụ thể
        const updateFields = {};
        if (workDuration != null) updateFields.workDuration = workDuration;
        if (shortBreakDuration != null) updateFields.shortBreakDuration = shortBreakDuration;
        if (longBreakDuration != null) updateFields.longBreakDuration = longBreakDuration;
        if (pomodorosPerCycle != null) updateFields.pomodorosPerCycle = pomodorosPerCycle;

        // Tiến hành cập nhật (hoặc tạo mới nếu chưa tồn tại)
        const settings = await PomodoroSetting.findOneAndUpdate(
            { accountId: req.accountId },
            updateFields,
            {
                new: true,           // Trả về bản ghi mới
                upsert: true,        // Tạo mới nếu chưa có
                runValidators: true  // Áp dụng validate từ schema
            }
        );

        res.status(200).json(settings);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi cập nhật cài đặt', error: error.message });
    }
};

exports.getSoundTracks = async (req, res) => {
    try {
        const tracks = await SoundTrack.find({});
        res.status(200).json(tracks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách âm thanh', error: error.message });
    }
};