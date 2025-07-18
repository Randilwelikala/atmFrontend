import React from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout'

export default function AskCardlessWithdraw() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice); 
    if (choice === 'yes') {
      navigate(`/cardlessWithdraw?account=${accountNumber}`); 
    } else {
      navigate(`/cardlessWithdraw?account=${accountNumber}`); 
    }
  };

  return (
    <div className="atm-column card">
      <SessionTimeout timeoutDuration={500000} />
      <h2>Do you want a receipt for this Cardless transaction?</h2>
      <button onClick={() => handleChoice('yes')}>Yes</button>
      <button onClick={() => handleChoice('no')}>No</button>
    </div>
  );
}
