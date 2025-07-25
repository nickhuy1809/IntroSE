const Schedule = require('../models/Schedule');
const { v4: uuidv4 } = require('uuid');

exports.getAllSchedules = async (req, res) => {
  const { userID } = req.params;
  try {
    const schedules = await Schedule.find({ userID });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve schedules' });
  }
};

exports.getSchedulesByDate = async (req, res) => {
  const { userID } = req.params;
  const { date } = req.query;
  try {
    const target = new Date(date);
    const next = new Date(target);
    next.setDate(target.getDate() + 1);

    const schedules = await Schedule.find({
      userID,
      startTime: { $gte: target, $lt: next }
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get schedules by date' });
  }
};

exports.getSchedulesByWeek = async (req, res) => {
  const { userID } = req.params;
  const { weekStart } = req.query;
  try {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const schedules = await Schedule.find({
      userID,
      startTime: { $gte: start, $lt: end }
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get schedules by week' });
  }
};

exports.getSchedulesByMonth = async (req, res) => {
  const { userID } = req.params;
  const { month } = req.query;
  try {
    const start = new Date(month);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const schedules = await Schedule.find({
      userID,
      startTime: { $gte: start, $lt: end }
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get schedules by month' });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule({
      scheduleID: uuidv4(),
      ...req.body
    });
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

exports.updateSchedule = async (req, res) => {
  const { scheduleID } = req.params;
  try {
    const updated = await Schedule.findOneAndUpdate({ scheduleID }, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

exports.deleteSchedule = async (req, res) => {
  const { scheduleID } = req.params;
  try {
    await Schedule.findOneAndDelete({ scheduleID });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

exports.markComplete = async (req, res) => {
  const { scheduleID } = req.params;
  try {
    const updated = await Schedule.findOneAndUpdate(
      { scheduleID },
      { isComplete: true },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark schedule complete' });
  }
};