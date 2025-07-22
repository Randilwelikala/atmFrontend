import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import { useTranslation } from 'react-i18next';

export default function Home({ onActionSelect }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="home-page-container" id="home-page">
      <SessionTimeout timeoutDuration={5000000*2} />
      <h1 className="home-title">{t('Welcome')}</h1>
      <div className="home-option-columns">
        <div className="home-option-card cardless-option" id="cardless-section">
          <h2 className="option-title">{t('Cardless Transactions')}</h2>
          <button 
            className="home-button cardless-btn"
            onClick={() => navigate('/cardlessDashboard')}
          >
            {t('Proceed')}
          </button>
        </div>
        <div className="home-option-card card-option" id="card-section">
          <h2 className="option-title">{t('Card Transactions')}</h2>
          <button 
            className="home-button card-btn"
            onClick={() => navigate('/GetCardAccountNumberandPin')}
          >
            {t('Proceed')}
          </button>         
        </div>
      </div>
    </div>
  );
}
