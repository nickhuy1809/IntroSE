const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: { type: String, enum: ["Not Started", "In Progress", "Completed"] },
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" }
});

module.exports = mongoose.model("Task", TaskSchema);