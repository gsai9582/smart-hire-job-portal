// ── routes/notificationRoutes.js ─────────────────────────────────────────────
const express = require('express');
const notifRouter = express.Router();
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, chatWithBot } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

notifRouter.get('/', protect, getNotifications);
notifRouter.put('/:id/read', protect, markAsRead);
notifRouter.put('/read-all', protect, markAllAsRead);
notifRouter.delete('/:id', protect, deleteNotification);

module.exports = notifRouter;
