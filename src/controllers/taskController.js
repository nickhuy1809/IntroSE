const Task = require('../models/Task');
const { v4: uuidv4 } = require('uuid');

// Lấy tất cả task
exports.getAllTasks = async (req, res) => {
  const { userID } = req.params;
  try {
    const tasks = await Task.find({ userID });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};

// Lọc task theo trạng thái
exports.getTasksByStatus = async (req, res) => {
  const { userID, status } = req.params;
  try {
    const isComplete = status === 'complete';
    const tasks = await Task.find({ userID, isComplete });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter tasks by status' });
  }
};

// Lọc task chưa hoàn thành
exports.getReminders = async (req, res) => {
  const { userID } = req.params;
  try {
    const tasks = await Task.find({ userID, isComplete: false });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reminder tasks' });
  }
};

exports.getDueTasks = async (req, res) => {
  const { userID } = req.params;
  try {
    const today = new Date();
    const tasks = await Task.find({
      userID,
      isComplete: false,
      dueDate: { $lte: today }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get due tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({
      taskID: uuidv4(),
      ...req.body
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  const { taskID } = req.params;
  try {
    const updated = await Task.findOneAndUpdate({ taskID }, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskID } = req.params;
  try {
    await Task.findOneAndDelete({ taskID });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

exports.markComplete = async (req, res) => {
  const { taskID } = req.params;
  try {
    const updated = await Task.findOneAndUpdate(
      { taskID },
      { isComplete: true },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark task complete' });
  }
};
