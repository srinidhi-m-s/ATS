import React, { useState } from 'react';
import { authAPI } from '../utils/api';

function Login({ onLogin, setShowRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await authAPI.login(formData);
    const token = response.data.token;
    const loggedInUser = response.data.user;

    onLogin(loggedInUser, token); // send token along with user
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ATS Hybrid System</h2>
        <p style={styles.subtitle}>Login to your account</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.link}>
          Don't have an account?{' '}
          <span onClick={() => setShowRegister(true)} style={styles.linkText}>
            Register
          </span>
        </p>
        
        
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center'
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666'
  },
  linkText: {
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  demoCredentials: {
    marginTop: '30px',
    padding: '15px',
    background: '#f5f5f5',
    borderRadius: '5px',
    fontSize: '14px'
  }
};

export default Login;