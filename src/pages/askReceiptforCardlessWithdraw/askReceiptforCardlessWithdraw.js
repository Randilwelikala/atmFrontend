import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './askReceiptforCardlessWithraw.css';

export default function AskCardlessWithdraw() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice); 
    navigate(`/cardlessWithdraw?account=${accountNumber}`);
  };

  return (
    <div className="ask-cardless-container" id="ask-cardless-receipt">
      <SessionTimeout timeoutDuration={500000} />
      <h2 className="ask-cardless-title">
        Do you want a receipt for this Cardless transaction?
      </h2>
      <div className="ask-cardless-buttons">
        <button className="ask-cardless-btn yes-btn" onClick={() => handleChoice('yes')}>Yes</button>
        <button className="ask-cardless-btn no-btn" onClick={() => handleChoice('no')}>No</button>
      </div>
    </div>
  );
}
