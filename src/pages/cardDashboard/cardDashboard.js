import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CardDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  // Don't render until accountNumber is available
  if (!accountNumber) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading...</p>;
  }

  return (
    <div className="atm-home-container">                 
      <div className="atm-column card">
        <h2>Card Transactions</h2>
        <button onClick={() => navigate(`/AskCard?account=${accountNumber}`)}>
          Deposit Money
        </button>
        <button onClick={() => navigate(`/askCardWithdrawal?account=${accountNumber}`)}>
          Withdraw Money
        </button>        
        <button onClick={() => navigate(`/SeeBalance?account=${accountNumber}`)}>
          View Balance            
        </button>          
        <button onClick={() => navigate(`/change-pin?account=${accountNumber}`)}>
          Change PIN
        </button>
      </div>
    </div>
  );
}
