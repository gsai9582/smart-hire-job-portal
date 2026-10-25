// ── routes/applicationRoutes.js ──────────────────────────────────────────────
const express = require('express');
const appRouter = express.Router();
const {
  applyForJob, getMyApplications, getJobApplications,
  updateApplicationStatus, withdrawApplication, getApplicationStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

appRouter.get('/my', protect, authorize('jobseeker'), getMyApplications);
appRouter.get('/stats', protect, getApplicationStats);
appRouter.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
appRouter.post('/:jobId', protect, authorize('jobseeker'), upload.single('resume'), applyForJob);
appRouter.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
appRouter.delete('/:id', protect, authorize('jobseeker'), withdrawApplication);

module.exports = appRouter;
