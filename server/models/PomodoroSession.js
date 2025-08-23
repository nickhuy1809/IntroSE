const mongoose = require('mongoose');

const sessionTaskSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    estimatedPomodoros: { type: Number, required: true, min: 1 },
    actualPomodoros: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
});

const pomodoroSessionSchema = new mongoose.Schema({
    accountId: { type: String, ref: 'Account', required: true },
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    settingsUsed: {
    workDuration: { type: Number, min: 1 },
    shortBreakDuration: { type: Number, min: 1 },
    longBreakDuration: { type: Number, min: 1 },
    pomodorosPerCycle: { type: Number, min: 1 }
    },

    tasks: [sessionTaskSchema],
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date }
}, { timestamps: true });

const PomodoroSession = mongoose.model('PomodoroSession', pomodoroSessionSchema);
module.exports = PomodoroSession;