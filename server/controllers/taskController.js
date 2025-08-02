const Task = require('../Models/Task.js');

// Tạo một công việc mới
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ message: 'Tiêu đề là bắt buộc' });

        const task = await Task.create({ title, description, accountId: req.accountId });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi tạo công việc', error: error.message });
    }
};

// Lấy tất cả công việc chưa hoàn thành của user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ accountId: req.accountId, isCompleted: false }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};