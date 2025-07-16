import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';

export default function Home({ onActionSelect }) {
  const navigate = useNavigate();
  return (
    <div className="atm-home-container">
      <h1>Welcome</h1>
      <div className="atm-columns">
        <div className="atm-column cardless">
          <h2>Cardless Transactions</h2>
          <button onClick={() => navigate('/ask')}>
            proceed
          </button>
        </div>
        <div className="atm-column card">
          <h2>Card Transactions</h2>
          <button onClick={() => navigate('/GetCardAccountNumberandPin')}>
            Proceed
          </button>         
        </div>
      </div>
    </div>
  );
}
