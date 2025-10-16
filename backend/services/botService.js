const Application = require('../models/Application');

// Define workflow stages
const WORKFLOW_STAGES = {
  'Applied': { next: 'Reviewed', comment: 'Application reviewed by Bot Mimic' },
  'Reviewed': { next: 'Interview', comment: 'Candidate shortlisted for interview by Bot Mimic' },
  'Interview': { next: 'Offer', comment: 'Interview completed, offer extended by Bot Mimic' },
  'Offer': { next: null, comment: 'Offer stage reached' }
};

// Process a single application
const processApplication = async (application) => {
  try {
    const currentStatus = application.currentStatus;
    const workflow = WORKFLOW_STAGES[currentStatus];

    if (!workflow || !workflow.next) {
      return { success: false, message: `Application ${application._id} is at final stage: ${currentStatus}` };
    }

    application.currentStatus = workflow.next;

    application.activityLog.push({
      status: workflow.next,
      comment: workflow.comment,
      updatedBy: 'Bot Mimic',
      updatedAt: new Date()
    });

    await application.save();

    return { success: true, message: `Application ${application._id} moved from ${currentStatus} to ${workflow.next}`, application };
  } catch (error) {
    return { success: false, message: `Error processing application: ${error.message}` };
  }
};

// Process all pending technical applications
exports.processTechnicalApplications = async () => {
  try {
    const applications = await Application.find({
      roleType: 'technical',
      currentStatus: { $nin: ['Offer', 'Rejected', 'Accepted'] }
    })
      .populate('jobId', 'title department')
      .populate('applicantId', 'username email');

    if (!applications.length) {
      return { success: true, message: 'No applications to process', processed: 0, results: [] };
    }

    const results = [];
    for (const app of applications) {
      results.push(await processApplication(app));
    }

    const successCount = results.filter(r => r.success).length;

    return { success: true, message: `Processed ${successCount} out of ${applications.length} applications`, processed: successCount, total: applications.length, results };
  } catch (error) {
    return { success: false, message: `Bot processing error: ${error.message}`, processed: 0, results: [] };
  }
};

// Process single application by ID
exports.processSingleApplication = async (applicationId) => {
  try {
    const application = await Application.findById(applicationId);
    if (!application) return { success: false, message: 'Application not found' };
    if (application.roleType !== 'technical') return { success: false, message: 'Bot can only process technical applications' };

    return await processApplication(application);
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
};

// Get pending applications
exports.getPendingApplications = async () => {
  try {
    const applications = await Application.find({
      roleType: 'technical',
      currentStatus: { $nin: ['Offer', 'Rejected', 'Accepted'] }
    })
      .populate('jobId', 'title department')
      .populate('applicantId', 'username email')
      .sort({ createdAt: 1 });

    return { success: true, count: applications.length, applications };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}`, applications: [] };
  }
};
