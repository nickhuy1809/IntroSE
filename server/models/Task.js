const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    accountId: { type: String, ref: 'Account', required: true },
    // scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
    // goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;