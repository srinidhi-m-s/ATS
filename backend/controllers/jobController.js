const Job = require('../models/Job');

// Create new job (Admin only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, department, roleType } = req.body;

    const job = new Job({
      title,
      description,
      department,
      roleType,
      createdBy: req.user.userId
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all active jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update job (Admin only)
exports.updateJob = async (req, res) => {
  try {
    const { title, description, department, roleType, status } = req.body;
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Update fields
    if (title) job.title = title;
    if (description) job.description = description;
    if (department) job.department = department;
    if (roleType) job.roleType = roleType;
    if (status) job.status = status;
    
    await job.save();
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete job (Admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};