const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware.js'); 

const { 
    createTask, 
    getTasks,
    updateTask,
    deleteTask
} = require('../Controllers/task.controller.js');

// Áp dụng middleware bảo vệ cho tất cả các route của Task
router.use(protect);

// Định nghĩa các endpoint
router.route('/')
    .post(createTask)
    .get(getTasks);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;