const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, uploadResume, saveJob, getSavedJobs, getPublicProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/resume', protect, upload.single('resume'), uploadResume);
router.post('/save-job/:jobId', protect, saveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.get('/:id/public', getPublicProfile);

module.exports = router;
