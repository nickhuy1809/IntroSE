const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskID: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  goalID: { type: String },
  scheduleID: { type: String },
  description: { type: String, required: true },
  isComplete: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date } // optional deadline
});

module.exports = mongoose.model('Task', taskSchema);