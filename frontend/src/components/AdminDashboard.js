import React, { useState, useEffect } from 'react';
import { jobAPI, applicationAPI } from '../utils/api';
import styles from '../styles';

function AdminDashboard({ user, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [editApp, setEditApp] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobAPI.getAll(),
        applicationAPI.getAll() // fetch all applications for admin
      ]);
      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateStatus = async (appId) => {
    try {
      await applicationAPI.updateStatus(appId, { status: updatedStatus });
      alert('Application status updated!');
      setEditApp(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>ATS - Admin Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('jobs')}
          style={activeTab === 'jobs' ? styles.activeTab : styles.tab}
        >
          Jobs
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          style={activeTab === 'applications' ? styles.activeTab : styles.tab}
        >
          Applications
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div style={styles.content}>
          <h2>All Jobs</h2>
          <div style={styles.jobsGrid}>
            {jobs?.length > 0 ? (
              jobs.map(job => (
                <div key={job._id} style={styles.jobCard}>
                  <h3>{job.title}</h3>
                  <p style={styles.department}>{job.department}</p>
                  <p>{job.description}</p>
                  <span
                    style={{
                      ...styles.badge,
                      background: job.roleType === 'technical' ? '#3b82f6' : '#f59e0b'
                    }}
                  >
                    {job.roleType}
                  </span>
                </div>
              ))
            ) : (
              <p>No jobs found</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div style={styles.content}>
          <h2>All Applications</h2>
          <div style={styles.applicationsGrid}>
            {applications?.length > 0 ? (
              applications.map(app => (
                <div key={app._id} style={styles.appCard}>
                  <h3>{app.jobId?.title}</h3>
                  <p><strong>Applicant:</strong> {app.applicantId?.username}</p>
                  <p><strong>Status:</strong> {app.currentStatus}</p>

                  {app.jobId?.roleType === 'non-technical' && (
                    <div style={styles.editSection}>
                      {editApp === app._id ? (
                        <div style={styles.editBox}>
                          <select
                            value={updatedStatus}
                            onChange={(e) => setUpdatedStatus(e.target.value)}
                            style={styles.select}
                          >
                            <option>Applied</option>
                            <option>Reviewed</option>
                            <option>Interview</option>
                            <option>Offer</option>
                            <option>Rejected</option>
                            <option>Accepted</option>
                          </select>
                          <div style={styles.editButtons}>
                            <button
                              onClick={() => handleUpdateStatus(app._id)}
                              style={styles.saveBtn}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditApp(null)}
                              style={styles.cancelBtn}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditApp(app._id); setUpdatedStatus(app.currentStatus); }}
                          style={styles.applyBtn}
                        >
                          Edit Status
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No applications found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
