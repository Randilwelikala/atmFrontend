import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './askForReceiptCardlessTransactions.css'; // Import the CSS file
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';

export default function AskCardless() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

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
        Do you want a receipt for this Cardless transaction?
      </h2>
      <div className="ask-cardless-buttons">
        <button className="ask-btn" onClick={() => handleChoice('yes')}>Yes</button>
        <button className="ask-btn" onClick={() => handleChoice('no')}>No</button>
      </div>
    </div>
    </>
  );
}
