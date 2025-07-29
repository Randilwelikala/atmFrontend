import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './seeBalance.css';
// import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';
import { useTranslation } from 'react-i18next';

export default function SeeBalance() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);  
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountNumber) return;
    const token = localStorage.getItem('jwtToken');

    axios.get(`http://localhost:3001/user/${accountNumber}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }


  })
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
  }, [accountNumber]);

  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p className="loading-message">{t('Loading user details...')}</p>;

  return (
    <>
    {/* <CardSideNavbar/> */}
    <div className="balance-container">
      
      <SessionTimeout timeoutDuration={5000000} />
      
      <h2 className="balance-title">{t('Account Details')}</h2>
      <div className="balance-details">
        <p><strong>{t('Name')}:</strong> {user.name}</p>
        <p><strong>{t('Account Number')}:</strong> {user.accountNumber}</p>
        <p><strong>{t('Branch')}:</strong> {user.branch}</p>
        <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
        <p><strong>{t('Current Balance')}:</strong> {t('Rs')}. {user.balance}</p>
      </div>
    </div>
    </>
  );
}
