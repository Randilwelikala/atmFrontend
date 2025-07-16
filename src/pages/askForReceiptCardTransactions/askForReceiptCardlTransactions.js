import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AskCard() {
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice); // Store 'yes' or 'no'
    if (choice === 'yes') {
      navigate('/GetCardAccountNumberandPin'); // or whatever your "yes" route is
    } else {
      navigate('/GetCardAccountNumberandPin'); // or "no" route
    }
  };

  return (
    <div className="atm-column card">
      <h2>Do you want a receipt for this Card transaction?</h2>
      <button onClick={() => handleChoice('yes')}>Yes</button>
      <button onClick={() => handleChoice('no')}>No</button>
    </div>
  );
}
