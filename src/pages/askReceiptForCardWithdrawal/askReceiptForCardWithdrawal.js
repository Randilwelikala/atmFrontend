import React from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';

export default function AskCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account'); 

  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice); 
    if (choice === 'yes') {
      navigate(`/withdraw?account=${accountNumber}`); 
    } else {
      navigate(`/withdraw?account=${accountNumber}`); 
    }
  };

  return (
    <div className="atm-column card">
      <h2>Do you want a receipt for this Card Withdraw?</h2>
      <button onClick={() => handleChoice('yes')}>Yes</button>
      <button onClick={() => handleChoice('no')}>No</button>
    </div>
  );
}