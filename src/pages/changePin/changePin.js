import React, { useState } from 'react';
import axios from 'axios';
import './changePin.css';

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
    <div className="change-pin-container">
      <h2 className="change-pin-title">Change Debit Card PIN</h2>
      <form onSubmit={handleChangePin} className="change-pin-form">
        <div className="form-group">
          <label>Account Number:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            required
            className="change-pin-input"
          />
        </div>

        <div className="form-group">
          <label>Old PIN:</label>
          <input
            type="password"
            value={oldPin}
            onChange={e => setOldPin(e.target.value)}
            required
            className="change-pin-input"
          />
        </div>

        <div className="form-group">
          <label>New PIN:</label>
          <input
            type="password"
            value={newPin}
            onChange={e => setNewPin(e.target.value)}
            required
            className="change-pin-input"
          />
        </div>

        <div className="form-group">
          <label>Confirm New PIN:</label>
          <input
            type="password"
            value={confirmPin}
            onChange={e => setConfirmPin(e.target.value)}
            required
            className="change-pin-input"
          />
        </div>

        <button type="submit" className="change-pin-button">Change PIN</button>
      </form>

      {message && <p className="change-pin-message success">{message}</p>}
      {error && <p className="change-pin-message error">{error}</p>}
    </div>
  );
}
