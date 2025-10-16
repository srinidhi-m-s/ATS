const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { auth, checkRole } = require('../middleware/auth');

// POST /api/jobs - Create job (Admin only)
router.post('/', auth, checkRole('admin'), createJob);

// GET /api/jobs - Get all active jobs (Anyone can view)
router.get('/', auth, getAllJobs);

// GET /api/jobs/:id - Get single job
router.get('/:id', auth, getJobById);

// PUT /api/jobs/:id - Update job (Admin only)
router.put('/:id', auth, checkRole('admin'), updateJob);

// DELETE /api/jobs/:id - Delete job (Admin only)
router.delete('/:id', auth, checkRole('admin'), deleteJob);

module.exports = router;