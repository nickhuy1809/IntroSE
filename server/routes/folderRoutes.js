const express = require('express');
const router = express.Router();
const { createFolder, getFoldersByAccount, getFolderById, updateFolder, deleteFolder } = require('../Controllers/folderController.js');
const { protect } = require('../Middleware/authMiddleware.js');

router.use(protect); // Áp dụng cho tất cả

// POST & GET /api/folders
router.route('/').post(createFolder).get(getFoldersByAccount);

// PUT & DELETE /api/folders/:id
router.route('/:id').get(getFolderById).put(updateFolder).delete(deleteFolder);

module.exports = router;