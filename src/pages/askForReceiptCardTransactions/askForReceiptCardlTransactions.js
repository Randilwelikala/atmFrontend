import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './askForReceiptCardTransactions.css';
import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';
import { useTranslation } from 'react-i18next';

export default function AskCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const { t, i18n } = useTranslation();

  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice);
    navigate(`/Deposit?account=${accountNumber}`);
  };

  return (
    <div className="ask-card-container" id="ask-card-page">
      <CardSideNavbar/>
      <SessionTimeout timeoutDuration={500000} />
      <h2 className="ask-card-title">{t('Do you want a receipt for this Card transaction?')}</h2>
      <div className="ask-card-buttons">
        <button onClick={() => handleChoice('yes')} className="ask-card-btn">{t('Yes')}</button>
        <button onClick={() => handleChoice('no')} className="ask-card-btn">{t('No')}</button>
      </div>
    </div>
  );
}
