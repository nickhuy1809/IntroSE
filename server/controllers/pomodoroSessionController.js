const PomodoroSession = require('../Models/PomodoroSession.js');
const PomodoroSetting = require('../Models/PomodoroSetting.js');
const Account = require('../Models/Account.js');
const Task = require('../Models/Task.js');

// @desc Bắt đầu một phiên Pomodoro mới
exports.startSession = async (req, res) => {
    try {
        const { tasks } = req.body; // tasks là một mảng [{ taskId: "...", estimatedPomodoros: 2 }]
        if (!tasks || tasks.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một công việc' });
        }
        for (const task of tasks) {
            if (!task.taskId || !task.estimatedPomodoros || typeof task.estimatedPomodoros !== 'number' || task.estimatedPomodoros < 1) {
                return res.status(400).json({ message: 'Mỗi công việc phải có taskId và estimatedPomodoros (là số dương)' });
            }
        }

        // Lấy cài đặt hiện tại của người dùng
        const settings = await PomodoroSetting.findOne({ accountId: req.accountId });
        if (!settings) return res.status(404).json({ message: 'Không tìm thấy cài đặt Pomodoro' });
    
        // Chuẩn bị danh sách task cho phiên mới
        const sessionTasks = tasks.map(task => ({
            task: task.taskId,
            estimatedPomodoros: task.estimatedPomodoros
        }));
        
        // Tạo phiên mới
        let newSession = await PomodoroSession.create({
            accountId: req.accountId,
            settingsUsed: {
                workDuration: settings.workDuration,
                shortBreakDuration: settings.shortBreakDuration,
                longBreakDuration: settings.longBreakDuration,
                pomodorosPerCycle: settings.pomodorosPerCycle
            },
            tasks: sessionTasks
        });

        newSession = await newSession.populate('tasks.task', 'title description priority dueDate');

        res.status(201).json(newSession);
    } catch (error) {
        // IN ra toàn bộ lỗi chi tiết trên console của server
        console.error("LỖI CHI TIẾT KHI BẮT ĐẦU PHIÊN:", error); 

        // Gửi thông báo lỗi chi tiết của Mongoose về cho client để dễ debug
        res.status(400).json({ 
            message: 'Lỗi bắt đầu phiên', 
            error: error.message // error.message sẽ chứa thông báo của Mongoose
        });
        // res.status(400).json({ message: 'Lỗi bắt đầu phiên', error: error.message });
    }
};

// @desc Lấy thông tin một phiên
exports.getSession = async (req, res) => {
    try {
        const session = await PomodoroSession.findOne({ _id: req.params.sessionId, accountId: req.accountId }).populate('tasks.task', 'title');
        if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên' });
        res.status(200).json(session);
    } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc Hủy một phiên đang diễn ra
exports.abandonSession = async (req, res) => {
    try {
        const session = await PomodoroSession.findOneAndUpdate(
            { _id: req.params.sessionId, accountId: req.accountId, status: 'active' },
            { status: 'abandoned', endTime: new Date() },
            { new: true }
        ).populate('tasks.task', 'title description priority dueDate');;
        if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên đang hoạt động' });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
    };

// @desc Tăng số hiệp thực tế cho một task
exports.incrementTaskPomodoro = async (req, res) => {
    try {
        const { sessionId, taskId } = req.params;
        let session = await PomodoroSession.findOne({ _id: sessionId, accountId: req.accountId, status: 'active' });
        if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên đang hoạt động' });
        const taskInSession = session.tasks.find(t => t.task.toString() === taskId);
        if (!taskInSession) return res.status(404).json({ message: 'Không tìm thấy công việc' });
        
        taskInSession.actualPomodoros += 1;
        await session.save();

        const updatedSession = await PomodoroSession.findById(sessionId)
            .populate('tasks.task', 'title description priority dueDate');

        res.status(200).json(updatedSession);
    } catch (error) {
        console.error("LỖI KHI TĂNG POMODORO:", error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc Đánh dấu một task là hoàn thành và tính điểm
exports.completeTaskInSession = async (req, res) => {
    try {
        const { sessionId, taskId } = req.params;
        const { incrementBeforeCompleting } = req.body; 
        const session = await PomodoroSession.findOne({ _id: sessionId, accountId: req.accountId, status: 'active' });
        if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên đang hoạt động' });
        const taskInSession = session.tasks.find(t => t.task.toString() === taskId);
        if (!taskInSession) return res.status(404).json({ message: 'Không tìm thấy công việc' });
        if (taskInSession.status === 'completed') return res.status(400).json({ message: 'Công việc đã được hoàn thành' });
        
        if (incrementBeforeCompleting) {
            taskInSession.actualPomodoros += 1;
        }
        
        // Logic tính điểm
        let pointsToAdd = 0;
        const basePoints = 100;
        const penaltyPoints = 50;
        
        if (taskInSession.actualPomodoros <= taskInSession.estimatedPomodoros) {
            pointsToAdd = basePoints; // Xong sớm hoặc đúng hạn
        } else {
            pointsToAdd = penaltyPoints; // Xong muộn
        }

        // Cập nhật CSDL
        taskInSession.status = 'completed';
        await Task.findByIdAndUpdate(taskInSession.task, { isCompleted: true });
        await Account.findByIdAndUpdate(req.accountId, { $inc: { point: pointsToAdd } });
        await session.save();

        const updatedSession = await PomodoroSession.findById(sessionId)
            .populate('tasks.task', 'title description priority dueDate');

        res.status(200).json({ message: `Công việc đã hoàn thành! Bạn được cộng ${pointsToAdd} điểm.`, session: updatedSession });

    } catch (error) {
        console.error("LỖI KHI HOÀN THÀNH TASK:", error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};