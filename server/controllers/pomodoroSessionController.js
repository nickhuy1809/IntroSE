const PomodoroSession = require('../Models/PomodoroSession.js');
const PomodoroSetting = require('../Models/PomodoroSetting.js');
const Account = require('../Models/Account.js');

// @desc Bắt đầu một phiên Pomodoro mới
exports.startSession = async (req, res) => {
    try {
        const { tasks } = req.body; // tasks là một mảng [{ taskId: "...", estimatedPomodoros: 2 }]
        if (!tasks || tasks.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một công việc' });
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
        const newSession = await PomodoroSession.create({
            accountId: req.accountId,
            settingsUsed: {
                workDuration: settings.workDuration,
                shortBreakDuration: settings.shortBreakDuration,
                longBreakDuration: settings.longBreakDuration,
                pomodorosPerCycle: settings.pomodorosPerCycle
            },
            tasks: sessionTasks
        });

        res.status(201).json(newSession);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi bắt đầu phiên', error: error.message });
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
        );
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
        const session = await PomodoroSession.findOne({ _id: sessionId, accountId: req.accountId, status: 'active' });
        if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên đang hoạt động' });
        const taskInSession = session.tasks.find(t => t.task.toString() === taskId);
        if (!taskInSession) return res.status(404).json({ message: 'Không tìm thấy công việc' });
        
        taskInSession.actualPomodoros += 1;
        await session.save();

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc Đánh dấu một task là hoàn thành và tính điểm
exports.completeTaskInSession = async (req, res) => {
    try {
        const { sessionId, taskId } = req.params;
        const session = await PomodoroSession.findOne({ _id: sessionId, accountId: req.accountId, status: 'active' });
        if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên đang hoạt động' });
        const taskInSession = session.tasks.find(t => t.task.toString() === taskId);
        if (!taskInSession) return res.status(404).json({ message: 'Không tìm thấy công việc' });
        if (taskInSession.status === 'completed') return res.status(400).json({ message: 'Công việc đã được hoàn thành' });
        
        // Logic tính điểm
        let pointsToAdd = 0;
        const basePoints = 100;
        const penaltyMultiplier = 0.5;
        
        if (taskInSession.actualPomodoros <= taskInSession.estimatedPomodoros) {
            pointsToAdd = basePoints; // Xong sớm hoặc đúng hạn
        } else {
            pointsToAdd = basePoints * penaltyMultiplier; // Xong muộn
        }

        // Cập nhật CSDL
        taskInSession.status = 'completed';
        await Account.findByIdAndUpdate(req.accountId, { $inc: { point: pointsToAdd } });
        await session.save();

        res.status(200).json({ message: `Công việc đã hoàn thành! Bạn được cộng ${pointsToAdd} điểm.`, session });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};