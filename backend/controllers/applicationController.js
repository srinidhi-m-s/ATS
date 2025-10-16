const Application = require('../models/Application');
const Job = require('../models/Job');

// Non-technical workflow
const NON_TECH_WORKFLOW = {
  Applied: 'Reviewed',
  Reviewed: 'Interview',
  Interview: 'Offer',
  Offer: null 
};

// Create new application (Applicant only)
exports.createApplication = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user.userId
    });
    if (existingApplication)
      return res.status(400).json({ message: 'You have already applied to this job' });

    const User = require('../models/User');
    const applicant = await User.findById(req.user.userId);

    const application = new Application({
      jobId,
      applicantId: req.user.userId,
      applicantName: applicant.username,
      applicantEmail: applicant.email,
      resume,
      coverLetter,
      roleType: job.roleType,
      currentStatus: 'Applied',
      activityLog: [{
        status: 'Applied',
        comment: 'Application submitted',
        updatedBy: 'Applicant'
      }]
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all applications for current user (Applicant)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user.userId })
      .populate('jobId', 'title department roleType')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all applications (Admin sees non-technical, Bot sees technical)
exports.getAllApplications = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'admin') filter.roleType = 'non-technical';
    if (req.user.role === 'bot') filter.roleType = 'technical';

    const applications = await Application.find(filter)
      .populate('jobId', 'title department roleType')
      .populate('applicantId', 'username email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title department roleType')
      .populate('applicantId', 'username email');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (req.user.role === 'applicant' && application.applicantId._id.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Access denied' });

    if (req.user.role === 'admin' && application.roleType !== 'non-technical')
      return res.status(403).json({ message: 'Access denied' });

    if (req.user.role === 'bot' && application.roleType !== 'technical')
      return res.status(403).json({ message: 'Access denied' });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update application status (Admin or Bot)
exports.updateApplicationStatus = async (req, res) => {
  try {
    let { status, comment } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Admin: non-technical applications
    if (req.user.role === 'admin') {
      if (application.roleType !== 'non-technical')
        return res.status(403).json({ message: 'Can only update non-technical applications' });

      // Next stage auto
      if (status === 'next') {
        const nextStatus = NON_TECH_WORKFLOW[application.currentStatus];
        if (!nextStatus)
          return res.status(400).json({ message: 'Application already at final stage' });
        status = nextStatus;
      }

      application.currentStatus = status;
      application.activityLog.push({
        status,
        comment: comment || 'Status updated by Admin',
        updatedBy: 'Admin',
        updatedAt: new Date()
      });
    }

    // Bot: technical applications
    if (req.user.role === 'bot') {
      if (application.roleType !== 'technical')
        return res.status(403).json({ message: 'Can only update technical applications' });

      application.currentStatus = status;
      application.activityLog.push({
        status,
        comment: comment || 'Updated by Bot Mimic',
        updatedBy: 'Bot Mimic',
        updatedAt: new Date()
      });
    }

    await application.save();
    res.json({ message: 'Application updated successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
