const mongoose = require('mongoose');

const gradeSectionSchema = new mongoose.Schema({
  sectionID: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GradeSection', gradeSectionSchema);