import React,{useRef } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import { useTranslation } from 'react-i18next';
import Adds from '../../components/adds/adds';

export default function Home({ onActionSelect }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const actionSectionRef = useRef(null);


  const handleSkipAd = () => {
  actionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
};

  return (
    <>
    <div className="home-page-container" id="home-page">      
      <SessionTimeout timeoutDuration={5000000*2} />
      <h1 className="home-title">{t('Welcome')}</h1>
      
      <div className="proceed-button-overlay">
        <button className="proceed-button" onClick={handleSkipAd}>
          {t('Proceed')} 
          <span className="arrow-down"></span>
        </button>
      </div>
      <Adds
        ads={[
          { type: 'image', src: '/ads/atm.png', alt: 'ATM Advertisement' },
          { type: 'video', src: '/ads/sample-video.mp4' },
        ]}
      />
      
      
      
      <div className="home-option-columns" ref={actionSectionRef}>
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
        <div className="home-option-card cardless-option" id="cardless-section">
          <h2 className="option-title">{t('Admin')}</h2>
          <button 
            className="home-button cardless-btn"
            onClick={() => navigate('/adminLogin')}
          >
            {t('Login')}
          </button>
        </div>
        
      </div>
    </div>
    </>
  );
}
