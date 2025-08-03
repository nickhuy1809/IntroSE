const express = require('express');
const router = express.Router();
const { createGrade, getGradesForCourse, updateGrade, deleteGrade, getGradesForFolder } = require('../Controllers/gradeController.js');
const { protect } = require('../Middleware/authMiddleware.js');

router.use(protect);

// POST /api/grades
router.route('/').post(createGrade);

// GET /api/grades/folder/:folderId
router.route('/folder/:folderId').get(getGradesForFolder);

// GET /api/grades/course/:courseId
router.route('/course/:courseId').get(getGradesForCourse);

// PUT & DELETE /api/grades/:id
router.route('/:id').put(updateGrade).delete(deleteGrade);

module.exports = router;