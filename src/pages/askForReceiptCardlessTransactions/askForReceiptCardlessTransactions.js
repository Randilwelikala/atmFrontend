import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout'

export default function AskCardless() {
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice); 
    if (choice === 'yes') {
      navigate('/cardless-deposit'); 
    } else {
      navigate('/cardless-deposit'); 
    }
  };

  return (
    <div className="atm-column card">
      <SessionTimeout timeoutDuration={5000} />
      <h2>Do you want a receipt for this Cardless transaction?</h2>
      <button onClick={() => handleChoice('yes')}>Yes</button>
      <button onClick={() => handleChoice('no')}>No</button>
    </div>
  );
}
