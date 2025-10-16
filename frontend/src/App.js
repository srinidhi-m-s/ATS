// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ApplicantDashboard from './components/ApplicantDashboard';
import AdminDashboard from './components/AdminDashboard';
import BotDashboard from './components/BotDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser, token) => {
    // Save in sessionStorage for tab-specific persistenc
    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    sessionStorage.setItem('token', token);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'bot':
        return <BotDashboard user={user} onLogout={handleLogout} />;
      default:
        return <ApplicantDashboard user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div>
      {!user ? (
        showRegister ? (
          <Register onLogin={handleLogin} setShowRegister={setShowRegister} />
        ) : (
          <Login onLogin={handleLogin} setShowRegister={setShowRegister} />
        )
      ) : (
        renderDashboard()
      )}
    </div>
  );
}

export default App;
