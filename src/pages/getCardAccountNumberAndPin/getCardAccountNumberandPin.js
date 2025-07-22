import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './getCardAccountNumberAndPin.css';
import { useTranslation } from 'react-i18next';

export default function GetCardAccountNumberandPin() {
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();


  const handleLogin = async e => {
    e.preventDefault();
    setError('');

    if (!cardNumber) {
      setError('Enter a card number');
      return;
    }

    if (cardNumber.length !== 16) {
      setError('Card number must be exactly 16 digits');
      return;
    }

    if (!pin) {
      setError('Enter a PIN');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/cardLogin', {
        cardNumber,
        pin
      });

      if (res.data.success) {
        navigate(`/cardDashboard?account=${res.data.accountNumber}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="card-login-container" id="card-login-page">
      <SessionTimeout timeoutDuration={5000000} />
      <h2 className="card-login-title">{t('For Continue')}</h2>
      <form onSubmit={handleLogin} className="card-login-form">
        <input
          type="text"
        placeholder={t('Card Number')}
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
          className="card-login-input"
          maxLength={16}
          inputMode="numeric"
          pattern="\d{16}"
          title="Enter 16 digit card number"
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="card-login-input"
          maxLength={6}
          inputMode="numeric"
          pattern="\d+"
          title="Enter your PIN"
        />
        <button type="submit" className="card-login-button">{t('Confirm')}</button>
      </form>
      {error && <p className="card-login-error">{error}</p>}
    </div>
  );
}
