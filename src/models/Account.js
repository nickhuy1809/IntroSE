const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const accountSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4, unique: true},
  username: { type: String, required: true },
  motivationStyle: { type: String, enum: ['quote', 'stats', 'visual'], default: 'quote' },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
