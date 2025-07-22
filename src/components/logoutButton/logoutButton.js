// src/components/logoutButton/LogoutButton.js
import React from 'react';
import axios from 'axios';
import './logoutButton.css';
import { useTranslation } from 'react-i18next';

export default function LogoutButton({ onLogout }) {
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      onLogout(null); // remove user from state
      window.location.href = '/'; // redirect to home/login
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button" type="button">
      {t('Logout')}
    </button>
  );
}
