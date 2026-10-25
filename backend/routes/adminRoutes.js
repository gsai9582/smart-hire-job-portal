// ── routes/adminRoutes.js ─────────────────────────────────────────────────────
const express = require('express');
const adminRouter = express.Router();
const { getDashboard, getUsers, blockUser, deleteUser, getAllJobs, toggleFeatureJob, deleteJob } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

adminRouter.use(protect, authorize('admin'));
adminRouter.get('/dashboard', getDashboard);
adminRouter.get('/users', getUsers);
adminRouter.put('/users/:id/block', blockUser);
adminRouter.delete('/users/:id', deleteUser);
adminRouter.get('/jobs', getAllJobs);
adminRouter.put('/jobs/:id/feature', toggleFeatureJob);
adminRouter.delete('/jobs/:id', deleteJob);

module.exports = adminRouter;
