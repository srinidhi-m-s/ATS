const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { auth, checkRole } = require('../middleware/auth');

// POST /api/applications - Create application (Applicant only)
router.post('/', auth, checkRole('applicant'), createApplication);

// GET /api/applications/my - Get my applications (Applicant only)
router.get('/my', auth, checkRole('applicant'), getMyApplications);

// GET /api/applications - Get all applications (Admin sees non-tech, Bot sees tech)
router.get('/', auth, checkRole('admin', 'bot'), getAllApplications);

// GET /api/applications/:id - Get single application
router.get('/:id', auth, getApplicationById);

// PUT /api/applications/:id - Update application status (Admin or Bot)
router.put('/:id', auth, checkRole('admin', 'bot'), updateApplicationStatus);

module.exports = router;