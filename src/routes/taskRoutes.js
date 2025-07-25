const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');

router.get('/:userID', controller.getAllTasks);
router.get('/:userID/status/:status', controller.getTasksByStatus);
router.get('/reminders/:userID', controller.getReminders);
router.get('/due/:userID', controller.getDueTasks);
router.post('/', controller.createTask);
router.put('/:taskID', controller.updateTask);
router.put('/:taskID/complete', controller.markComplete);
router.delete('/:taskID', controller.deleteTask);

module.exports = router;