const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    accountId: { type: String, ref: 'Account', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: '' },
    isCompleted: { type: Boolean, default: false },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;