import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import LogoutButton from '../../components/logoutButton/logoutButton';
import './cardDashboard.css';

export default function CardDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  if (!accountNumber) {
    return <p className="loading-text">Loading...</p>;
  }

  const handleLogout = () => {
    navigate('/'); // redirect to home or login page after logout
  };

  return (
    <div className="card-dashboard-container" id="card-dashboard-page">
      <SessionTimeout timeoutDuration={500000} />
      <div className="card-dashboard-column">
        <h2 className="dashboard-title">Card Transactions</h2>
        <button onClick={() => navigate(`/AskCard?account=${accountNumber}`)} className="dashboard-btn">
          Deposit Money
        </button>
        <button onClick={() => navigate(`/askCardWithdrawal?account=${accountNumber}`)} className="dashboard-btn">
          Withdraw Money
        </button>
        <button onClick={() => navigate(`/SeeBalance?account=${accountNumber}`)} className="dashboard-btn">
          View Balance
        </button>
        <button onClick={() => navigate(`/change-pin?account=${accountNumber}`)} className="dashboard-btn">
          Change PIN
        </button>
        <button onClick={() => navigate(`/fundTransfer`)} className="dashboard-btn">
          Fund Transfer
        </button>
        <LogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
}
