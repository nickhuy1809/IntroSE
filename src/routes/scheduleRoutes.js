const express = require('express');
const router = express.Router();
const controller = require('../controllers/scheduleController');

router.get('/:userID', controller.getAllSchedules);
router.get('/:userID/date', controller.getSchedulesByDate);
router.get('/week/:userID', controller.getSchedulesByWeek);
router.get('/month/:userID', controller.getSchedulesByMonth);
router.post('/', controller.createSchedule);
router.put('/:scheduleID', controller.updateSchedule);
router.put('/:scheduleID/complete', controller.markComplete);
router.delete('/:scheduleID', controller.deleteSchedule);

module.exports = router;