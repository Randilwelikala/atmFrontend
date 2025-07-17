import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [accountNumber, setaccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/login', { accountNumber, pin });
      if (res.data.success) {
        onLogin({ accountNumber, balance: res.data.balance });
      }
    } catch {
      setError('Invalid card number or PIN');
    }
  };

  return (
    <div >
      <h2>ATM Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account Number:</label><br />
          <input type="text" value={accountNumber} onChange={e => setaccountNumber(e.target.value)} required />
        </div>
        <div>
          <label>PIN:</label><br />
          <input type="password" value={pin} onChange={e => setPin(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: 10 }}>Login</button>
      </form>
    </div>
  );
}
