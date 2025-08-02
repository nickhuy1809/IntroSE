const mongoose = require('mongoose');

const pomodoroSettingSchema = new mongoose.Schema({
    accountId: { type: String, ref: 'Account', required: true, unique: true },
    workDuration: { type: Number, required: true, default: 25, min: 1 },
    shortBreakDuration: { type: Number, required: true, default: 5, min: 1 },
    longBreakDuration: { type: Number, required: true, default: 15, min: 1 },
    pomodorosPerCycle: { type: Number, required: true, default: 4, min: 1 }
}, { timestamps: true });

const PomodoroSetting = mongoose.model('PomodoroSetting', pomodoroSettingSchema);
module.exports = PomodoroSetting;