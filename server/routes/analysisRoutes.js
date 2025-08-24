const express = require('express');
const router = express.Router();
const { analyzeFolder } = require('../Controllers/analysisController.js');
const { protect } = require('../Middleware/authMiddleware.js');

// get /api/analysis/folder/:folderId
router.get('/folder/:folderId', protect, analyzeFolder);

module.exports = router;