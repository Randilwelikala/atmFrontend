import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CheckPin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();


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
    <div >
      <h2>{t('Enter PIN for Accoun')}t {accountNumber}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="Enter PIN"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: 10 }}>{t('Login')}</button>
      </form>
    </div>
  );
}
