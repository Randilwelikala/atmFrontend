// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GetCardAccountNumberandPin() {
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/login', {
        accountNumber,
        pin
      });

      if (res.data.success) {
        navigate(`/deposit?account=${accountNumber}`);
      } else {
        setError('Invalid account or PIN');
      }
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', marginTop: 50 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: 10 }}>Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
