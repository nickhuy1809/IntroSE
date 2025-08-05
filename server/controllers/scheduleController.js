const Schedule = require('../models/Schedule');

//New schedule
exports.createSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.create(req.body);
        res.status(201).json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Get all schedules for an account
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ accountId: req.params.accountId });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};