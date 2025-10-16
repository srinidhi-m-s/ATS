const botService = require('../services/botService');

// Trigger bot to process all technical applications
exports.triggerBotProcessing = async (req, res) => {
  try {
    const result = await botService.processTechnicalApplications();
    
    res.json({
      message: result.message,
      processed: result.processed,
      total: result.total,
      results: result.results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Process single application
exports.processSingleApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await botService.processSingleApplication(id);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.json({
      message: result.message,
      application: result.application
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending applications
exports.getPendingApplications = async (req, res) => {
  try {
    const result = await botService.getPendingApplications();
    
    res.json({
      count: result.count,
      applications: result.applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};