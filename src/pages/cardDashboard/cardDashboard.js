import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import LogoutButton from '../../components/logoutButton/logoutButton';
import './cardDashboard.css';
import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';
import { useTranslation } from 'react-i18next';


export default function CardDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const { t, i18n } = useTranslation();


  if (!accountNumber) {
    return <p className="loading-text">Loading...</p>;
  }

  const handleLogout = () => {
    navigate('/'); // redirect to home or login page after logout
  };

  return (
    <div className="card-dashboard-container" id="card-dashboard-page">
      <SessionTimeout timeoutDuration={500000} />
      <CardSideNavbar/>
      <div className="card-dashboard-column">
        <h2 className="dashboard-title">{t('Card Transactions')}</h2>
        <button onClick={() => navigate(`/AskCard?account=${accountNumber}`)} className="dashboard-btn">
          {t('Deposit Money')}
        </button>
        <button onClick={() => navigate(`/askCardWithdrawal?account=${accountNumber}`)} className="dashboard-btn">
          {t('Withdraw Money')}
        </button>
        <button onClick={() => navigate(`/SeeBalance?account=${accountNumber}`)} className="dashboard-btn">
          {t('View Balance')}
        </button>
        <button onClick={() => navigate(`/change-pin?account=${accountNumber}`)} className="dashboard-btn">
          {t('Change PIN')}
        </button>
        <button onClick={() => navigate(`/fundTransfer`)} className="dashboard-btn">
          {t('Fund Transfer')}
        </button>
        
      </div>
    </div>
  );
}
