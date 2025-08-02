const express = require('express');
const router = express.Router();
const { createCourse, getCoursesInFolder, updateCourse, deleteCourse } = require('../Controllers/courseController.js');
const { protect } = require('../Middleware/authMiddleware.js');

router.use(protect);

// POST /api/courses
router.route('/').post(createCourse);

// GET /api/courses/folder/:folderId
router.route('/folder/:folderId').get(getCoursesInFolder);

// PUT & DELETE /api/courses/:id
router.route('/:id').put(updateCourse).delete(deleteCourse);

module.exports = router;