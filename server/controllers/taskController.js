const Task = require('../Models/Task.js');

// Tạo một công việc mới
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        if (!title) return res.status(400).json({ message: 'Tiêu đề là bắt buộc' });

        const task = await Task.create({ 
            title, 
            description, 
            priority, 
            dueDate, 
            accountId: req.accountId 
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi tạo công việc', error: error.message });
    }
};

// Lấy tất cả công việc chưa hoàn thành của user
exports.getTasks = async (req, res) => {
    try {
        // --- LOGIC LỌC VÀ SẮP XẾP ---
        const { sortBy , isCompleted} = req.query; // Nhận tham số từ URL, ví dụ: /api/pomodoro/tasks?sortBy=priority

        const query = { accountId: req.accountId }; // Luôn lọc theo accountId
        if (isCompleted !== undefined) {
            query.isCompleted = isCompleted === 'true'; // Chuyển chuỗi 'true'/'false' thành boolean
        }
        const sortOptions = {};

        // Xây dựng các tùy chọn sắp xếp dựa trên tham số `sortBy`
        switch (sortBy) {
            case 'priority':
                // Chuyển đổi 'high', 'medium', 'low' thành số để sắp xếp
                // Ta sẽ dùng một "trick" trong MongoDB aggregation hoặc xử lý sau khi lấy
                // Cách đơn giản hơn là sort bằng text, nhưng nó sẽ ra alphabetical (high, low, medium)
                // Ta sẽ sort sau khi fetch để đảm bảo đúng thứ tự
                break;
            case 'dueDate':
                sortOptions.dueDate = 1; // 1 = ascending (tăng dần), -1 = descending (giảm dần)
                break;
            default: // Mặc định là 'allTasks'
                sortOptions.createdAt = -1; // Sắp xếp theo ngày tạo mới nhất
                break;
        }

        let tasks = await Task.find(query).sort(sortOptions).lean(); // .lean() để tăng tốc độ

        // Xử lý sắp xếp theo Priority riêng vì nó không theo alphabet
        if (sortBy === 'priority') {
            const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
            tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        }
        
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật một công việc
exports.updateTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, isCompleted } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, accountId: req.accountId },
            { title, description, priority, dueDate, isCompleted },
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ message: 'Không tìm thấy công việc' });
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi cập nhật công việc', error: error.message });
    }
};

// Xóa một công việc
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, accountId: req.accountId });
        if (!task) return res.status(404).json({ message: 'Không tìm thấy công việc' });
        res.status(200).json({ message: 'Đã xóa công việc' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};