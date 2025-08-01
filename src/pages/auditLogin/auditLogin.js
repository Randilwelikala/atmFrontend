import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auditLogin.css';

function AuditLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/audit/login', {
      method: 'POST',
       headers: { 'Content-Type': 'application/json' },
    //   headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    const data = await res.json();
    if (res.ok) {
      navigate('/auditDashboard');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Audit Login</h2>
      <form onSubmit={handleLogin}>
        <label>Audit ID</label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AuditLogin;
