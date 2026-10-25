const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, chatWithBot);

module.exports = router;
