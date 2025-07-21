import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';

export default function Home({ onActionSelect }) {
  const navigate = useNavigate();

  return (
    <div className="home-page-container" id="home-page">
      <SessionTimeout timeoutDuration={5000000*2} />
      <h1 className="home-title">Welcome</h1>
      <div className="home-option-columns">
        <div className="home-option-card cardless-option" id="cardless-section">
          <h2 className="option-title">Cardless Transactions</h2>
          <button 
            className="home-button cardless-btn"
            onClick={() => navigate('/cardlessDashboard')}
          >
            Proceed
          </button>
        </div>
        <div className="home-option-card card-option" id="card-section">
          <h2 className="option-title">Card Transactions</h2>
          <button 
            className="home-button card-btn"
            onClick={() => navigate('/GetCardAccountNumberandPin')}
          >
            Proceed
          </button>         
        </div>
      </div>
    </div>
  );
}
