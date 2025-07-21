import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './askReceiptForCardWithdrawal.css';
import CardSideNavbar from '../../components/cardSideNavbar/cardSideNavbar';


export default function AskCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  const handleChoice = (choice) => {
    localStorage.setItem('wantsReceipt', choice);
    navigate(`/withdraw?account=${accountNumber}`);
  };

  return (
    <div className="askcard-container">
      <SessionTimeout timeoutDuration={5000000} />
      <CardSideNavbar/>
      <h2 className="askcard-title">Do you want a receipt for this Card Withdraw?</h2>
      <div className="askcard-buttons">
        <button onClick={() => handleChoice('yes')} className="askcard-btn yes-btn">Yes</button>
        <button onClick={() => handleChoice('no')} className="askcard-btn no-btn">No</button>
      </div>
    </div>
  );
}
