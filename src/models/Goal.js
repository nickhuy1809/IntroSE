const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  goalID: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  isComplete: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);