const express = require('express');
const router = express.Router();
const { analyzeFolder } = require('../Controllers/analysisController.js');
const { protect } = require('../Middleware/authMiddleware.js');

// POST /api/analysis/folder/:folderId
router.post('/folder/:folderId', protect, analyzeFolder);

module.exports = router;