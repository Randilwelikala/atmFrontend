import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './getCardAccountNumberAndPin.css';

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
    <div className="login-container">
      <h2 className="login-title">For Deposit Money</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">Confirm</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
