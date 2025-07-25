const GradeSection = require('../models/GradeSection');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const { v4: uuidv4 } = require('uuid');

exports.createSection = async (req, res) => {
  try {
    const newSection = new GradeSection({
      sectionID: uuidv4(),
      ...req.body
    });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create grade section' });
  }
};

exports.getSectionsByUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const sections = await GradeSection.find({ userID });
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get grade sections' });
  }
};

exports.updateSection = async (req, res) => {
  const { sectionID } = req.params;
  try {
    const updated = await GradeSection.findOneAndUpdate(
      { sectionID },
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grade section' });
  }
};

exports.deleteSection = async (req, res) => {
  const { sectionID } = req.params;
  try {
    const subjects = await Subject.find({ sectionID });
    const subjectIDs = subjects.map(s => s.subjectID);
    await Grade.deleteMany({ subjectID: { $in: subjectIDs } });
    await Subject.deleteMany({ sectionID });
    await GradeSection.findOneAndDelete({ sectionID });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grade section' });
  }
};
