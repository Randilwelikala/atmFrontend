import React from 'react';
import './logoutButton.css';
import { useTranslation } from 'react-i18next';

export default function LogoutButton({ onLogout }) {
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    
    if (onLogout) onLogout(null);
    
    window.location.href = '/';
  };

  return (
    <button onClick={handleLogout} className="logout-button" type="button">
      {t('Logout')}
    </button>
  );
}
