import React, { useState, useEffect } from 'react';
import { botAPI } from '../utils/api';
import styles from '../styles';
function BotDashboard({ user, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [processing, setProcessing] = useState(false);

  const fetchPendingApps = async () => {
    try {
      const res = await botAPI.getPending();
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingApps();
  }, []);

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      await botAPI.processAll();
      fetchPendingApps();
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const handleProcessSingle = async (id) => {
    setProcessing(true);
    try {
      await botAPI.processSingle(id);
      fetchPendingApps();
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Bot Mimic Dashboard</h1>
        <div style={styles.userInfo}>
          <span>{user.username}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.content}>
        <button style={styles.submitBtn} onClick={handleProcessAll} disabled={processing}>
          {processing ? 'Processing...' : 'Process All Technical Applications'}
        </button>

        <div style={styles.applicationsGrid}>
          {applications.map(app => (
            <div key={app._id} style={styles.appCard}>
              <h3>{app.jobId?.title || 'No Job'}</h3>
              <p>Applicant: {app.applicantName}</p>
              <p>Status: {app.currentStatus}</p>
              <button
                style={styles.applyBtn}
                onClick={() => handleProcessSingle(app._id)}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Process'}
              </button>

              <div style={styles.timeline}>
                {app.activityLog.map((log, idx) => (
                  <div key={idx} style={styles.timelineItem}>
                    <strong>{log.status}</strong> by {log.updatedBy} at {new Date(log.updatedAt).toLocaleString()}
                    {log.comment && <p style={styles.comment}>{log.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BotDashboard;
