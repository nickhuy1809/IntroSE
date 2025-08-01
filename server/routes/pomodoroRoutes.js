const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware.js');
const { 
    getSettings, 
    updateSettings 
} = require('../Controllers/pomodoroSettingController.js');
const { 
    startSession, 
    getSession,
    abandonSession,
    incrementTaskPomodoro, 
    completeTaskInSession 
} = require('../Controllers/pomodoroSessionController.js');
const { 
    createTask, 
    getTasks 
} = require('../Controllers/taskController.js');


// Áp dụng middleware bảo vệ cho tất cả các route
router.use(protect);

// --- Routes cho Cài đặt (Settings) ---
router.route('/settings')
    .get(getSettings)
    .put(updateSettings);

// --- Routes cho Công việc (Tasks) ---
router.route('/tasks')
    .post(createTask)
    .get(getTasks);

// --- Routes cho Phiên làm việc (Sessions) ---
router.route('/sessions/start').post(startSession);
router.route('/sessions/:sessionId').get(getSession);
router.route('/sessions/:sessionId/abandon').put(abandonSession);

router.route('/sessions/:sessionId/tasks/:taskId/increment').put(incrementTaskPomodoro);
router.route('/sessions/:sessionId/tasks/:taskId/complete').put(completeTaskInSession);

module.exports = router;