const express = require('express');
const router = express.Router();
const {
  triggerBotProcessing,
  processSingleApplication,
  getPendingApplications
} = require('../controllers/botController');
const { auth, checkRole } = require('../middleware/auth');

// POST /api/bot/process - Trigger bot to process all applications (Bot only)
router.post('/process', auth, checkRole('bot'), triggerBotProcessing);

// POST /api/bot/process/:id - Process single application (Bot only)
router.post('/process/:id', auth, checkRole('bot'), processSingleApplication);

// GET /api/bot/pending - Get pending applications (Bot only)
router.get('/pending', auth, checkRole('bot'), getPendingApplications);

module.exports = router;