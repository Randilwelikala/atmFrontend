import React, { useState } from 'react';
import axios from 'axios';

export default function ChangePin() {
  const [accountNumber, setAccountNumber] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/changepin', {
        accountNumber,
        oldPin,
        newPin,
      });
      setMessage(res.data.message);
      setAccountNumber('');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'PIN change failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <h2>Change Debit Card PIN</h2>
      <form onSubmit={handleChangePin}>
        <div>
          <label>Account Number:</label><br />
          <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Old PIN:</label><br />
          <input type="password" value={oldPin} onChange={e => setOldPin(e.target.value)} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>New PIN:</label><br />
          <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Confirm New PIN:</label><br />
          <input type="password" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: 15 }}>Change PIN</button>
      </form>

      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
