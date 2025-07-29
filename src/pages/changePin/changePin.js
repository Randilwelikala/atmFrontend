import React, { useState } from 'react';
import axios from 'axios';
import './changePin.css';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
// import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';
import { useTranslation } from 'react-i18next';

export default function ChangePin() {
  const [accountNumber, setAccountNumber] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();

  const handleChangePin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      setError('New PIN must be exactly 4 numbers');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await axios.post('http://localhost:3001/changepin', {
        accountNumber,
        oldPin,
        newPin,
      },
      {headers: {
          Authorization: `Bearer ${token}`
      }
    });
      setMessage(t(res.data.message));
      setAccountNumber('');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'PIN change failed');
    }
  };

  return (
    <>
    {/* <CardSideNavbar/> */}
    <div className="change-pin-container">
      
      <SessionTimeout timeoutDuration={5000000} />
      <h2 className="change-pin-title">{t('Change Debit Card PIN')}</h2>
      <form onSubmit={handleChangePin} className="change-pin-form">
        <div className="form-group">
          <label>{t('Account Number')}:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            required
            className="change-pin-input"
          />
        </div>

        <div className="form-group">
          <label>{t('Old PIN')}:</label>
          <input
            type="password"
            value={oldPin}
            onChange={e => setOldPin(e.target.value)}
            required
            className="change-pin-input"
          />
        </div>

        <div className="form-group">
          <label>{t('New PIN')}:</label>
          <input
            type="password"
            value={newPin}
            onChange={e => {
              const value = e.target.value;
              if (/^\d{0,4}$/.test(value)) {
                setNewPin(value);
                setError('');
              } else {
                setError('New PIN must be exactly 4 digits');
              }
            }}
            className="change-pin-input"
            maxLength={4}
          />
        </div>

        <div className="form-group">
          <label>{t('Confirm New PIN')}:</label>
          <input
            type="password"
            value={confirmPin}
            onChange={e => setConfirmPin(e.target.value)}
            required
            className="change-pin-input"
            maxLength={4}
          />
        </div>

        <button type="submit" className="change-pin-button">{t('Change PIN')}</button>
      </form>

      {message && <p className="change-pin-message success">{message}</p>}
      {error && <p className="change-pin-message error">{error}</p>}
    </div>
    </>
  );
}
