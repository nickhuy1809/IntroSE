const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// New schedule
router.post('/', scheduleController.createSchedule);

// All schedules for an account
router.get('/:accountId', scheduleController.getSchedules);

// Update schedule
router.put('/:id', scheduleController.updateSchedule);

// Delete Schedule
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;