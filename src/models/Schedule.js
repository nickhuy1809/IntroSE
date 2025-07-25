const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  scheduleID: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  title: { type: String, required: true, maxlength: 20 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  subject: { type: String },
//   priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  estimateEffort: { type: Number, default: 60 },
  isComplete: { type: Boolean, default: false },
  reminderTime: { type: Date }
});

module.exports = mongoose.model('Schedule', scheduleSchema);