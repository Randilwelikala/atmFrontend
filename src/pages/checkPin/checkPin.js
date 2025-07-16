import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function CheckPin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/login', { accountNumber, pin });
      if (res.data.success) {
        alert(`Login successful! Balance: ${res.data.balance}`);        
      }
    } catch {
      setError('Invalid PIN!');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', marginTop: 50 }}>
      <h2>Enter PIN for Account {accountNumber}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="Enter PIN"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: 10 }}>Login</button>
      </form>
    </div>
  );
}
