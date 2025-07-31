import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminLogin.css';

function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    const data = await res.json();
    if (res.ok) {
      navigate('/adminDashboard');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>Admin ID</label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
