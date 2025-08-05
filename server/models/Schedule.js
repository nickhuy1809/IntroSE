const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    accountId: { type: String, ref: 'Account', required: true },            
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: '' },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['event', 'focus', 'reminder'],
        default: 'event'
    }
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
