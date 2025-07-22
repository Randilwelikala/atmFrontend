import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './askForReceiptCardlessTransactions.css'; // Import the CSS file
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { useTranslation } from 'react-i18next';

export default function AskCardless() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const { t, i18n } = useTranslation();


  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice); 
    if (choice === 'yes') {
      navigate(`/cardless-deposit?account=${accountNumber}`); 
    } else {
      navigate(`/cardless-deposit?account=${accountNumber}`); 
    }
  };

  return (
    <>
    <CardlessSideNavbar/>
    <div className="ask-cardless-container">
      <SessionTimeout timeoutDuration={500000} />
      <h2 className="ask-cardless-heading">
        {t('Do you want a receipt for this Cardless transaction?')}
      </h2>
      <div className="ask-cardless-buttons">
        <button className="ask-btn" onClick={() => handleChoice('yes')}>{t('Yes')}</button>
        <button className="ask-btn" onClick={() => handleChoice('no')}>{t('No')}</button>
      </div>
    </div>
    </>
  );
}
