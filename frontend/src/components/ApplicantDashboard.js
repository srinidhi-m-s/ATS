import React, { useState, useEffect } from 'react';
import { jobAPI, applicationAPI } from '../utils/api';
import styles from '../styles';

function ApplicantDashboard({ user, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({ resume: '', coverLetter: '' });
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, statsRes] = await Promise.all([
        jobAPI.getAll(),
        applicationAPI.getMy()
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await applicationAPI.create({
        jobId: selectedJob._id,
        ...applicationData
      });
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setApplicationData({ resume: '', coverLetter: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting application');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied': '#3b82f6',
      'Reviewed': '#f59e0b',
      'Interview': '#8b5cf6',
      'Offer': '#10b981',
      'Rejected': '#ef4444',
      'Accepted': '#059669'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>ATS - Applicant</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Applications</h3>
            <p style={styles.statNumber}>{stats.totalApplications}</p>
          </div>
          {stats.statusCounts.map(item => (
            <div key={item._id} style={styles.statCard}>
              <h3>{item._id}</h3>
              <p style={styles.statNumber}>{item.count}</p>
            </div>
          ))}
        </div>
      )}

      <div style={styles.tabs}>
        <button 
          onClick={() => setActiveTab('jobs')} 
          style={activeTab === 'jobs' ? styles.activeTab : styles.tab}
        >
          Available Jobs
        </button>
        <button 
          onClick={() => setActiveTab('applications')} 
          style={activeTab === 'applications' ? styles.activeTab : styles.tab}
        >
          My Applications
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div style={styles.content}>
          <h2>Available Jobs</h2>
          <div style={styles.jobsGrid}>
            {jobs.map(job => (
              <div key={job._id} style={styles.jobCard}>
                <h3>{job.title}</h3>
                <p style={styles.department}>{job.department}</p>
                <p>{job.description}</p>
                <div style={styles.jobMeta}>
                  <span style={{...styles.badge, background: job.roleType === 'technical' ? '#3b82f6' : '#f59e0b'}}>
                    {job.roleType}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Check if the user already applied for this job
                    const alreadyApplied = applications.some(app => app.jobId?._id === job._id);
                    if (alreadyApplied) {
                      alert('You have already applied for this job.');
                      return;
                    }
                    setSelectedJob(job);
                    setShowApplyModal(true);
                  }}
                  style={styles.applyBtn}
                  disabled={applications.some(app => app.jobId?._id === job._id)} 
                >
                  {applications.some(app => app.jobId?._id === job._id) ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div style={styles.content}>
          <h2>My Applications</h2>
          <div style={styles.applicationsGrid}>
            {applications.map(app => (
              <div key={app._id} style={styles.appCard}>
                <h3>{app.jobId?.title}</h3>
                <p style={styles.department}>{app.jobId?.department}</p>
                <div style={{...styles.status, background: getStatusColor(app.currentStatus)}}>
                  {app.currentStatus}
                </div>
                <div style={styles.timeline}>
                  <h4>Activity Timeline:</h4>
                  {app.activityLog.map((log, idx) => (
                    <div key={idx} style={styles.timelineItem}>
                      <strong>{log.status}</strong> - {log.updatedBy}
                      <br />
                      <small>{new Date(log.updatedAt).toLocaleString()}</small>
                      {log.comment && <p style={styles.comment}>{log.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showApplyModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Apply to {selectedJob.title}</h2>
            <form onSubmit={handleApply}>
              <input
                type="text"
                placeholder="Resume URL"
                value={applicationData.resume}
                onChange={(e) => setApplicationData({...applicationData, resume: e.target.value})}
                style={styles.input}
                required
              />
              <textarea
                placeholder="Cover Letter"
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                style={{...styles.input, minHeight: '100px'}}
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitBtn}>Submit Application</button>
                <button type="button" onClick={() => setShowApplyModal(false)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ApplicantDashboard;